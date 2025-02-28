import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const MobileMenu = ({ isOpen, onClose }) => {
  // ESCキーでメニューを閉じる処理
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  
  // スクロール防止
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden'; // メニュー表示中はスクロール防止
      } else {
        document.body.style.overflow = ''; // メニューが閉じたら元に戻す
      }
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = ''; // コンポーネント解除時に元に戻す
      }
    };
  }, [isOpen]);
  
  // サーバーサイドレンダリング時にはポータルを使用しない
  if (typeof document === 'undefined' || !isOpen) {
    return null;
  }
  
  // クライアントサイドでポータルを使用してbody直下にレンダリング
  return createPortal(
    <>
      {/* オーバーレイ */}
      <div 
        className={`${styles.overlay} ${styles.overlayVisible}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* メニュー本体 */}
      <div className={`${styles.mobileMenu} ${styles.mobileMenuVisible}`}>
        <div className={styles.mobileMenuHeader}>
          {/* closeボタンは非表示にしているので省略可能 */}
        </div>
        <nav className={styles.mobileNav}>
          <ul>
            <li>
              <Link href="/">
                <a onClick={onClose}>ホーム</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a onClick={onClose}>サービス紹介</a>
              </Link>
            </li>
            <li>
              <Link href="/restaurants">
                <a onClick={onClose}>飲食店一覧</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a onClick={onClose}>お問い合わせ</a>
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.mobileLangSwitch}>
          <LanguageSwitcher />
        </div>
      </div>
    </>,
    document.body
  );
};

export default MobileMenu; 