# テレメトリAPI ドキュメント

## 概要
ラズパイデバイスから心拍数と距離データを送信するためのAPIエンドポイントです。

## エンドポイント
```
POST /api/telemetry
```

## リクエスト仕様

### ヘッダー
```
Content-Type: application/json
```

### リクエストボディ
```json
{
  "deviceId": "string",        // 自身のデバイスID（必須）
  "nearbyDeviceId": "string",  // 近くにいたデバイスID（必須）
  "distance": number,          // 一番近くにいたデバイスとの距離（メートル、必須）
  "heartRate": number          // 脈拍（BPM、必須、30-250の範囲）
}
```

### バリデーションルール
- `deviceId`: 空文字列不可
- `nearbyDeviceId`: 空文字列不可
- `distance`: 0以上
- `heartRate`: 30-250の範囲

## レスポンス仕様

### 成功時（200 OK）
```json
{
  "success": true,
  "message": "テレメトリデータが正常に保存されました",
  "data": {
    "eventId": "uuid",
    "deviceId": "string",
    "timestampMs": 1234567890123,
    "heartRate": 120,
    "nearbyDeviceId": "string",
    "distance": 1500
  }
}
```

### エラー時

#### デバイス割り当てが見つからない場合（404 Not Found）
```json
{
  "success": false,
  "error": "デバイスIDに対応する割り当て情報が見つかりません",
  "deviceId": "dev_001"
}
```

#### バリデーションエラー（400 Bad Request）
```json
{
  "success": false,
  "error": "データの形式が正しくありません",
  "details": [
    {
      "field": "heartRate",
      "message": "心拍数は30-250の範囲である必要があります"
    }
  ]
}
```

#### サーバーエラー（500 Internal Server Error）
```json
{
  "success": false,
  "error": "サーバー内部エラーが発生しました"
}
```

## データベース保存内容

### telemetryテーブル
- `event_id`: device_assignmentsから取得したイベントID
- `device_id`: リクエストのdeviceId
- `timestamp_ms`: API実行時刻（ミリ秒）
- `heart_rate_bpm`: リクエストのheartRate
- `battery_pct`: null（将来の拡張用）

### telemetry_peersテーブル
- `event_id`: device_assignmentsから取得したイベントID
- `device_id`: リクエストのdeviceId
- `peer_device_id`: リクエストのnearbyDeviceId
- `timestamp_ms`: API実行時刻（ミリ秒）
- `distance_m`: リクエストのdistance（メートルに変換）

## 使用例

### cURLでのテスト
```bash
curl -X POST http://localhost:3000/api/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "dev_001",
    "nearbyDeviceId": "dev_002",
    "distance": 1.5,
    "heartRate": 120
  }'
```

### JavaScriptでの使用例
```javascript
const response = await fetch('http://localhost:3000/api/telemetry', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    deviceId: 'dev_001',
    nearbyDeviceId: 'dev_002',
    distance: 1.5,
    heartRate: 120
  })
})

const result = await response.json()
console.log(result)
```

### Pythonでの使用例
```python
import requests
import json

url = 'http://localhost:3000/api/telemetry'
data = {
    'deviceId': 'dev_001',
    'nearbyDeviceId': 'dev_002',
    'distance': 1.5,
    'heartRate': 120
}

response = requests.post(url, json=data)
print(response.json())
```

## テスト方法

### 手動テスト
1. 開発サーバーが起動していることを確認
2. 上記の使用例を参考にリクエストを送信
3. レスポンスを確認

## 注意事項

1. **デバイス割り当て**: デバイスIDは事前に管理画面から`device_assignments`テーブルに登録されている必要があります
2. **タイムスタンプ**: API実行時刻が`timestamp_ms`として保存されます
3. **距離の単位**: リクエストの`distance`はメートル単位で送信してください
4. **CORS**: 外部からのアクセスに対応しています
5. **トランザクション**: データの整合性を保つため、トランザクション内で保存されます

## 事前準備

APIを使用する前に、以下の手順でデータを準備してください：

1. **管理画面にアクセス**: http://localhost:3000/admin/login
2. **管理者でログイン**: 管理者アカウントでログイン
3. **イベント作成**: 新しいイベントを作成
4. **参加者登録**: 参加者アカウントを作成
5. **デバイス登録**: デバイスを登録
6. **デバイス割り当て**: イベントに参加者とデバイスを割り当て

## トラブルシューティング

### よくあるエラー

1. **404エラー**: デバイスIDが`device_assignments`に登録されていない
2. **400エラー**: リクエストデータの形式が正しくない
3. **500エラー**: データベース接続エラーまたはサーバー内部エラー

### デバッグ方法

1. サーバーログを確認
2. データベースの`device_assignments`テーブルを確認
3. リクエストデータの形式を確認
