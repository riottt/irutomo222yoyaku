# IRU TOMO プロジェクト開発ドキュメント

IRU TOMO（イルトモ）は、韓国人MZ世代向けの日本のレストラン予約サービスです。このリポジトリには、開発チーム向けのガイドラインとドキュメントが含まれています。

## 目次

### 開発ガイド
- [開発環境セットアップガイド](./development-setup-guide.md) - 開発環境の構築手順
- [GitHubルール](./github-rules.md) - GitHubの使用ルールとワークフロー
- [Gitコマンドチートシート](./git-commands.md) - よく使うGitコマンドの一覧

### 実装ガイド
- [UI実装ガイドライン](./ui-implementation-guide.md) - UIコンポーネントの実装ルール
- [TypeScript & Reactベストプラクティス](./typescript-react-best-practices.md) - TypeScriptとReactの推奨実装パターン

### トラブルシューティング
- [トラブルシューティングガイド](./troubleshooting-guide.md) - 開発中によく遭遇する問題と解決策

## プロジェクト概要

IRU TOMOは、韓国人MZ世代向けの日本のレストラン予約サービスです。主な機能は以下の通りです：

- レストラン検索・閲覧
- 予約管理
- 多言語対応（韓国語/日本語/英語）
- 管理者ダッシュボード

## 技術スタック

- **フロントエンド**: React, TypeScript, Tailwind CSS
- **バックエンド**: Supabase
- **状態管理**: React Context API
- **ルーティング**: React Router
- **スタイリング**: CSS Modules, Tailwind CSS
- **API通信**: Fetch API
- **認証**: Supabase Auth
- **データベース**: PostgreSQL (Supabase)

## 開発フロー

1. 機能要件の確認（Issue）
2. 機能ブランチの作成（`feature/機能名`）
3. 実装
4. テスト
5. プルリクエスト作成
6. コードレビュー
7. `develop`ブランチへのマージ
8. ステージング環境でのテスト
9. `main`ブランチへのマージ
10. 本番環境へのデプロイ

## 貢献ガイド

1. リポジトリをクローン
2. 最新の`develop`ブランチから機能ブランチを作成
3. 変更を実装
4. テストを実行
5. 変更をコミット（コミットメッセージ規約に従う）
6. プルリクエストを作成

## 連絡先

質問や問題がある場合は、チームのSlackチャンネル「#irutomo-dev」で連絡してください。 