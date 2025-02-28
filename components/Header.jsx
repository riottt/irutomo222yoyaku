import React, { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';

const MobileMenu = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className={styles.mobileMenu}>
      {/* ... existing menu items ... */}
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // モバイルメニューをbodyに直接マウントして制約を回避
  useEffect(() => {
    if (typeof document !== 'undefined' && mobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // メニュー表示中はスクロール防止
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''; // コンポーネント解除時に元に戻す
      }
    };
  }, [mobileMenuOpen]);
  
  // ... existing code ...
}

export default Header; 