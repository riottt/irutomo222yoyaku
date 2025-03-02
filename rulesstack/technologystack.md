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

## バックエンド & データベース
- Supabase: ^2.39.7（認証・データベース）
- PostgreSQL
- EmailJS: ^4.4.1（メール送信）

## 支払い処理
- PayPal: @paypal/react-paypal-js ^8.1.4

## 開発ツール
- ESLint: ^9.9.1
- PostCSS: ^8.4.35
- Autoprefixer: ^10.4.18

## 環境設定
- 開発環境: `.env`ファイルで設定
- 本番環境: `.env.production`ファイルで設定
- Supabase接続: ローカル開発用と本番用の設定を分離管理

## 重要な制約事項
- Supabase接続情報は `src/lib/supabase.ts` で一元管理されています
- 本番環境へのデータベースマイグレーションには専用スクリプトを使用してください
- `npm run apply-production-sql` コマンドで本番環境のマイグレーションを適用します
- 支払い機能はPayPalのみをサポートしています
- UI/UXの変更時はアクセシビリティへの配慮が必須です（aria-label, titleなど）