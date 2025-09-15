-- サンプルイベントデータを作成するためのSQLスクリプト
-- 各status（preparing, active, interval, ended, published）のイベントを作成

INSERT INTO
    public.events (
        id,
        name,
        starts_at_ms,
        ends_at_ms,
        status,
        created_at
    )
VALUES
    -- preparing: 準備中のイベント（未来の開始時間）
    (
        '10000000-0000-0000-0000-000000000001',
        'ドッチボール大会',
        1748764800000,
        1748768400000,
        'preparing',
        now()
    ),

-- active: 現在開催中のイベント（現在時刻が開始〜終了時間の間）
(
    '10000000-0000-0000-0000-000000000002',
    'サッカー大会',
    1726311600000,
    1726340400000,
    'active',
    now()
),

-- interval: インターバル中のイベント（休憩時間）
(
    '10000000-0000-0000-0000-000000000003',
    '野球大会（休憩中）',
    1726225200000,
    1726282800000,
    'interval',
    now()
),

-- ended: 終了したイベント（結果未公開）
(
    '10000000-0000-0000-0000-000000000004',
    'バレー大会',
    1726138800000,
    1726196400000,
    'ended',
    now()
),

-- published: 結果公開済みのイベント
(
    '10000000-0000-0000-0000-000000000005',
    'バスケ大会',
    1725620400000,
    1725678000000,
    'published',
    now()
);

-- 確認用クエリ
-- SELECT name, status,
--        to_timestamp(starts_at_ms / 1000) as starts_at,
--        to_timestamp(ends_at_ms / 1000) as ends_at,
--        created_at
-- FROM public.events
-- ORDER BY status, created_at;