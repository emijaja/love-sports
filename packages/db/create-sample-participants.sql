-- サンプル参加者データを作成するためのSQLスクリプト
-- 各イベントに8人ずつの参加者を作成（合計40人）

-- 参加者プロフィールの作成
INSERT INTO
    public.profiles (
        id,
        nickname,
        gender,
        image_url,
        bio,
        created_at,
        updated_at
    )
VALUES
    -- 春の運動会 2025 の参加者（8人）
    (
        '5bfbb02f-9757-4cd3-aa1b-55d466d01737',
        '田中太郎',
        'male',
        NULL,
        '陸上競技が得意です',
        now(),
        now()
    ),
    (
        '41c64b77-3dd7-4e20-8803-4dabfd3f4386',
        '佐藤花子',
        'female',
        NULL,
        'マラソンランナー',
        now(),
        now()
    ),
    (
        '95142252-1fcb-481c-bd8c-de2af051eca6',
        '鈴木次郎',
        'male',
        NULL,
        '短距離スプリンター',
        now(),
        now()
    ),
    (
        'f11a6aae-7a38-4511-8c21-395e348cf521',
        '高橋美咲',
        'female',
        NULL,
        '跳躍競技専門',
        now(),
        now()
    ),
    (
        'f7a3207c-6b34-4bd3-909b-321ee119c5bd',
        '伊藤健一',
        'male',
        NULL,
        '投擲競技が好き',
        now(),
        now()
    ),
    (
        'c789dfdb-f72c-4989-9cc3-8fdc374c0976',
        '山田恵子',
        'female',
        NULL,
        'リレー選手',
        now(),
        now()
    ),
    (
        'f973591a-5c75-4d5d-9a18-14643d7772e3',
        '渡辺拓也',
        'male',
        NULL,
        '中距離ランナー',
        now(),
        now()
    ),
    (
        '25e8477e-c755-4039-aa40-d6878b76390e',
        '小林由美',
        'female',
        NULL,
        'オールラウンダー',
        now(),
        now()
    );

-- 確認用クエリ
-- SELECT id, nickname, gender, bio
-- FROM public.profiles
-- ORDER BY created_at;