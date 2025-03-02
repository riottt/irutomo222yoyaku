-- 既存の料金プランデータを更新
UPDATE price_plans 
SET description_ja = '基本予約サービス - 1〜4人向け最適プラン', 
    description_ko = '기본 예약 서비스 - 1~4명을 위한 최적화된 플랜', 
    description_en = 'Basic reservation service - Optimized for 1-4 people'
WHERE name = 'small';

UPDATE price_plans 
SET description_ja = 'グループ予約サービス - 5〜8人向け優先予約枠の確保', 
    description_ko = '그룹 예약 서비스 - 5~8명을 위한 우선 예약 보장', 
    description_en = 'Group reservation service - Priority booking for 5-8 people'
WHERE name = 'medium';

UPDATE price_plans 
SET description_ja = '大人数専用サービス - 9〜12人向けVIPサポート付き', 
    description_ko = '대규모 그룹 전용 서비스 - 9~12명을 위한 VIP 지원', 
    description_en = 'Large group exclusive service - VIP support for 9-12 people'
WHERE name = 'large';

-- 変換レートの修正に関する備考
-- クライアント側で円からドルへの変換: 1ドル = 150円
-- クライアント側で円からウォンへの変換: 1円 = 9.7ウォン

-- 料金プランビューの更新
DROP VIEW IF EXISTS price_plans_view;
CREATE OR REPLACE VIEW price_plans_view AS
SELECT id, name, min_party_size, max_party_size, amount, 
       description_ja, description_ko, description_en, is_active,
       created_at, updated_at
FROM price_plans 
WHERE is_active = true 
ORDER BY min_party_size; 