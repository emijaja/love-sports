-- サンプルデバイス割り当てデータを作成するためのSQLスクリプト
-- 8人の参加者にそれぞれ端末を割り当て

INSERT INTO
    public.device_assignments (
        event_id,
        participant_id,
        device_id,
        assigned_at
    )
VALUES
    -- ドッチボール大会（preparing）- 8人の参加者に端末割り当て
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        '5bfbb02f-9757-4cd3-aa1b-55d466d01737',  -- 田中太郎
        'DEVICE001',                             -- 赤色タグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        '41c64b77-3dd7-4e20-8803-4dabfd3f4386',  -- 佐藤花子
        'DEVICE002',                             -- 青色タグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        '95142252-1fcb-481c-bd8c-de2af051eca6',  -- 鈴木次郎
        'DEVICE003',                             -- 緑色タグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        'f11a6aae-7a38-4511-8c21-395e348cf521',  -- 高橋美咲
        'DEVICE004',                             -- 黄色タグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        'f7a3207c-6b34-4bd3-909b-321ee119c5bd',  -- 伊藤健一
        'DEVICE005',                             -- オレンジタグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        'c789dfdb-f72c-4989-9cc3-8fdc374c0976',  -- 山田恵子
        'DEVICE006',                             -- 紫色タグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        'f973591a-5c75-4d5d-9a18-14643d7772e3',  -- 渡辺拓也
        'DEVICE007',                             -- ピンクタグ
        now()
    ),
    (
        '10000000-0000-0000-0000-000000000001',  -- ドッチボール大会
        '25e8477e-c755-4039-aa40-d6878b76390e',  -- 小林由美
        'DEVICE008',                             -- 黒色タグ
        now()
    );

-- 確認用クエリ
-- SELECT 
--     e.name as event_name,
--     p.nickname as participant_name,
--     da.device_id,
--     d.note as device_note,
--     da.assigned_at
-- FROM public.device_assignments da
-- JOIN public.events e ON da.event_id = e.id
-- JOIN public.profiles p ON da.participant_id = p.id
-- JOIN public.devices d ON da.device_id = d.id
-- ORDER BY da.assigned_at;