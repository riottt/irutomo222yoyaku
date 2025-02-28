# 開発環境セットアップガイド

## 必要なソフトウェア

### 基本ツール
- **Node.js**: v16.x以上（推奨: v18.x）
- **npm**: v8.x以上（Node.jsに同梱）
- **Git**: 最新版
- **Visual Studio Code**: 最新版（推奨エディタ）

### 推奨ブラウザ
- **Google Chrome**: 最新版（開発者ツール使用）
- **Firefox**: 最新版（クロスブラウザテスト用）

## 環境構築手順

### 1. Node.jsのインストール
Node.jsは公式サイトからダウンロードしてインストールします。

**Windows**:
1. [Node.js公式サイト](https://nodejs.org/)から推奨版（LTS）をダウンロード
2. ダウンロードしたインストーラーを実行し、指示に従ってインストール
3. インストール完了後、コマンドプロンプトで以下のコマンドを実行して確認:
   ```
   node --version
   npm --version
   ```

**macOS**:
1. [Node.js公式サイト](https://nodejs.org/)から推奨版（LTS）をダウンロード
2. ダウンロードしたパッケージをインストール
3. または、Homebrewを使用してインストール:
   ```
   brew install node@18
   ```
4. インストール完了後、ターミナルで以下のコマンドを実行して確認:
   ```
   node --version
   npm --version
   ```

### 2. Gitのインストール

**Windows**:
1. [Git for Windows](https://gitforwindows.org/)からインストーラーをダウンロード
2. インストーラーを実行し、指示に従ってインストール
   - デフォルト設定でよいが、「Adjusting your PATH environment」では「Git from the command line and also from 3rd-party software」を選択
   - 「Configuring the line ending conversions」では「Checkout as-is, commit as-is」を選択
3. インストール完了後、コマンドプロンプトで以下のコマンドを実行して確認:
   ```
   git --version
   ```

**macOS**:
1. Xcodeをインストールしている場合は、既にGitが含まれています
2. または、Homebrewを使用してインストール:
   ```
   brew install git
   ```
3. インストール完了後、ターミナルで以下のコマンドを実行して確認:
   ```
   git --version
   ```

### 3. Visual Studio Codeのインストール

1. [Visual Studio Code公式サイト](https://code.visualstudio.com/)からインストーラーをダウンロード
2. インストーラーを実行し、指示に従ってインストール
3. 推奨拡張機能をインストール:
   - ESLint
   - Prettier - Code formatter
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - React Developer Tools
   - GitLens

### 4. プロジェクトのクローン

1. コマンドプロンプト（Windows）またはターミナル（macOS）を開く
2. プロジェクトを配置したいディレクトリに移動
3. 以下のコマンドを実行してリポジトリをクローン:
   ```
   git clone https://github.com/your-organization/irutomo222yoyaku.git
   cd irutomo222yoyaku
   ```

### 5. 依存関係のインストール

プロジェクトディレクトリ内で以下のコマンドを実行:
```
npm install
```

### 6. 環境変数の設定

1. プロジェクトルートディレクトリに`.env.local`ファイルを作成
2. 必要な環境変数を設定（チームメンバーから取得）:
   ```
   REACT_APP_API_URL=https://api.example.com
   REACT_APP_SUPABASE_URL=your-supabase-url
   REACT_APP_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

### 7. 開発サーバーの起動

プロジェクトディレクトリ内で以下のコマンドを実行:
```
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認します。

## Git設定

### 1. Gitユーザー設定

以下のコマンドを実行して、Gitのユーザー名とメールアドレスを設定:
```
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Git認証設定

**SSH鍵の生成と設定**:
1. 以下のコマンドを実行してSSH鍵を生成:
   ```
   ssh-keygen -t ed25519 -C "your.email@example.com"
   ```
2. 生成された公開鍵をGitHubアカウントに追加:
   - `~/.ssh/id_ed25519.pub`ファイルの内容をコピー
   - GitHubの設定ページで「SSH and GPG keys」を選択
   - 「New SSH key」をクリックし、コピーした公開鍵を貼り付け

**または、Personal Access Tokenの設定**:
1. GitHubの設定ページで「Developer settings」→「Personal access tokens」を選択
2. 「Generate new token」をクリックし、必要な権限を選択
3. 生成されたトークンをコピーし、安全な場所に保存
4. Gitコマンドでリモートリポジトリにアクセスする際に、パスワードの代わりにこのトークンを使用

### 3. Gitフック設定

プロジェクトには、コミット前に自動的にlintとフォーマットを実行するGitフックが設定されています。これらのフックは`npm install`時に自動的にインストールされます。

## エディタ設定

### Visual Studio Code設定

1. プロジェクトルートディレクトリに`.vscode`フォルダが存在することを確認
2. `.vscode/settings.json`ファイルに以下の設定を追加（または既存の設定を確認）:
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode",
     "editor.codeActionsOnSave": {
       "source.fixAll.eslint": true
     },
     "eslint.validate": [
       "javascript",
       "javascriptreact",
       "typescript",
       "typescriptreact"
     ],
     "typescript.tsdk": "node_modules/typescript/lib",
     "tailwindCSS.includeLanguages": {
       "typescript": "javascript",
       "typescriptreact": "javascript"
     }
   }
   ```

## デバッグ設定

### ブラウザデバッグ

1. Chrome DevToolsを開く（F12またはCtrl+Shift+I）
2. 「Sources」タブでブレークポイントを設定
3. React Developer Toolsを使用してコンポーネントの状態を確認

### VS Codeデバッグ

1. `.vscode/launch.json`ファイルに以下の設定を追加:
   ```json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "type": "chrome",
         "request": "launch",
         "name": "Launch Chrome against localhost",
         "url": "http://localhost:3000",
         "webRoot": "${workspaceFolder}"
       }
     ]
   }
   ```
2. VS Codeのデバッグパネルを開き、「Launch Chrome against localhost」を選択
3. コードにブレークポイントを設定し、デバッグを開始

## よくある問題と解決策

### 依存関係の問題
**問題**: `npm install`が失敗する。

**解決策**:
1. `node_modules`フォルダと`package-lock.json`ファイルを削除
2. npm cacheをクリア: `npm cache clean --force`
3. 再度インストール: `npm install`

### ポートの競合
**問題**: 開発サーバーの起動時に「ポートXXXXは既に使用されています」というエラーが表示される。

**解決策**:
1. 既存のNode.jsプロセスを終了:
   - Windows: `taskkill /F /IM node.exe`
   - macOS/Linux: `killall node`
2. または、別のポートを指定して起動:
   - `PORT=3001 npm run dev`（macOS/Linux）
   - `set PORT=3001 && npm run dev`（Windows）

### Git関連の問題
**問題**: リモートリポジトリへのプッシュが拒否される。

**解決策**:
1. 最新の変更を取得: `git pull --rebase origin <ブランチ名>`
2. 競合がある場合は解決
3. 再度プッシュ: `git push origin <ブランチ名>`

## 参考リソース

- [React公式ドキュメント](https://reactjs.org/docs/getting-started.html)
- [TypeScript公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Supabase公式ドキュメント](https://supabase.io/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [React Router公式ドキュメント](https://reactrouter.com/docs/en/v6)

## サポート

開発環境のセットアップに問題がある場合は、チームのSlackチャンネル「#dev-support」で質問してください。 