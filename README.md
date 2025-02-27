# IRU-TOMO Restaurant Reservation Service

日本の人気レストラン予約サービス。特に韓国人MZ世代（デジタルネイティブな若年層）をターゲットにしています。

## プロジェクト構造

メインのプロジェクトコードは `project/` ディレクトリに配置されています。

## 主な機能

- レストラン検索と予約
- PayPalによる予約手数料支払い (1,000円)
- 予約確認メール（Google Maps地図付き）
- スタッフ用ダッシュボード
- 予約ステータス管理

## 技術スタック

- フロントエンド: React, TypeScript, Vite
- スタイリング: Tailwind CSS
- バックエンド: Supabase
- 認証: Supabase Auth
- 支払い: PayPal
- その他: Gmail SMTP, Google Maps API

## 開発環境のセットアップ

1. 依存関係のインストール
```bash
cd project
npm install
```

2. 環境変数の設定
- `.env.example`を`.env`にコピーして必要な値を設定

3. 開発サーバーの起動
```bash
npm run dev
```

## 多言語対応

- 日本語
- 韓国語
