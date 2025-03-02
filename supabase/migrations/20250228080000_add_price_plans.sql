-- price_plansテーブルの作成
CREATE TABLE IF NOT EXISTS price_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, -- 'small', 'medium', 'large'などのプラン名
  min_party_size INTEGER NOT NULL, -- 適用最小人数
  max_party_size INTEGER NOT NULL, -- 適用最大人数
  amount INTEGER NOT NULL, -- 料金（円）
  description_ja TEXT, -- 日本語説明
  description_ko TEXT, -- 韓国語説明
  description_en TEXT, -- 英語説明
  is_active BOOLEAN NOT NULL DEFAULT true, -- アクティブかどうか
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS設定（Row Level Security）
ALTER TABLE price_plans ENABLE ROW LEVEL SECURITY;

-- 認証済みユーザーに編集権限を与える（シンプルなポリシー）
CREATE POLICY "Authenticated users can manage price plans" 
ON price_plans 
FOR ALL 
TO authenticated
USING (true);

-- 認証済みユーザーは閲覧のみ可能
CREATE POLICY "Authenticated users can view price plans" 
ON price_plans 
FOR SELECT 
TO authenticated
USING (true);

-- 匿名ユーザーも閲覧可能
CREATE POLICY "Anonymous users can view price plans" 
ON price_plans 
FOR SELECT 
TO anon
USING (true);

-- 初期データの挿入
INSERT INTO price_plans (name, min_party_size, max_party_size, amount, description_ja, description_ko, description_en, is_active)
VALUES
  ('small', 1, 4, 1000, '基本予約サービス - 少人数向け最適プラン', '기본 예약 서비스 - 소규모 그룹에 최적화된 플랜', 'Basic reservation service - Optimized for small groups', true),
  ('medium', 5, 8, 2000, 'グループ予約サービス - 優先予約枠の確保', '그룹 예약 서비스 - 우선 예약 보장', 'Group reservation service - Priority booking guaranteed', true),
  ('large', 9, 12, 3000, '大人数専用サービス - VIPサポート付き', '대규모 그룹 전용 서비스 - VIP 지원 포함', 'Large group exclusive service - Includes VIP support', true);

-- 確認用のビュー
CREATE OR REPLACE VIEW price_plans_view AS
SELECT * FROM price_plans WHERE is_active = true ORDER BY min_party_size; 