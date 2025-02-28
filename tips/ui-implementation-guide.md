# UI実装ガイドライン

## ナビゲーション実装

### 基本原則
- ナビゲーション項目は`lib/navigation.ts`で一元管理
- デスクトップとモバイルで表示項目を分離（`getHeaderNavItems`と`getMobileNavItems`）
- ナビゲーション関数は各ラッパーコンポーネント内で定義し、子コンポーネントに渡す

### 実装例
```typescript
// ヘッダー用のナビゲーションアイテム（限定バージョン）
const HEADER_NAV_ITEMS = getHeaderNavItems(language, {
  goToHome,
  goToServiceIntroduction,
  goToStoreInfo,
  goToReviews
});

// ハンバーガーメニュー用のナビゲーションアイテム（全アイテム）
const MOBILE_NAV_ITEMS = getMobileNavItems(language, {
  goToHome,
  goToServiceIntroduction,
  goToOptions,
  goToCautions,
  goToStoreInfo,
  goToReviews,
  goToReservation,
  goToLogin,
  goToAdmin
});
```

### ナビゲーション項目の型定義
```typescript
interface NavItem {
  name: string;
  url: string;
  icon: any;
  onClick?: () => void;
  isMainNav?: boolean;
}
```

### ナビゲーション関数の実装
```typescript
export const getHeaderNavItems = (language: 'ko' | 'ja' | 'en', goToFunctions: {
  goToHome: () => void;
  goToServiceIntroduction: () => void;
  goToStoreInfo: () => void;
  goToReviews: () => void;
}): NavItem[] => {
  // 実装...
};
```

## ヘッダー実装

### 基本原則
- ヘッダーは常に`position: fixed`で固定表示
- z-indexは9980以上を使用（モーダルやオーバーレイとの関係を考慮）
- スクロール検知を使用してシャドウ効果を動的に変更可能
- スクロール時にヘッダーを非表示にする実装は避ける（ユーザビリティ低下）

### 固定ヘッダーのCSS実装
```css
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background-color: var(--background-color, #ffffff);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 9980;
  transition: all 0.3s ease;
}

.scrolled {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
```

### スクロール検知の実装
```javascript
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
```

### コンテンツオーバーラップ防止
```jsx
<>
  <Header />
  <div className="h-16 md:h-16 mt-2"></div>
  <main>{children}</main>
</>
```

## スクロール対応

### 基本原則
- ヘッダー下にはスペーサー要素を配置（`<div className="h-16 md:h-16 mt-2"></div>`）
- スクロールイベントリスナーは最適化（throttlingなど）
- スクロール位置の保存には`useRef`を使用

### スクロールイベントの最適化
```javascript
// throttling関数
const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// 最適化されたスクロールハンドラー
useEffect(() => {
  const handleScroll = throttle(() => {
    if (window.scrollY > 20) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, 100); // 100msごとに実行
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

### スクロール位置の保存
```javascript
const lastScrollTop = useRef(0);

useEffect(() => {
  const handleScroll = () => {
    const st = window.scrollY;
    
    // スクロール方向を判定
    if (st > lastScrollTop.current) {
      // 下スクロール時の処理
    } else {
      // 上スクロール時の処理
    }
    
    lastScrollTop.current = st <= 0 ? 0 : st;
  };
  
  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}, []);
```

## レスポンシブデザイン

### 基本原則
- モバイルファーストアプローチを採用
- メディアクエリは一貫して使用（例: `@media (min-width: 768px)`）
- 画面サイズに応じた適切なUIコンポーネントの表示/非表示

### メディアクエリの実装
```css
/* モバイル向けのデフォルトスタイル */
.desktopNav {
  display: none;
}

/* タブレット・デスクトップ向けのスタイル */
@media (min-width: 768px) {
  .desktopNav {
    display: block;
  }
  
  .mobileMenuButton {
    display: none;
  }
}
```

### レスポンシブなコンポーネント実装
```jsx
const NavMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // 初期化
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <>
      {isMobile ? <MobileMenu /> : <DesktopMenu />}
    </>
  );
};
```

## モバイルメニュー実装

### 基本原則
- モバイルメニューはReact Portalを使用してDOMの最上位にレンダリング
- オーバーレイとメニューのz-indexを適切に設定
- メニュー表示中は背景スクロールを防止

### React Portalの実装
```jsx
import { createPortal } from 'react-dom';

const MobileMenu = ({ isOpen, onClose }) => {
  if (typeof document === 'undefined') return null;
  
  // メニュー表示中は背景スクロールを防止
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className="mobileMenuPortal">
      <div className="overlay" onClick={onClose}></div>
      <div className="mobileMenu">
        {/* メニュー内容 */}
      </div>
    </div>,
    document.body
  );
};
```

### モバイルメニューのCSS
```css
.mobileMenuPortal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9995;
  pointer-events: none;
}

.mobileMenuPortal > * {
  pointer-events: auto;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9990;
}

.mobileMenu {
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 320px;
  height: 100vh;
  background-color: white;
  z-index: 9999;
  overflow-y: auto;
  transform: translateX(0);
  transition: transform 0.3s ease-in-out;
}
```

## アクセシビリティ対応

### 基本原則
- キーボード操作のサポート
- スクリーンリーダー対応
- 適切なコントラスト比の確保
- WAI-ARIA属性の適切な使用

### キーボード操作のサポート
```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [isMenuOpen]);
```

### WAI-ARIA属性の使用
```jsx
<button 
  className="mobileMenuButton" 
  onClick={toggleMenu}
  aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
  aria-expanded={isMenuOpen}
  aria-controls="mobile-menu"
>
  {/* ハンバーガーアイコン */}
</button>

<div 
  id="mobile-menu"
  role="dialog"
  aria-modal="true"
  aria-hidden={!isMenuOpen}
>
  {/* メニュー内容 */}
</div>
```

これらのガイドラインを参考に、一貫性のあるUI実装を行ってください。プロジェクトの進行に合わせて、必要に応じてガイドラインを更新してください。 