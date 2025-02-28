# TypeScript & React ベストプラクティス

## TypeScript基本原則

### 型定義
- 明示的な型定義を優先する
- `any`型の使用は最小限に抑える
- ユニオン型を活用して柔軟性を確保する
- 型ガード関数を使用して型安全性を高める

```typescript
// 良い例
function getUser(id: number): User | null {
  // ...
}

// 型ガードの例
function isUser(obj: any): obj is User {
  return obj && typeof obj.id === 'number' && typeof obj.name === 'string';
}
```

### インターフェースと型エイリアス
- 拡張可能性が必要な場合はインターフェースを使用
- 複雑な型や組み合わせには型エイリアスを使用
- 一貫性を保つために、プロジェクト内で統一する

```typescript
// インターフェース（拡張可能）
interface User {
  id: number;
  name: string;
  email: string;
}

interface AdminUser extends User {
  permissions: string[];
}

// 型エイリアス（組み合わせや複雑な型）
type UserRole = 'admin' | 'editor' | 'viewer';
type UserWithRole = User & { role: UserRole };
```

### ジェネリクス
- 再利用可能なコンポーネントや関数に使用
- 制約を適切に設定して型安全性を確保

```typescript
// ジェネリクスの例
function getFirstItem<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[0] : undefined;
}

// 制約付きジェネリクス
interface HasId {
  id: number;
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}
```

### 非同期処理の型定義
- Promise型を明示的に指定
- async/await関数の戻り値型を明示

```typescript
// 良い例
async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error('User not found');
  }
  return response.json();
}
```

## React & TypeScript統合

### コンポーネントの型定義
- コンポーネントのpropsにはインターフェースを使用
- 子要素の型には`React.ReactNode`を使用
- イベントハンドラには適切なReactイベント型を使用

```typescript
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false, children }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
      {children}
    </button>
  );
};
```

### Hooks型定義
- useState初期値から型推論を活用
- 複雑な状態には明示的な型を指定
- useReducerには適切なAction型を定義

```typescript
// useState
const [user, setUser] = useState<User | null>(null);

// useReducer
type Action = 
  | { type: 'INCREMENT'; payload: number }
  | { type: 'DECREMENT'; payload: number }
  | { type: 'RESET' };

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case 'INCREMENT':
      return state + action.payload;
    case 'DECREMENT':
      return state - action.payload;
    case 'RESET':
      return 0;
  }
}

const [count, dispatch] = useReducer(reducer, 0);
```

### カスタムHooks
- 戻り値の型を明示的に定義
- ジェネリクスを活用して再利用性を高める

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

## React コンポーネント設計

### 関数コンポーネント
- 関数コンポーネントとHooksを使用
- アロー関数よりも`function`キーワードを優先（デバッグしやすい）
- 大きなコンポーネントは小さな責任を持つコンポーネントに分割

```typescript
// 良い例
function UserProfile({ user }: { user: User }) {
  return (
    <div>
      <UserAvatar user={user} />
      <UserDetails user={user} />
      <UserActions user={user} />
    </div>
  );
}

// 小さなコンポーネントに分割
function UserAvatar({ user }: { user: User }) {
  return <img src={user.avatarUrl} alt={user.name} />;
}

function UserDetails({ user }: { user: User }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}
```

### メモ化
- 不必要な再レンダリングを防ぐために`React.memo`を使用
- イベントハンドラには`useCallback`を使用
- 計算コストの高い処理には`useMemo`を使用

```typescript
// コンポーネントのメモ化
const MemoizedUserList = React.memo(UserList);

// イベントハンドラのメモ化
const handleClick = useCallback(() => {
  console.log('Button clicked');
}, []);

// 計算結果のメモ化
const sortedUsers = useMemo(() => {
  return [...users].sort((a, b) => a.name.localeCompare(b.name));
}, [users]);
```

### 副作用の管理
- 副作用は`useEffect`内に限定
- 依存配列を適切に設定
- クリーンアップ関数を返す

```typescript
useEffect(() => {
  const subscription = api.subscribe(data => {
    setData(data);
  });
  
  // クリーンアップ関数
  return () => {
    subscription.unsubscribe();
  };
}, [api]); // 依存配列
```

### コンテキストの活用
- グローバル状態にはコンテキストを使用
- コンテキストプロバイダーとカスタムフックを組み合わせる

```typescript
// コンテキスト定義
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// プロバイダー
function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// カスタムフック
function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
```

## パフォーマンス最適化

### レンダリング最適化
- 不要な再レンダリングを避ける
- 状態の更新は必要な時だけ行う
- 大きなリストには仮想化ライブラリを使用

```typescript
// 状態更新の最適化
const handleChange = (id: number, value: string) => {
  setItems(prev => prev.map(item => 
    item.id === id ? { ...item, value } : item
  ));
};

// リストの仮想化（react-window使用例）
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ItemComponent item={items[index]} />
    </div>
  );
  
  return (
    <FixedSizeList
      height={500}
      width="100%"
      itemCount={items.length}
      itemSize={50}
    >
      {Row}
    </FixedSizeList>
  );
}
```

### コード分割
- React.lazyとSuspenseを使用して動的インポート
- ルートベースのコード分割を実装

```typescript
const UserProfile = React.lazy(() => import('./UserProfile'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/profile" element={<UserProfile />} />
        {/* その他のルート */}
      </Routes>
    </Suspense>
  );
}
```

## エラー処理

### エラーバウンダリ
- エラーバウンダリを使用して予期せぬエラーをキャッチ
- フォールバックUIを提供

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// 使用例
<ErrorBoundary fallback={<div>Something went wrong</div>}>
  <UserProfile />
</ErrorBoundary>
```

### 非同期エラー処理
- try/catchを使用して非同期エラーを処理
- エラー状態を管理するためのフックを作成

```typescript
function useAsync<T, E = Error>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus('pending');
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus('success');
    } catch (e) {
      setError(e as E);
      setStatus('error');
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

// 使用例
function UserProfile({ userId }: { userId: number }) {
  const { status, value: user, error } = useAsync(() => fetchUser(userId));

  if (status === 'pending') return <div>Loading...</div>;
  if (status === 'error') return <div>Error: {error?.message}</div>;
  if (!user) return <div>No user found</div>;

  return <div>{user.name}</div>;
}
```

これらのベストプラクティスを参考に、型安全で保守性の高いReactアプリケーションを開発してください。プロジェクトの進行に合わせて、必要に応じてガイドラインを更新してください。 