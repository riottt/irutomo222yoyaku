# トラブルシューティングガイド

## Git関連の問題

### マージ競合
**問題**: ブランチをマージする際に競合が発生した。

**解決策**:
1. `git status`で競合ファイルを確認
2. 各ファイルを開いて競合マーカー（`<<<<<<<`, `=======`, `>>>>>>>`）を探す
3. 競合を手動で解決（両方の変更を適切に統合）
4. `git add <ファイル名>`で解決したファイルをステージング
5. `git commit`でマージを完了

**予防策**:
- 頻繁に`git pull`して最新の変更を取り込む
- 大きな変更は小さなコミットに分割する
- 同じファイルを複数の開発者が同時に編集しないよう調整する

### 誤ったコミット
**問題**: 間違った変更をコミットしてしまった。

**解決策**:
- 直前のコミットを修正: `git commit --amend`
- 特定のコミットを取り消す: `git revert <コミットID>`
- 複数のコミットをやり直す: `git reset --soft HEAD~n`（nはコミット数）

**注意**:
- `git push -f`は共有ブランチでは使用しない
- 履歴を書き換える操作は個人ブランチでのみ行う

### ブランチの混乱
**問題**: 間違ったブランチで作業してしまった。

**解決策**:
1. 変更を一時保存: `git stash`
2. 正しいブランチに切り替え: `git checkout <正しいブランチ>`
3. 変更を適用: `git stash pop`

## React/TypeScript関連の問題

### コンポーネントが再レンダリングされる
**問題**: コンポーネントが不必要に再レンダリングされてパフォーマンスが低下している。

**解決策**:
- React DevToolsのProfilerを使用して再レンダリングの原因を特定
- `React.memo`でコンポーネントをメモ化
- `useCallback`でイベントハンドラをメモ化
- `useMemo`で計算コストの高い処理をメモ化
- 状態の更新を最小限に抑える

```jsx
// メモ化の例
const MemoizedComponent = React.memo(MyComponent);

// useCallbackの例
const handleClick = useCallback(() => {
  // 処理
}, [依存配列]);

// useMemoの例
const expensiveCalculation = useMemo(() => {
  return performExpensiveCalculation(data);
}, [data]);
```

### TypeScriptの型エラー
**問題**: TypeScriptの型エラーが発生している。

**解決策**:
- エラーメッセージを注意深く読む
- 適切な型定義を追加
- 型ガードを使用して型を絞り込む
- 必要に応じて型アサーションを使用（最終手段）

```typescript
// 型ガードの例
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}

if (isUser(data)) {
  // dataはUser型として扱われる
}

// 型アサーションの例（最終手段）
const user = data as User;
```

### useEffect依存配列の問題
**問題**: useEffectの依存配列が原因でバグが発生している。

**解決策**:
- ESLintのexhaustive-depsルールを有効にする
- 依存配列に必要なすべての変数を含める
- オブジェクトや関数を依存配列に含める場合はメモ化する
- 依存配列を空にする場合は、本当にマウント時のみ実行すべきか確認する

```jsx
// 良い例
const memoizedCallback = useCallback(() => {
  doSomething(dependency);
}, [dependency]);

useEffect(() => {
  const result = memoizedCallback();
  // ...
}, [memoizedCallback]);
```

## スタイリング関連の問題

### z-indexの問題
**問題**: 要素が他の要素の下に隠れてしまう。

**解決策**:
- z-indexの値を適切に設定
- 親要素のz-indexとposition設定を確認
- スタッキングコンテキストを理解する

```css
/* z-indexの階層設計 */
:root {
  --z-index-header: 100;
  --z-index-dropdown: 200;
  --z-index-modal: 300;
  --z-index-tooltip: 400;
}

.header {
  position: fixed;
  z-index: var(--z-index-header);
}

.modal {
  position: fixed;
  z-index: var(--z-index-modal);
}
```

### レスポンシブデザインの問題
**問題**: 特定の画面サイズでレイアウトが崩れる。

**解決策**:
- ブラウザの開発者ツールでレスポンシブモードを使用して問題を特定
- メディアクエリを適切に設定
- flexboxやgridを活用して柔軟なレイアウトを作成
- ビューポート単位（vw, vh）を適切に使用

```css
/* メディアクエリの例 */
@media (min-width: 768px) {
  .container {
    flex-direction: row;
  }
}

@media (max-width: 767px) {
  .container {
    flex-direction: column;
  }
}
```

### CSSモジュールの問題
**問題**: CSSモジュールのクラス名が適用されない。

**解決策**:
- インポート文が正しいか確認
- クラス名の適用方法を確認
- 複数のクラスを適用する場合は正しい構文を使用

```jsx
// 正しいインポート
import styles from './Component.module.css';

// 正しいクラス名の適用
<div className={styles.container}>

// 複数のクラスを適用
<div className={`${styles.container} ${styles.active}`}>

// 条件付きクラス
<div className={`${styles.container} ${isActive ? styles.active : ''}`}>
```

## パフォーマンス関連の問題

### アプリケーションの遅延
**問題**: アプリケーションの読み込みや操作が遅い。

**解決策**:
- Chrome DevToolsのPerformanceタブで問題を特定
- 不要な再レンダリングを減らす
- コード分割を実装して初期バンドルサイズを削減
- 画像の最適化
- メモ化を適切に使用

```jsx
// コード分割の例
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### メモリリーク
**問題**: アプリケーションがメモリを過剰に消費する。

**解決策**:
- Chrome DevToolsのMemoryタブでメモリ使用状況を分析
- イベントリスナーを適切にクリーンアップ
- useEffectのクリーンアップ関数を実装
- 大きなデータ構造を適切に管理

```jsx
// イベントリスナーのクリーンアップ
useEffect(() => {
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, [handleResize]);
```

## API/データ取得関連の問題

### データ取得の失敗
**問題**: APIからのデータ取得が失敗する。

**解決策**:
- ネットワークタブでリクエスト/レスポンスを確認
- エラーハンドリングを実装
- リトライメカニズムを追加
- フォールバックUIを表示

```jsx
const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    setError(error.message);
    console.error('Failed to fetch data:', error);
  } finally {
    setLoading(false);
  }
};
```

### 状態管理の問題
**問題**: 複雑な状態管理でバグが発生している。

**解決策**:
- Redux DevToolsを使用して状態の変化を追跡
- アクションとリデューサーを適切に設計
- 不変性を維持する
- 状態の正規化を検討

```jsx
// useReducerの例
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };
    default:
      return state;
  }
}
```

## ビルド/デプロイ関連の問題

### ビルドエラー
**問題**: アプリケーションのビルドが失敗する。

**解決策**:
- エラーメッセージを注意深く読む
- 依存関係の競合を解決
- TypeScriptの型エラーを修正
- 環境変数が正しく設定されているか確認

### 環境変数の問題
**問題**: 環境変数が正しく読み込まれない。

**解決策**:
- `.env`ファイルの名前と場所が正しいか確認
- 環境変数の接頭辞が正しいか確認（例: `REACT_APP_`）
- 環境変数を参照する構文が正しいか確認
- ビルド時に環境変数が含まれているか確認

```
# .env.local の例
REACT_APP_API_URL=https://api.example.com

# 使用例
const apiUrl = process.env.REACT_APP_API_URL;
```

## スクロール関連の問題

### 固定ヘッダーの問題
**問題**: スクロール時にヘッダーが正しく表示されない。

**解決策**:
- `position: fixed`と適切なz-indexを設定
- ヘッダー下にスペーサー要素を配置
- スクロールイベントの最適化

```jsx
// ヘッダーコンポーネントの例
function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        {/* ヘッダーコンテンツ */}
      </header>
      <div className="header-spacer"></div>
    </>
  );
}
```

### スクロール位置の保持
**問題**: ページ遷移後にスクロール位置がリセットされる。

**解決策**:
- React Routerの`ScrollRestoration`コンポーネントを使用
- カスタムフックを作成してスクロール位置を管理
- ローカルストレージにスクロール位置を保存

```jsx
// スクロール位置を保持するカスタムフック
function useScrollPosition(key) {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const savedPosition = localStorage.getItem(key);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
    
    const handleScroll = () => {
      localStorage.setItem(key, window.scrollY.toString());
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [key]);
  
  return scrollPosition;
}
```

これらのトラブルシューティングガイドを参考に、開発中に発生する問題を効率的に解決してください。問題の根本原因を理解し、適切な解決策を適用することが重要です。 