# 要件定義書（MVP版）

## 1. システム概要

* 男女混合のスポーツイベントで使用するシステム。
* 各参加者はデバイスを装着し、心拍数と他参加者との相対距離を10秒ごとに計測・送信する。
* イベント終了時およびインターバル中に、心拍数と距離のデータを基にマッチング結果を算出し、参加者に提示する。

---

## 2. システム構成

### 2.1 デバイス

* 各参加者に1台配布。
* デバイスは直接インターネットに接続し、サーバーAPIへ10秒間隔でデータ送信。
* 送信内容：

  ```json
  {
    "device_id": "dev_0123",
    "event_id": "evt_20250911_tokyo",
    "timestamp": 1756963200123,
    "heart_rate_bpm": 112,
    "peers": [
      {"peer_device_id": "dev_0456", "distance_m": 1.8},
      {"peer_device_id": "dev_0789", "distance_m": 3.2}
    ]
  }
  ```

### 2.2 サーバー / API

* 通信方式：HTTPS
* 認証方式：MVP段階では未実装（将来的にBearer Token）
* イベント終了ボタン押下時に一括マッチング計算を実行。
* インターバル中は暫定結果を1回だけ参加者画面に表示。

### 2.3 Webシステム

* 参加者用Web（スマホ/PC対応）
* 運営用Web（管理画面）

---

## 3. 機能要件

### 3.1 参加者向け（更新）

* **ログイン画面**：**メール＋パスワード**でログイン
* **プロフィール登録/編集画面**：ニックネーム、性別、画像、紹介文
* **マッチング結果画面**：

  * 誰と近くにいる時に一番ドキドキしたか
  * 最大心拍数のとき、誰が近くにいたか
  * もっとも近くにいた人

### 3.2 運営向け（更新）

* **ログイン画面**：**メール＋パスワード**
* **イベント作成**（イベント名・日時・人数）
* **参加者アカウント作成／機器割り当て**（参加者は**メール**でアカウントを持つ）
* **イベントステータス管理**（測定開始／インターバル／終了／結果公開）
* **結果確認画面**（参加者ごとの結果一覧）

---

## 4. 非機能要件

* 想定規模：参加者10名程度、1〜2時間イベント
* 通信頻度：10秒ごとに1デバイス1リクエスト
* 保存方針：心拍・距離データの生データも保持
* セキュリティ：

  * MVP：参加者ログイン＝メール/パスワード、API通信＝HTTPSのみ
  * 将来的に：Bearer認証、暗号化保存等を検討

---

## 5. マッチング算出ロジック

* 詳細な閾値・判定ルールは後日協議
* 算出対象：

  * 「誰と近くにいる時に一番ドキドキしたか」
  * 「最大心拍数のとき、誰が近くにいたか」
  * 「もっとも近くにいた人」

---

## 6. 今後協議が必要な点

* 距離・心拍の閾値（m, bpm, 継続秒数など）
* 算出ロジックの重み付け・例外処理
* 結果画面の詳細UI（リスト形式・グラフ形式など）
* 将来的なセキュリティ強化範囲

---

## 7. 技術スタック / アーキテクチャ（確定・更新）

* **フロントエンド**：Next.js 15（App Router, TypeScript, RSC, Tailwind, shadcn/ui, react-hook-form + zod）
* **認証**：**Supabase Auth（Email + Password）**

  * 参加者／管理者ともメールアドレスでログイン
  * メール検証（Confirm）はMVPでは任意、将来ON想定
* **API**：Supabase Edge Functions（TypeScript）

  * `/telemetry`（計測受信）、`/admin/*`（運営）、`/results`（結果取得）
* **DB**：Supabase Postgres（ORM: **Drizzle**）

  * （将来）TimescaleDB 拡張の選択余地あり
* **ストレージ**：Supabase Storage（プロフィール画像）
* **ホスティング**：フロント＝Vercel、DB/Functions/Storage＝Supabase
* **ジョブ**：Supabase Scheduled Functions（インターバル／終了時の集計）
* **監視/ログ**：Sentry（Web/Functions）、Supabase Logs
* **CI/CD**：GitHub Actions → Vercel / Supabase

---

## 8. 認証 / 認可設計（更新）

### 8.1 アカウントモデル（更新）

* `auth.users`（Supabase Auth ユーザ本体）

  * **email** を一次識別子として利用（参加者・管理者共通）
* `public.profiles`（アプリ拡張）

  * `id uuid` … `auth.users.id` と同一（PK）
  * `role text` … `participant` | `admin`
  * `nickname text`, `gender text`, `image_url text`, `bio text`, `created_at timestamptz`
  * （必要なら `email` を冗長保持してもよいが、基本は `auth.users` を参照）

### 8.2 サインアップ/事前登録（更新）

* 運営が**メールアドレス**で事前登録（Service Role で `auth.users` 作成、初期パスワード付与）
* 返却 `user.id` で `profiles` に INSERT（`role` ほか）

### 8.3 ログイン（更新）

* 画面入力：**email + password**
* `supabase.auth.signInWithPassword({ email, password })`
* SSR は `@supabase/ssr` でセッション連携

### 8.4 RLS（方向性は同じ）

* `profiles`：本人のみ参照/更新（`auth.uid() = id`）
* 結果系：参加者は自分の結果のみ、管理者は全体参照/操作可

---

## 9. API実装方針（要件で定義したAPIとの対応）

* **実装レイヤ**：原則 **Supabase Edge Functions** として実装

  * 例：`POST /telemetry`（デバイス受信）
  * 例：`POST /admin/events`、`PATCH /admin/events/{id}/status`、`GET /results` 等
* **Base URL**：`https://{project}.functions.supabase.co/api/v1/*`（ルーティングで合わせる）
* **認証**：

  * MVP：デバイスAPIは HTTPS のみ（将来 **Bearer/HMAC** を追加）
  * 参加者/運営APIは Supabase Auth セッションを前提（JWT）
* **レート制限**：MVPは緩め、将来 Cloudflare / Supabase 付近で導入
* **インターバル/終了時集計**：`PATCH /admin/events/{id}/status` 遷移時に Edge Function 内で計算ジョブを起動（後述）

> 既存の API 仕様（/telemetry, /results, /admin/\*）は維持しつつ、実体は Edge Functions で提供。

---

## 10. データベース / スキーマ指針（Drizzle）

### 10.1 テーブル（最小）

* `participants`（\*profiles と統合可／アプリ側参照向け）
* `profiles(id, role, nickname, gender, image_url, bio, created_at)`
* `events(id, name, starts_at_ms, ends_at_ms, status)`
* `devices(id, note, registered_at)`
* `device_assignments(event_id, participant_id, device_id, assigned_at)`

  * Unique 制約：(`event_id`,`participant_id`) / (`event_id`,`device_id`)
* `telemetry(event_id, device_id, timestamp_ms, heart_rate_bpm, battery_pct)`

  * IDX：(`event_id`,`device_id`,`timestamp_ms`)
* `telemetry_peers(event_id, device_id, peer_device_id, timestamp_ms, distance_m)`

  * IDX：(`event_id`,`device_id`,`timestamp_ms`), (`event_id`,`peer_device_id`,`timestamp_ms`)
* `results_interval(event_id, generated_at_ms, per_participant_json)`
* `results_final(event_id, generated_at_ms, per_participant_json)`

### 10.2 保持方針

* 生データ（心拍/距離）も保持（期間は後日決定）
* 将来、集計テーブルやパーティショニング（event\_id / 日付）導入で拡張

---

## 11. 集計ジョブ / バッチ

* **インターバル突入（status: interval）**

  * その時点までのデータで暫定結果を生成 → `results_interval` へ保存（1回のみ）
* **終了（status: ended → published）**

  * 終了直後に確定計算を実行（必要なら `POST /admin/events/{id}/compute` トリガを用意）
  * 完了後 `published` へ遷移、参加者 `GET /results?phase=final` で公開
* **実行基盤**：Supabase Edge Functions + Scheduled Functions（必要に応じて再計算/再実行）

> idempotency-key（将来導入）で重複トリガを安全化。

---

## 12. 運用 / 監視 / セキュリティ

* **環境**：`dev` / `stg` / `prod`（Supabaseプロジェクト分割）
* **CI/CD**：GitHub Actions（lint/型/簡易e2e → Vercel & Supabase デプロイ）
* **監視**：Sentry（フロント/Functions）、Supabase Logs
* **秘密情報**：Vercel/Supabase のプロジェクトシークレットで管理
* **セキュリティ（MVP）**：

  * 参加者/管理者：Supabase Auth（ID+PW）
  * デバイスAPI：HTTPS のみ（将来 Bearer/HMAC/mTLS 追加余地）
  * RLS：本人/ロールで閲覧制御を最小実装
* **バックアップ**：Supabase 自動バックアップ + エクスポート手順整備

---

## 13. ディレクトリ構成（例）

```
apps/
  web/                      # Next.js (Vercel)
    app/
      (auth|dashboard|results|profile)/...
    lib/supabase/
    components/
    styles/
    package.json
  functions/                # Supabase Edge Functions
    api/
      v1/
        telemetry.ts
        admin/
          events.ts
          events_[id]_status.ts
          participants_bulk.ts
          device-assignments_bulk.ts
        results.ts
    package.json
packages/
  db/
    drizzle/
      schema.ts
      migrations/
    package.json
```

---

## 14. 環境変数（例・.env.example）

* **Next.js（Vercel）**

  * `NEXT_PUBLIC_SUPABASE_URL`
  * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  * `SUPABASE_SERVICE_ROLE_KEY`（※サーバーアクションでの管理処理に限定利用）
* **Edge Functions（Supabase）**

  * `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  * 必要に応じて `JWT_SECRET`、`COMPUTE_CONCURRENCY` 等

> Service Role は管理系（事前登録/割当）でのみ使用。最小権限・保護必須。

---

## 15. 変更影響（既存API定義との整合）

* 参加者ログイン：画面は `email + password`、**Supabase Auth** へ委譲
* `/telemetry`：Edge Function として実装（MVPは認証なし、将来Bearer/HMAC）
* `/admin/*` `/results`：Edge Functions 化。Next.js 側からは fetch で呼び出し
* 既存の **レスポンス構造/キー名は維持**（移植容易性を担保）

---

## 16. 今後の技術検討（MVP後）

* `/telemetry` の**HMAC署名**・**レート制限**・**重複防止（idempotency-key）**
* 時系列最適化（TimescaleDB / パーティショニング）
* 規模拡大時の **受信系の分離**（Workers 等）
* 結果画面の可視化強化（グラフ/タイムライン/接触ネットワーク図）
* 管理者の監視ダッシュボード（欠測率、センサー品質、端末バッテリ）

---
