# Supabaseマイグレーションガイド

このドキュメントでは、PayPal新機能用のデータベース設計をSupabaseに適用する方法について説明します。

## 開発環境と本番環境の違い

開発環境（ローカル）と本番環境（Supabaseクラウド）では、以下の違いがあります：

1. **認証機能**：
   - 本番環境：`auth.uid()`関数が利用可能で、認証されたユーザーのIDを取得できます。
   - 開発環境：`auth`拡張機能がデフォルトでは利用できないため、簡易的なRLSポリシーを使用します。

2. **マイグレーションファイル**：
   - 開発環境用：`supabase/migrations/20250301000000_paypal_db_design.sql`
   - 本番環境用：`supabase/migrations/20250301000000_paypal_db_design_production.sql`

## マイグレーションの適用方法

### 開発環境（ローカルSupabase）

1. Dockerが起動していることを確認します：
   ```bash
   docker ps | grep supabase
   ```

2. 以下のコマンドを実行してマイグレーションを適用します：
   ```bash
   npm run apply-sql
   ```

3. または、以下のコマンドでも適用できます：
   ```bash
   docker exec supabase-postgres-1 psql -U postgres -f /tmp/migration.sql
   ```

### 本番環境（Supabaseダッシュボード）

1. [Supabaseダッシュボード](https://app.supabase.com)にログインします。

2. 対象のプロジェクトを選択します。

3. 左側のメニューから「SQL Editor」を選択します。

4. 「New Query」ボタンをクリックします。

5. `supabase/migrations/20250301000000_paypal_db_design_production.sql`ファイルの内容をコピーして、エディタに貼り付けます。

6. 「Run」ボタンをクリックして、SQLを実行します。

## 注意事項

1. マイグレーションを適用する前に、データベースのバックアップを取ることをお勧めします。

2. 本番環境に適用する前に、ステージング環境でテストすることをお勧めします。

3. エラーが発生した場合は、エラーメッセージを確認し、必要に応じてSQLを修正してください。

4. RLSポリシーは環境によって異なります。本番環境では`auth.uid()`を使用したポリシーが適用されます。

## 型定義の生成

マイグレーション適用後、TypeScript型定義を生成するには以下のコマンドを実行します：

```bash
npm run generate-types
```

これにより、`src/types/supabase.ts`ファイルが更新され、新しいテーブルや列の型情報が追加されます。

## マイグレーションファイル

マイグレーションファイルは `supabase/migrations` ディレクトリに保存されています。以下のファイルが含まれています：

- `20250301000000_paypal_db_design.sql` - PayPal新機能用のDB設計を反映するマイグレーションファイル
- `20250228080000_add_price_plans.sql` - 価格プランを追加するマイグレーションファイル
- `20250222082224_noisy_boat.sql` - 基本的なデータベース構造を設定するマイグレーションファイル

## Supabaseダッシュボードを使用してSQLを実行する方法

### 1. Supabaseダッシュボードにログイン

1. [Supabaseダッシュボード](https://app.supabase.com)にアクセスします。
2. アカウントでログインします。
3. 対象のプロジェクトを選択します。

### 2. SQLエディタを開く

1. 左側のメニューから「SQL Editor」をクリックします。
2. 「New Query」をクリックして新しいSQLクエリを作成します。

### 3. マイグレーションSQLを実行

1. `supabase/migrations` ディレクトリから適用したいSQLファイルを開きます。
2. SQLの内容をコピーします。
3. Supabaseダッシュボードの「SQL Editor」に貼り付けます。
4. 「Run」ボタンをクリックしてSQLを実行します。

### 4. 実行順序

マイグレーションファイルは以下の順序で実行することをお勧めします：

1. `20250222082224_noisy_boat.sql` - 基本的なデータベース構造
2. `20250228080000_add_price_plans.sql` - 価格プラン
3. `20250301000000_paypal_db_design.sql` - PayPal新機能用のDB設計

## トラブルシューティング

### エラー：テーブルが既に存在する

マイグレーションファイルには `IF NOT EXISTS` や `IF EXISTS` の条件が含まれているため、既存のテーブルや列がある場合でも安全に実行できます。

### エラー：外部キー制約違反

外部キー制約違反が発生した場合は、参照先のテーブルが存在することを確認してください。マイグレーションの実行順序が重要です。

## 開発環境でのテスト

開発環境でテストする場合は、以下の手順を実行してください：

1. Supabaseのローカルインスタンスを起動します（Docker必要）：
   ```
   npm run start-supabase
   ```

2. マイグレーションを適用します：
   ```
   npm run apply-sql
   ```

3. 完了したら、Supabaseのローカルインスタンスを停止します：
   ```
   npm run stop-supabase
   ```