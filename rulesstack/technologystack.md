# 技術スタック

## コア技術
- TypeScript: ^5.5.3
- Node.js: ^18.0.0
- Vite: ^5.4.14

## フロントエンド
- React: ^18.3.1
- React Router: ^7.2.0
- Tailwind CSS: ^3.4.1
- Framer Motion: ^11.18.2
- Lucide React: ^0.344.0（アイコン）
- class-variance-authority: ^0.7.0（スタイル制御）
- tailwind-merge: ^2.6.0
- clsx: ^2.1.1（クラス結合ユーティリティ）
- QRコード生成: qrcode.react ^4.2.0

## バックエンド & データベース
- Supabase: ^2.39.7（認証・データベース）
- PostgreSQL: pg ^8.13.3
- Supabase CLI: supabase ^2.15.8
- EmailJS: ^4.4.1（メール送信）
- UUID: ^9.0.1（一意識別子生成）

## モデルコンテキストプロトコル
- @modelcontextprotocol/server-postgres: ^0.6.2
- @number-flow/react: ^0.5.5

## 支払い処理
- PayPal: @paypal/react-paypal-js ^8.1.4

## 開発ツール
- ESLint: ^9.9.1
- PostCSS: ^8.4.35
- Autoprefixer: ^10.4.18
- dotenv: ^16.4.5（環境変数管理）
- tsx: ^4.7.1（TypeScript実行）

## 環境設定
- 開発環境: `.env`ファイルで設定
- 本番環境: `.env.production`ファイルで設定
- Supabase接続: ローカル開発用と本番用の設定を分離管理
- Dockerによるローカル開発環境: docker-compose.yml

## スクリプト
- `npm run dev`: 開発サーバー起動
- `npm run build`: プロダクションビルド
- `npm run preview`: ビルド結果プレビュー
- `npm run lint`: コード検証
- `npm run populate-db`: レストランデータ投入
- `npm run apply-migrations`: マイグレーション適用
- `npm run setup-supabase`: ローカルSupabase設定
- `npm run apply-sql`: SQL適用
- `npm run apply-specific-sql`: 特定のマイグレーション適用
- `npm run apply-production-sql`: 本番環境にマイグレーション適用
- `npm run generate-types`: Supabase型定義生成
- `npm run start-supabase`: Supabaseコンテナ起動
- `npm run stop-supabase`: Supabaseコンテナ停止
- `npm run start-mcp`: MCPサーバー起動
- `npm run start-production-mcp`: 本番MCPサーバー起動

## 重要な制約事項
- Supabase接続情報は `src/lib/supabase.ts` で一元管理されています
- 本番環境へのデータベースマイグレーションには専用スクリプトを使用してください
- `npm run apply-production-sql` コマンドで本番環境のマイグレーションを適用します
- 支払い機能はPayPalのみをサポートしています（Stripe統合は準備中）
- UI/UXの変更時はアクセシビリティへの配慮が必須です（aria-label, titleなど）
- 共通UIコンポーネントは `src/components/ui/` に配置してください
- 新しいカスタムフックは `src/components/hooks/` に配置してください
- データベース型定義は `src/types/supabase.ts` に一元管理されています