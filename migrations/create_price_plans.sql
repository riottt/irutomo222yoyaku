-- price_plansテーブルの作成（料金プラン情報）
CREATE TABLE IF NOT EXISTS price_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    min_party_size INTEGER NOT NULL,
    max_party_size INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'JPY',
    description_ja TEXT,
    description_ko TEXT,
    description_en TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 初期データの挿入
INSERT INTO price_plans (name, min_party_size, max_party_size, amount, currency, description_ja, description_ko, description_en)
VALUES
('small', 1, 4, 1000, 'JPY', '基本予約サービス・少人数向け最適プラン', '기본 예약 서비스・소규모 그룹용 최적 플랜', 'Basic reservation service - Ideal for small groups'),
('medium', 5, 8, 2000, 'JPY', 'グループ予約サービス・優先予約枠の確保', '그룹 예약 서비스・우선 예약 확보', 'Group reservation service - Priority booking'),
('large', 9, 12, 3000, 'JPY', '大人数専用サービス・VIPサポート', '대규모 그룹 전용 서비스・VIP 지원', 'Large group exclusive service - VIP support');

-- サポート関数: 人数に基づいてプランを検索
CREATE OR REPLACE FUNCTION get_price_plan_by_party_size(p_party_size INTEGER)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    min_party_size INTEGER,
    max_party_size INTEGER,
    amount INTEGER,
    currency VARCHAR(3),
    description_ja TEXT,
    description_ko TEXT,
    description_en TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        pp.id,
        pp.name,
        pp.min_party_size,
        pp.max_party_size,
        pp.amount,
        pp.currency,
        pp.description_ja,
        pp.description_ko,
        pp.description_en
    FROM 
        price_plans pp
    WHERE 
        p_party_size BETWEEN pp.min_party_size AND pp.max_party_size
        AND pp.is_active = TRUE
    LIMIT 1;
END;
$$ LANGUAGE plpgsql; 