-- サンプル端末データを作成するためのSQLスクリプト
-- 8つの端末（デバイス）を作成

INSERT INTO
    public.devices (
        id,
        note,
        registered_at
    )
VALUES
    -- 端末1: プライマリカラーの赤
    (
        'DEVICE001',
        '赤色タグ - メイン端末',
        now()
    ),
    
    -- 端末2: ブルー
    (
        'DEVICE002',
        '青色タグ - サブ端末',
        now()
    ),
    
    -- 端末3: グリーン
    (
        'DEVICE003',
        '緑色タグ - 予備端末',
        now()
    ),
    
    -- 端末4: イエロー
    (
        'DEVICE004',
        '黄色タグ - テスト端末',
        now()
    ),
    
    -- 端末5: オレンジ
    (
        'DEVICE005',
        'オレンジタグ - 競技用端末',
        now()
    ),
    
    -- 端末6: パープル
    (
        'DEVICE006',
        '紫色タグ - 高性能端末',
        now()
    ),
    
    -- 端末7: ピンク
    (
        'DEVICE007',
        'ピンクタグ - 軽量端末',
        now()
    ),
    
    -- 端末8: ブラック
    (
        'DEVICE008',
        '黒色タグ - プロ仕様端末',
        now()
    );

-- 確認用クエリ
-- SELECT id, note, registered_at
-- FROM public.devices
-- ORDER BY id;