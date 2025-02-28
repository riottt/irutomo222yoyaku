import React, { useState, useEffect } from 'react';
import styles from '../styles/Header.module.css';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // スクロール検知のためのイベントリスナー
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
  
  // ESCキーでメニューを閉じる処理を追加
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);
  
  // モバイルメニューをbodyに直接マウントして制約を回避
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (mobileMenuOpen) {
        document.body.style.overflow = 'hidden'; // メニュー表示中はスクロール防止
      } else {
        document.body.style.overflow = ''; // メニューが閉じたら元に戻す
      }
    }
  }, [mobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <a>
              <img src="/logo.png" alt="IRUTOMO" />
            </a>
          </Link>
        </div>
        
        <nav className={styles.desktopNav}>
          <ul>
            <li>
              <Link href="/">
                <a>ホーム</a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a>サービス紹介</a>
              </Link>
            </li>
            <li>
              <Link href="/restaurants">
                <a>飲食店一覧</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a>お問い合わせ</a>
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className={styles.rightSection}>
          <LanguageSwitcher />
          <button 
            className={`${styles.mobileMenuButton} ${mobileMenuOpen ? styles.mobileMenuOpen : ''}`} 
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "メニューを閉じる" : "メニューを開く"}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
      
      {/* 外部コンポーネントとしてモバイルメニューを使用 */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  );
};

export default Header; 