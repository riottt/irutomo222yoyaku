# PayPal新機能用DB設計の実装概要

## 実装内容

1. **マイグレーションファイルの作成**
   - `supabase/migrations/20250301000000_paypal_db_design.sql` - 開発環境用（ローカルSupabase）
   - `supabase/migrations/20250301000000_paypal_db_design_production.sql` - 本番環境用（Supabaseクラウド）
   - PayPal新機能に必要なデータベース設計を反映
   - 既存テーブルへの列追加と新規テーブルの作成
   - RLSポリシーの設定（環境ごとに異なる設定）

2. **マイグレーション適用スクリプトの開発**
   - `scripts/apply-migrations.js` - Supabase CLIを使用
   - `scripts/apply-sql.js` - PostgreSQLに直接SQLファイルを適用
   - `scripts/setup-supabase-local.js` - ローカル開発環境のセットアップ

3. **型定義の生成**
   - `scripts/generate-supabase-types.js` - 型定義生成スクリプト
   - 出力ファイル: `src/types/supabase.ts`

4. **ドキュメント作成**
   - `README-SUPABASE-MIGRATION.md` - Supabaseダッシュボードでのマイグレーション適用方法

## テーブル構造

### 主要テーブル

1. **users**
   - 追加列: `language_preference`, `role`, `timezone`

2. **restaurants**
   - 追加列: `has_japanese_menu`

3. **reservations**
   - 追加列: `payment_amount`, `transaction_id`, `is_reviewed`
   - トリガー: 予約人数に基づく支払い金額の自動計算

4. **payments** (新規)
   - 予約に関連する支払い情報
   - 列: `reservation_id`, `amount`, `status`, `payment_method`, `transaction_id`

5. **reviews** (新規)
   - レストランのレビュー情報
   - 列: `user_id`, `restaurant_id`, `rating`, `comment`, `photo_url`

6. **audit_logs** (新規)
   - システム操作の監査ログ
   - 列: `user_id`, `action`, `timestamp`, `details`

7. **translations** (新規)
   - 多言語対応のための翻訳データ
   - 列: `entity_type`, `entity_id`, `language`, `field_name`, `value`

## 使用方法

### マイグレーションの適用

#### 開発環境（ローカル）
```bash
# ローカル開発環境のセットアップ
npm run setup-supabase-local

# Supabaseの起動
npm run start-supabase

# SQLマイグレーションの適用
npm run apply-sql

# 型定義の生成
npm run generate-types
```

#### 本番環境
Supabaseダッシュボードを使用してマイグレーションを適用します。
詳細は `README-SUPABASE-MIGRATION.md` を参照してください。

## 注意事項

1. マイグレーションを適用する前に、データベースのバックアップを取ることをお勧めします。
2. 本番環境に適用する前に、開発環境またはステージング環境でテストしてください。
3. エラーメッセージを確認し、必要に応じてSQLを修正してください。
4. 開発環境と本番環境ではRLSポリシーの設定が異なります。
   - 開発環境: 簡易的なポリシー（全アクセス許可）
   - 本番環境: `auth.uid()`を使用したポリシー 