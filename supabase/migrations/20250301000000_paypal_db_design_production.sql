-- PayPal新機能用のDB設計を反映するマイグレーションファイル（本番環境用）
-- 既存のテーブルがある場合は、必要に応じて変更を加えます

-- users テーブルの更新（既存の場合は必要な列を追加）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'staff', 'user');
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
        -- 既存のテーブルに列を追加
        -- language_preference列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'language_preference') THEN
            ALTER TABLE users ADD COLUMN language_preference TEXT NOT NULL DEFAULT 'ko' CHECK (language_preference IN ('ja', 'en', 'ko'));
        END IF;
        
        -- role列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
            ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user'));
        END IF;
        
        -- timezone列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'timezone') THEN
            ALTER TABLE users ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo';
        END IF;
    ELSE
        -- テーブルが存在しない場合は新規作成
        CREATE TABLE users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            email TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            language_preference TEXT NOT NULL DEFAULT 'ko' CHECK (language_preference IN ('ja', 'en', 'ko')),
            role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'staff', 'user')),
            timezone TEXT NOT NULL DEFAULT 'Asia/Tokyo'
        );
    END IF;
END $$;

-- restaurants テーブルの更新（既存の場合は必要な列を追加）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'restaurants') THEN
        -- 既存のテーブルに列を追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'restaurants' AND column_name = 'has_japanese_menu') THEN
            ALTER TABLE restaurants ADD COLUMN has_japanese_menu BOOLEAN NOT NULL DEFAULT true;
        END IF;
    ELSE
        -- テーブルが存在しない場合は新規作成
        CREATE TABLE restaurants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            name TEXT NOT NULL,
            japanese_name TEXT,
            korean_name TEXT,
            address TEXT NOT NULL,
            korean_address TEXT,
            description TEXT,
            korean_description TEXT,
            cuisine TEXT,
            rating NUMERIC,
            image TEXT,
            price_range TEXT,
            location TEXT NOT NULL,
            phone_number TEXT,
            opening_hours JSONB,
            google_maps_link TEXT,
            has_vegetarian_options BOOLEAN NOT NULL DEFAULT false,
            has_english_menu BOOLEAN NOT NULL DEFAULT false,
            has_korean_menu BOOLEAN NOT NULL DEFAULT false,
            has_japanese_menu BOOLEAN NOT NULL DEFAULT true
        );
    END IF;
END $$;

-- reservations テーブルの更新（既存の場合は必要な列を追加）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reservations') THEN
        -- 既存のテーブルに列を追加
        -- payment_amount列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'payment_amount') THEN
            ALTER TABLE reservations ADD COLUMN payment_amount NUMERIC;
            -- 既存のレコードに対して、人数に基づいて支払い金額を設定
            UPDATE reservations 
            SET payment_amount = 
                CASE 
                    WHEN party_size BETWEEN 1 AND 4 THEN 1000 
                    WHEN party_size BETWEEN 5 AND 8 THEN 2000 
                    WHEN party_size BETWEEN 9 AND 12 THEN 3000 
                    ELSE 0 
                END
            WHERE payment_amount IS NULL;
            -- NOT NULL制約を追加
            ALTER TABLE reservations ALTER COLUMN payment_amount SET NOT NULL;
        END IF;
        
        -- transaction_id列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'transaction_id') THEN
            ALTER TABLE reservations ADD COLUMN transaction_id TEXT;
        END IF;
        
        -- is_reviewed列の追加
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'reservations' AND column_name = 'is_reviewed') THEN
            ALTER TABLE reservations ADD COLUMN is_reviewed BOOLEAN NOT NULL DEFAULT false;
        END IF;
    ELSE
        -- テーブルが存在しない場合は新規作成
        CREATE TABLE reservations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
            reservation_date DATE NOT NULL,
            reservation_time TEXT NOT NULL,
            party_size INTEGER NOT NULL CHECK (party_size BETWEEN 1 AND 12),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            special_requests TEXT,
            status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
            payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
            payment_amount NUMERIC NOT NULL DEFAULT 0,
            transaction_id TEXT,
            cancellation_reason TEXT,
            notes TEXT,
            is_reviewed BOOLEAN NOT NULL DEFAULT false
        );
    END IF;
END $$;

-- 支払い金額の計算ルールを設定するトリガー関数
CREATE OR REPLACE FUNCTION set_payment_amount()
RETURNS TRIGGER AS $func$
BEGIN
    NEW.payment_amount := 
        CASE 
            WHEN NEW.party_size BETWEEN 1 AND 4 THEN 1000 
            WHEN NEW.party_size BETWEEN 5 AND 8 THEN 2000 
            WHEN NEW.party_size BETWEEN 9 AND 12 THEN 3000 
            ELSE 0 
        END;
    RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- トリガーの作成（存在する場合は削除してから作成）
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reservations') THEN
        -- トリガーが存在する場合は削除
        DROP TRIGGER IF EXISTS set_payment_amount_trigger ON reservations;
        
        -- トリガーを作成
        CREATE TRIGGER set_payment_amount_trigger
        BEFORE INSERT ON reservations
        FOR EACH ROW
        EXECUTE FUNCTION set_payment_amount();
    END IF;
END $$;

-- payments テーブルの作成（存在しない場合）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        CREATE TABLE payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
            amount NUMERIC NOT NULL,
            status TEXT NOT NULL CHECK (status IN ('completed', 'failed')),
            payment_method TEXT NOT NULL DEFAULT 'PayPal',
            transaction_id TEXT NOT NULL,
            error_message TEXT
        );
    END IF;
END $$;

-- reviews テーブルの作成（存在しない場合）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        CREATE TABLE reviews (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            created_at TIMESTAMPTZ DEFAULT NOW(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
            rating TEXT NOT NULL,
            comment TEXT,
            photo_url TEXT,
            is_verified BOOLEAN NOT NULL DEFAULT false,
            helpful_count INTEGER NOT NULL DEFAULT 0
        );
    END IF;
END $$;

-- audit_logs テーブルの作成（存在しない場合）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        CREATE TABLE audit_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            action TEXT NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            details JSONB NOT NULL
        );
    END IF;
END $$;

-- translations テーブルの作成（存在しない場合）
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'translations') THEN
        CREATE TABLE translations (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            entity_type TEXT NOT NULL,
            entity_id UUID NOT NULL,
            language TEXT NOT NULL CHECK (language IN ('ja', 'en', 'ko')),
            field_name TEXT NOT NULL,
            value TEXT NOT NULL
        );
    END IF;
END $$;

-- RLS（行レベルセキュリティ）設定
DO $$
BEGIN
    -- reservations テーブルのRLS設定
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reservations') THEN
        ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
        
        -- 既存のポリシーを削除（存在する場合）
        DROP POLICY IF EXISTS "Users can view/edit own reservations" ON reservations;
        DROP POLICY IF EXISTS "Admin can manage all reservations" ON reservations;
        DROP POLICY IF EXISTS "Allow all access to reservations" ON reservations;
        
        -- シンプルなポリシー（認証済みユーザーに全アクセス権を付与）
        CREATE POLICY "Allow authenticated users to access reservations"
          ON reservations
          FOR ALL
          TO authenticated
          USING (true);
    END IF;
    
    -- payments テーブルのRLS設定
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
        
        -- 既存のポリシーを削除（存在する場合）
        DROP POLICY IF EXISTS "Users can view own payments" ON payments;
        DROP POLICY IF EXISTS "Admin can manage all payments" ON payments;
        DROP POLICY IF EXISTS "Allow all access to payments" ON payments;
        
        -- シンプルなポリシー（認証済みユーザーに全アクセス権を付与）
        CREATE POLICY "Allow authenticated users to access payments"
          ON payments
          FOR ALL
          TO authenticated
          USING (true);
    END IF;
    
    -- reviews テーブルのRLS設定
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'reviews') THEN
        ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
        
        -- 既存のポリシーを削除（存在する場合）
        DROP POLICY IF EXISTS "Users can view/edit own reviews" ON reviews;
        DROP POLICY IF EXISTS "Admin can manage all reviews" ON reviews;
        DROP POLICY IF EXISTS "Allow all access to reviews" ON reviews;
        
        -- シンプルなポリシー（認証済みユーザーに全アクセス権を付与）
        CREATE POLICY "Allow authenticated users to access reviews"
          ON reviews
          FOR ALL
          TO authenticated
          USING (true);
    END IF;
    
    -- audit_logs テーブルのRLS設定
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'audit_logs') THEN
        ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
        
        -- 既存のポリシーを削除（存在する場合）
        DROP POLICY IF EXISTS "Admin can view audit logs" ON audit_logs;
        DROP POLICY IF EXISTS "Allow all access to audit logs" ON audit_logs;
        
        -- シンプルなポリシー（認証済みユーザーに全アクセス権を付与）
        CREATE POLICY "Allow authenticated users to access audit logs"
          ON audit_logs
          FOR ALL
          TO authenticated
          USING (true);
    END IF;
    
    -- translations テーブルのRLS設定
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'translations') THEN
        ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
        
        -- 既存のポリシーを削除（存在する場合）
        DROP POLICY IF EXISTS "Admin can manage translations" ON translations;
        DROP POLICY IF EXISTS "Allow all access to translations" ON translations;
        
        -- シンプルなポリシー（認証済みユーザーに全アクセス権を付与）
        CREATE POLICY "Allow authenticated users to access translations"
          ON translations
          FOR ALL
          TO authenticated
          USING (true);
    END IF;
END $$; 