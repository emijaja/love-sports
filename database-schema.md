# Love Sports データベース設計書

## 概要
Love Sportsシステムのデータベーススキーマ定義書です。PostgreSQLを使用し、Drizzle ORMで管理されています。

## テーブル一覧

### 1. profiles（プロフィール）
**説明**: ユーザー（参加者・管理者）のプロフィール情報を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | ユーザーID（auth.users.idと連携） |
| nickname | TEXT | | ニックネーム |
| gender | TEXT | | 性別 |
| image_url | TEXT | | プロフィール画像URL |
| bio | TEXT | | 自己紹介文 |
| role | TEXT | DEFAULT 'user' | ロール（'admin' または 'user'） |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新日時 |

**制約**:
- `valid_role`: roleは'admin'または'user'のみ許可

### 2. events（イベント）
**説明**: スポーツイベントの基本情報を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | UUID | PRIMARY KEY | イベントID（自動生成） |
| name | TEXT | NOT NULL | イベント名 |
| starts_at_ms | BIGINT | NOT NULL | 開始時刻（ミリ秒） |
| ends_at_ms | BIGINT | NOT NULL | 終了時刻（ミリ秒） |
| status | TEXT | NOT NULL | ステータス（'preparing', 'active', 'interval', 'ended', 'published'） |
| created_at | TIMESTAMP | DEFAULT NOW() | 作成日時 |

### 3. devices（デバイス）
**説明**: 心拍数・距離計測デバイスの情報を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| id | TEXT | PRIMARY KEY | デバイスID |
| note | TEXT | | デバイスに関するメモ |
| registered_at | TIMESTAMP | DEFAULT NOW() | 登録日時 |

### 4. device_assignments（デバイス割り当て）
**説明**: イベントにおける参加者とデバイスの割り当て関係を管理

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | UUID | REFERENCES events(id) | イベントID |
| participant_id | UUID | REFERENCES profiles(id) | 参加者ID |
| device_id | TEXT | REFERENCES devices(id) | デバイスID |
| assigned_at | TIMESTAMP | DEFAULT NOW() | 割り当て日時 |

**制約**:
- `unique_event_participant`: (event_id, participant_id)の組み合わせは一意
- `unique_event_device`: (event_id, device_id)の組み合わせは一意

### 5. telemetry（テレメトリデータ）
**説明**: デバイスから送信される心拍数・バッテリー情報を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | UUID | REFERENCES events(id) | イベントID |
| device_id | TEXT | REFERENCES devices(id) | デバイスID |
| timestamp_ms | BIGINT | NOT NULL | 計測時刻（ミリ秒） |
| heart_rate_bpm | INTEGER | | 心拍数（BPM） |
| battery_pct | INTEGER | | バッテリー残量（%） |

**インデックス**:
- `telemetry_event_device_timestamp_idx`: (event_id, device_id, timestamp_ms)

### 6. telemetry_peers（ピア距離データ）
**説明**: デバイス間の距離情報を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | UUID | REFERENCES events(id) | イベントID |
| device_id | TEXT | REFERENCES devices(id) | 送信元デバイスID |
| peer_device_id | TEXT | REFERENCES devices(id) | 対象デバイスID |
| timestamp_ms | BIGINT | NOT NULL | 計測時刻（ミリ秒） |
| distance_m | INTEGER | NOT NULL | 距離（メートル） |

**インデックス**:
- `telemetry_peers_event_device_timestamp_idx`: (event_id, device_id, timestamp_ms)
- `telemetry_peers_event_peer_timestamp_idx`: (event_id, peer_device_id, timestamp_ms)

### 7. results_interval（インターバル結果）
**説明**: インターバル中に生成された暫定マッチング結果を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | UUID | PRIMARY KEY | イベントID（events.idと1:1） |
| generated_at_ms | BIGINT | NOT NULL | 生成時刻（ミリ秒） |
| per_participant_json | JSONB | NOT NULL | 参加者ごとの結果データ（JSON） |

### 8. results_final（最終結果）
**説明**: イベント終了後に生成された確定マッチング結果を格納

| カラム名 | データ型 | 制約 | 説明 |
|---------|---------|------|------|
| event_id | UUID | PRIMARY KEY | イベントID（events.idと1:1） |
| generated_at_ms | BIGINT | NOT NULL | 生成時刻（ミリ秒） |
| per_participant_json | JSONB | NOT NULL | 参加者ごとの結果データ（JSON） |

## リレーションシップ

### 主要な関係
1. **profiles ↔ events**: 多対多（device_assignments経由）
2. **events ↔ devices**: 多対多（device_assignments経由）
3. **events → telemetry**: 1対多
4. **events → telemetry_peers**: 1対多
5. **events → results_interval**: 1対1
6. **events → results_final**: 1対1

### 外部キー制約
- `device_assignments.event_id` → `events.id`
- `device_assignments.participant_id` → `profiles.id`
- `device_assignments.device_id` → `devices.id`
- `telemetry.event_id` → `events.id`
- `telemetry.device_id` → `devices.id`
- `telemetry_peers.event_id` → `events.id`
- `telemetry_peers.device_id` → `devices.id`
- `telemetry_peers.peer_device_id` → `devices.id`
- `results_interval.event_id` → `events.id`
- `results_final.event_id` → `events.id`

## インデックス設計

### パフォーマンス最適化
1. **テレメトリデータ**: 時系列データの高速検索のため複合インデックス
2. **ピア距離データ**: 双方向の距離検索のため2つのインデックス
3. **イベント関連**: イベント単位でのデータ取得を高速化

### 推奨追加インデックス
- `profiles.role`: 管理者・参加者の絞り込み
- `events.status`: イベントステータスでの絞り込み
- `events.starts_at_ms`: 日時範囲での絞り込み

## データ保持ポリシー

### 生データ保持
- テレメトリデータとピア距離データは生データを保持
- 分析・再計算のための柔軟性を確保

### 結果データ
- インターバル結果と最終結果を分離保存
- 結果の比較・検証が可能

## セキュリティ考慮事項

### Row Level Security (RLS)
- `profiles`: 本人のみアクセス可能
- `events`: 参加者は自分のイベントのみ、管理者は全体アクセス
- `results_*`: 参加者は自分の結果のみ、管理者は全体アクセス

### データ型の選択
- UUID: セキュリティとスケーラビリティの向上
- BIGINT: ミリ秒精度のタイムスタンプ対応
- JSONB: 柔軟な結果データ構造

## 拡張性考慮

### 将来の拡張ポイント
1. **時系列データ最適化**: TimescaleDB拡張の検討
2. **パーティショニング**: イベント単位でのテーブル分割
3. **アーカイブ**: 古いデータの圧縮・アーカイブ
4. **リアルタイム処理**: ストリーミング処理の最適化
