-- すべてのプロフィールデータを削除するSQLスクリプト
-- 外部キー制約により、関連するデータも含めて削除が必要

-- 1. デバイス割り当てを削除（profilesを参照）
DELETE FROM public.device_assignments;

-- 2. プロフィールを削除
DELETE FROM public.profiles;

-- 確認用クエリ
-- SELECT COUNT(*) as remaining_profiles FROM public.profiles;
-- SELECT COUNT(*) as remaining_assignments FROM public.device_assignments;