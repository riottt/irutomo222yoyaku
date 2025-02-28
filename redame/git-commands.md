# Git コマンドチートシート

## 基本コマンド

### リポジトリの初期化と設定
```bash
# 新しいリポジトリを初期化
git init

# リモートリポジトリをクローン
git clone <リポジトリURL>

# リモートリポジトリを追加
git remote add origin <リポジトリURL>

# リモートリポジトリの確認
git remote -v
```

### 変更の確認と追加
```bash
# 変更状態の確認
git status

# 変更内容の詳細確認
git diff

# 特定のファイルの変更内容確認
git diff <ファイル名>

# 変更をステージングに追加
git add <ファイル名>

# すべての変更をステージングに追加
git add .

# 変更をコミット
git commit -m "コミットメッセージ"

# 変更を追加してコミットを同時に行う（新規ファイル以外）
git commit -am "コミットメッセージ"
```

### ブランチ操作
```bash
# ブランチ一覧表示
git branch

# リモートも含めたブランチ一覧表示
git branch -a

# 新しいブランチを作成
git branch <ブランチ名>

# 新しいブランチを作成して切り替え
git checkout -b <ブランチ名>

# 既存のブランチに切り替え
git checkout <ブランチ名>

# ブランチの削除
git branch -d <ブランチ名>

# 強制的にブランチを削除
git branch -D <ブランチ名>
```

### 変更の統合
```bash
# 別のブランチの変更を現在のブランチにマージ
git merge <ブランチ名>

# マージ中に競合が発生した場合、マージを中止
git merge --abort

# リベース（履歴を直線的に保つ）
git rebase <ブランチ名>

# インタラクティブリベース（コミットの編集、並べ替え、統合など）
git rebase -i HEAD~<コミット数>
```

### リモート操作
```bash
# リモートの変更を取得（マージはしない）
git fetch

# リモートの変更を取得してマージ
git pull

# リモートの変更を取得してリベース
git pull --rebase

# ローカルの変更をリモートにプッシュ
git push origin <ブランチ名>

# 強制的にプッシュ（注意して使用）
git push -f origin <ブランチ名>
```

## 便利なコマンド

### コミット履歴の確認
```bash
# コミット履歴を表示
git log

# コミット履歴をグラフィカルに表示
git log --graph --oneline --all

# 特定ファイルのコミット履歴
git log --follow <ファイル名>

# コミット間の差分を表示
git diff <コミットID1>..<コミットID2>
```

### 変更の一時退避
```bash
# 作業中の変更を一時退避
git stash

# 退避した変更の一覧表示
git stash list

# 最新の退避した変更を復元（スタックから削除）
git stash pop

# 最新の退避した変更を復元（スタックに保持）
git stash apply

# 特定の退避した変更を復元
git stash apply stash@{<番号>}

# 退避した変更を削除
git stash drop stash@{<番号>}

# すべての退避した変更を削除
git stash clear
```

### コミットの修正
```bash
# 直前のコミットメッセージを修正
git commit --amend

# 直前のコミットに変更を追加
git commit --amend --no-edit

# 特定のコミットを取り消す新しいコミットを作成
git revert <コミットID>

# 特定のコミットまで戻る（注意：履歴が書き換わる）
git reset --hard <コミットID>

# 特定のコミットまで戻るが、変更はステージングに残す
git reset --soft <コミットID>
```

### タグ操作
```bash
# タグ一覧表示
git tag

# 注釈付きタグを作成
git tag -a v1.0.0 -m "バージョン1.0.0リリース"

# タグをリモートにプッシュ
git push origin <タグ名>

# すべてのタグをリモートにプッシュ
git push origin --tags
```

### クリーンアップ
```bash
# 追跡されていないファイルを表示
git clean -n

# 追跡されていないファイルを削除
git clean -f

# 追跡されていないファイルとディレクトリを削除
git clean -fd

# ローカルで削除されたリモートブランチを削除
git remote prune origin
```

## 開発ワークフロー例

### 新機能開発
```bash
# developブランチから最新の変更を取得
git checkout develop
git pull

# 新機能ブランチを作成
git checkout -b feature/新機能名

# 変更を加えてコミット
git add .
git commit -m "feat: 新機能の実装"

# 開発中にdevelopの変更を取り込む
git checkout develop
git pull
git checkout feature/新機能名
git merge develop

# 機能完成後、リモートにプッシュ
git push origin feature/新機能名

# GitHub上でPull Requestを作成
```

### バグ修正
```bash
# developブランチから最新の変更を取得
git checkout develop
git pull

# 修正ブランチを作成
git checkout -b fix/バグ名

# 変更を加えてコミット
git add .
git commit -m "fix: バグの修正"

# リモートにプッシュ
git push origin fix/バグ名

# GitHub上でPull Requestを作成
```

### リリース準備
```bash
# developブランチから最新の変更を取得
git checkout develop
git pull

# リリースブランチを作成
git checkout -b release/1.0.0

# 必要な修正を加えてコミット
git add .
git commit -m "chore: バージョン1.0.0の準備"

# リリースタグを作成
git tag -a v1.0.0 -m "バージョン1.0.0リリース"

# mainブランチにマージ
git checkout main
git merge release/1.0.0 --no-ff

# developブランチにもマージ
git checkout develop
git merge release/1.0.0 --no-ff

# タグとブランチをリモートにプッシュ
git push origin main develop v1.0.0
```

## トラブルシューティング

### 一般的な問題
```bash
# 変更を破棄して最新のコミットに戻す
git reset --hard HEAD

# マージ競合を解決後、続行
git add <競合ファイル>
git commit

# 誤ってコミットした変更を元に戻す（履歴は残る）
git revert HEAD

# 誤って削除したファイルを復元
git checkout HEAD -- <ファイル名>
```

### パフォーマンス改善
```bash
# リポジトリの最適化
git gc

# ローカルリポジトリの圧縮
git gc --aggressive

# 不要なオブジェクトの削除
git prune
```

これらのコマンドは状況に応じて適切に使用してください。特に`--force`や`--hard`オプションを使用する場合は注意が必要です。 