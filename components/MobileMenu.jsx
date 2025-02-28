import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Header.module.css';
import LanguageSwitcher from './LanguageSwitcher';

const MobileMenu = ({ isOpen, onClose }) => {
  const router = useRouter();
  
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
  
  // メニュー項目に現在のパスに応じたアクティブスタイルを適用する関数
  const isActive = (path) => {
    return router.pathname === path ? styles.activeMenuItem : '';
  };
  
  // クライアントサイドでポータルを使用してbody直下にレンダリング
  return createPortal(
    <div 
      className={styles.mobileMenuPortal} 
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 99999 }}
    >
      {/* オーバーレイ */}
      <div 
        className={`${styles.overlay} ${styles.overlayVisible}`}
        onClick={onClose}
        aria-hidden="true"
        style={{ height: '100vh', position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 99990 }}
      />
      
      {/* メニュー本体 */}
      <div 
        className={`${styles.mobileMenu} ${styles.mobileMenuVisible}`}
        style={{ position: 'fixed', top: 0, right: 0, height: '100vh', zIndex: 99999 }}
      >
        {/* ロゴ - 常に表示 */}
        <div className={styles.mobileMenuLogo}>
          <Link href="/">
            <a onClick={onClose}>
              <img src="/logo.png" alt="IRU TOMO" />
            </a>
          </Link>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="メニューを閉じる"
          >
            ✕
          </button>
        </div>
        
        <nav className={styles.mobileNav}>
          <ul>
            {/* 通常のメニュー項目 */}
            <li className={isActive('/')}>
              <Link href="/">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>🏠</span>
                  ホーム
                </a>
              </Link>
            </li>
            <li className={isActive('/reservation')}>
              <Link href="/reservation">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>📝</span>
                  予約へ進む
                </a>
              </Link>
            </li>
            <li className={isActive('/restaurants')}>
              <Link href="/restaurants">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>🍽️</span>
                  飲食店一覧
                </a>
              </Link>
            </li>
            <li className={isActive('/contact')}>
              <Link href="/contact">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>📞</span>
                  お問い合わせ
                </a>
              </Link>
            </li>
            
            {/* セパレーター */}
            <li className={styles.menuSeparator}>
              <span className={styles.separatorText}>管理メニュー</span>
            </li>
            
            {/* ハンバーガーメニューにのみ表示する項目 */}
            <li className={`${styles.hamburgerOnly} ${isActive('/options')}`}>
              <Link href="/options">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>⚙️</span>
                  オプション
                </a>
              </Link>
            </li>
            <li className={`${styles.hamburgerOnly} ${isActive('/cautions')}`}>
              <Link href="/cautions">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>⚠️</span>
                  注意事項
                </a>
              </Link>
            </li>
            <li className={`${styles.hamburgerOnly} ${isActive('/admin')}`}>
              <Link href="/admin">
                <a onClick={onClose}>
                  <span className={styles.menuIcon}>👨‍💼</span>
                  管理者ダッシュボード
                </a>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.mobileLangSwitch}>
          <LanguageSwitcher />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MobileMenu; 