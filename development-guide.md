# Love Sports システム開発手順書

## 1. 開発環境セットアップ

### 1.1 前提条件

- Node.js 18+
- pnpm
- Git
- Supabase CLI

### 1.2 Monorepo プロジェクト初期化

```bash
# プロジェクトルートディレクトリ構成作成
mkdir -p apps/web apps/functions packages/db

# Workspace設定（pnpmを使用）
echo 'packages:
  - "apps/*"
  - "packages/*"' > pnpm-workspace.yaml

# ルートpackage.json作成
cat > package.json << 'EOF'
{
  "name": "love-sports-monorepo",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel run dev",
    "build": "pnpm --recursive run build",
    "test": "pnpm --recursive run test",
    "lint": "pnpm --recursive run lint",
    "type-check": "pnpm --recursive run type-check"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
EOF

# ルートのpnpm install
pnpm install
```

### 1.3 Next.js アプリケーション作成 (apps/web)

```bash
cd apps/web

# Next.js プロジェクト作成（現在のディレクトリに）
npx create-next-app@14 . --typescript --tailwind --app --src-dir --import-alias "@/*"

# 必要パッケージインストール
pnpm install @supabase/supabase-js @supabase/ssr @supabase/auth-ui-react @supabase/auth-ui-shared
pnpm install drizzle-orm postgres
pnpm install @hookform/resolvers react-hook-form zod
pnpm install lucide-react class-variance-authority clsx tailwind-merge

# shadcn/ui セットアップ
npx shadcn-ui@latest init --cwd .
```

### 1.4 データベースパッケージ設定 (packages/db)

```bash
cd ../../packages/db

# package.json作成
cat > package.json << 'EOF'
{
  "name": "@love-sports/db",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "db:generate": "drizzle-kit generate:pg",
    "db:push": "drizzle-kit push:pg",
    "db:migrate": "drizzle-kit migrate",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "drizzle-orm": "latest",
    "postgres": "latest"
  },
  "devDependencies": {
    "drizzle-kit": "latest",
    "@types/pg": "latest",
    "typescript": "^5.0.0"
  }
}
EOF

# ディレクトリ構造作成
mkdir -p src drizzle/migrations

pnpm install
```

### 1.5 Supabase プロジェクトセットアップ

```bash
# プロジェクトルートに戻る
cd ../..

# Supabase CLI ログイン
supabase login

# Supabase初期化
supabase init

# プロジェクト作成・連携
supabase projects create love-sports
supabase link --project-ref <project-id>

# ローカル開発環境起動
supabase start
```

## 2. データベース設計・実装

### 2.1 Drizzle スキーマ作成 (packages/db)

`packages/db/src/schema.ts` にテーブル定義を作成：

```typescript
// packages/db/src/schema.ts
import { pgTable, uuid, text, timestamp, integer, jsonb, index, unique } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey(),
  role: text('role').notNull(), // 'participant' | 'admin'
  nickname: text('nickname'),
  gender: text('gender'),
  imageUrl: text('image_url'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  startsAtMs: integer('starts_at_ms').notNull(),
  endsAtMs: integer('ends_at_ms').notNull(),
  status: text('status').notNull(), // 'preparing' | 'active' | 'interval' | 'ended' | 'published'
  createdAt: timestamp('created_at').defaultNow(),
});

export const devices = pgTable('devices', {
  id: text('id').primaryKey(),
  note: text('note'),
  registeredAt: timestamp('registered_at').defaultNow(),
});

export const deviceAssignments = pgTable('device_assignments', {
  eventId: uuid('event_id').references(() => events.id),
  participantId: uuid('participant_id').references(() => profiles.id),
  deviceId: text('device_id').references(() => devices.id),
  assignedAt: timestamp('assigned_at').defaultNow(),
}, (table) => ({
  uniqueEventParticipant: unique().on(table.eventId, table.participantId),
  uniqueEventDevice: unique().on(table.eventId, table.deviceId),
}));

export const telemetry = pgTable('telemetry', {
  eventId: uuid('event_id').references(() => events.id),
  deviceId: text('device_id').references(() => devices.id),
  timestampMs: integer('timestamp_ms').notNull(),
  heartRateBpm: integer('heart_rate_bpm'),
  batteryPct: integer('battery_pct'),
}, (table) => ({
  eventDeviceTimestamp: index('telemetry_event_device_timestamp_idx')
    .on(table.eventId, table.deviceId, table.timestampMs),
}));

export const telemetryPeers = pgTable('telemetry_peers', {
  eventId: uuid('event_id').references(() => events.id),
  deviceId: text('device_id').references(() => devices.id),
  peerDeviceId: text('peer_device_id').references(() => devices.id),
  timestampMs: integer('timestamp_ms').notNull(),
  distanceM: integer('distance_m').notNull(),
}, (table) => ({
  eventDeviceTimestamp: index('telemetry_peers_event_device_timestamp_idx')
    .on(table.eventId, table.deviceId, table.timestampMs),
  eventPeerTimestamp: index('telemetry_peers_event_peer_timestamp_idx')
    .on(table.eventId, table.peerDeviceId, table.timestampMs),
}));

export const resultsInterval = pgTable('results_interval', {
  eventId: uuid('event_id').references(() => events.id).primaryKey(),
  generatedAtMs: integer('generated_at_ms').notNull(),
  perParticipantJson: jsonb('per_participant_json').notNull(),
});

export const resultsFinal = pgTable('results_final', {
  eventId: uuid('event_id').references(() => events.id).primaryKey(),
  generatedAtMs: integer('generated_at_ms').notNull(),
  perParticipantJson: jsonb('per_participant_json').notNull(),
});
```

### 2.2 データベース設定ファイル

```bash
# packages/db/drizzle.config.ts
cat > drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default {
  schema: './src/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
EOF
```

### 2.3 エクスポート用ファイル作成

```bash
# packages/db/src/index.ts
cat > src/index.ts << 'EOF'
export * from './schema';
export { drizzle } from 'drizzle-orm/postgres-js';
export { migrate } from 'drizzle-orm/postgres-js/migrator';
EOF
```

### 2.4 マイグレーション実行

```bash
cd packages/db

# 環境変数設定（Supabaseローカル環境）
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres" > .env

# スキーマ生成
pnpm db:generate

# マイグレーション実行
pnpm db:push
```

### 2.5 RLS設定

Supabase Dashboard でRow Level Security設定：

- プロフィール：本人のみアクセス可 (`auth.uid() = id`)
- イベント・結果：参加者は自分のデータのみ、管理者は全体可

## 3. 認証システム構築

### 3.1 Supabase Auth設定

- Email/Password認証を有効化
- メール確認は後回し（MVP）

### 3.2 認証コンポーネント作成

```bash
cd apps/web

# 認証関連ファイル作成
mkdir -p src/components/auth src/lib/auth

# Supabaseクライアント設定
cat > src/lib/auth/supabase.ts << 'EOF'
import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}
EOF
```

### 3.3 ミドルウェア設定

`apps/web/src/middleware.ts` で認証チェック・ルート保護

## 4. フロントエンド開発

### 4.1 レイアウト・共通コンポーネント

- `apps/web/src/app/layout.tsx`
- `apps/web/src/components/ui/` (shadcn/ui)
- `apps/web/src/components/layout/Header.tsx`
- `apps/web/src/components/layout/Navigation.tsx`

### 4.2 参加者向け画面

- `apps/web/src/app/login/page.tsx` - ログイン
- `apps/web/src/app/profile/page.tsx` - プロフィール編集
- `apps/web/src/app/results/page.tsx` - マッチング結果

### 4.3 管理者向け画面

- `apps/web/src/app/admin/login/page.tsx` - 管理者ログイン
- `apps/web/src/app/admin/events/page.tsx` - イベント一覧・作成
- `apps/web/src/app/admin/events/[id]/page.tsx` - イベント詳細・管理
- `apps/web/src/app/admin/participants/page.tsx` - 参加者管理

## 5. API実装（Supabase Edge Functions）

### 5.1 Edge Functions セットアップ

```bash
# プロジェクトルートから
cd apps/functions

# Functions ディレクトリ作成
mkdir -p api/v1/{telemetry,admin,results}

# 各API作成
supabase functions new telemetry
supabase functions new admin
supabase functions new results
```

### 5.2 API実装

- `apps/functions/api/v1/telemetry/index.ts` - デバイスデータ受信
- `apps/functions/api/v1/admin/index.ts` - 管理者API
- `apps/functions/api/v1/results/index.ts` - 結果取得API

### 5.3 デプロイ

```bash
supabase functions deploy
```

## 6. マッチングロジック実装

### 6.1 計算アルゴリズム作成

`packages/db/src/matching/calculator.ts`:

- 心拍数と距離データの相関分析
- 3つのマッチング指標算出
- インターバル・最終結果生成

### 6.2 バッチジョブ実装

Scheduled Functions で定期実行またはイベントトリガー

## 7. 環境変数・設定

### 7.1 環境変数ファイル

```bash
# apps/web/.env.example
cat > apps/web/.env.example << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF

# packages/db/.env.example
cat > packages/db/.env.example << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
EOF
```

## 8. テスト・品質管理

### 8.1 テスト環境セットアップ

```bash
# ルートでテストツール追加
pnpm add -D -w jest @testing-library/react @testing-library/jest-dom
pnpm add -D -w cypress # E2Eテスト
```

### 8.2 Lint・Type Check

```bash
# 各パッケージでlint/type-checkを実行
pnpm --recursive run lint
pnpm --recursive run type-check
```

## 9. デプロイメント

### 9.1 Vercel デプロイ (apps/web)

```bash
# Vercelプロジェクト作成・設定
npx vercel --prod

# 環境変数設定
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### 9.2 CI/CD設定

`.github/workflows/deploy.yml` で自動デプロイ

## 10. 開発フェーズ

### フェーズ1: 基盤構築（1-2週間）

1. Monorepo・プロジェクトセットアップ
2. データベース設計・実装
3. 基本認証システム

### フェーズ2: 管理機能（1週間）

1. 管理者画面
2. イベント作成・管理
3. 参加者登録・デバイス割当

### フェーズ3: データ収集（1週間）

1. テレメトリAPI実装
2. データ蓄積・表示
3. リアルタイム監視

### フェーズ4: マッチング機能（1-2週間）

1. 計算ロジック実装
2. 結果画面作成
3. インターバル機能

### フェーズ5: テスト・調整（1週間）

1. 統合テスト
2. パフォーマンス調整
3. UI/UX改善

## 11. 開発時の注意点

- MVPなのでシンプルに実装、過度な最適化は避ける
- セキュリティは最小限（HTTPS + 基本認証）
- 生データ保持を重視、後から分析できるよう設計
- デバイス連携部分は最後に実装、モックデータで先行開発
- 10名規模を想定、パフォーマンス要件は緩め

## 12. 今後の拡張予定

- HMAC署名認証
- TimescaleDB対応
- リアルタイムデータ可視化
- モバイルアプリ対応