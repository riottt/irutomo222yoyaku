import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import NavHeader from "./NavHeader";
import { HamburgerMenu } from "./HamburgerMenu";

interface NavItem {
  name: string;
  url: string;
  icon: any;
  onClick?: () => void;
  isMainNav?: boolean;
}

interface NavBarProps {
  items: NavItem[];
  mobileItems?: NavItem[]; // モバイルメニュー用の別アイテム（オプション）
  className?: string;
  language: 'ko' | 'ja' | 'en';
  onLanguageChange?: (lang: 'ko' | 'ja' | 'en') => void;
}

export function TubelightNavbar({ items, mobileItems, className, language, onLanguageChange }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollTop = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  // アクティブなタブを現在のURLから設定
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = items.find(item => 
      item.url === currentPath || 
      (item.url.startsWith('#') && currentPath === '/')
    );
    
    if (currentItem) {
      setActiveTab(currentItem.name);
    } else {
      // デフォルトはホーム
      setActiveTab(items[0].name);
    }
  }, [location.pathname, items]);

  // スクロール時のヘッダー制御
  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      
      // スクロール位置に応じてシャドウを変更
      if (st > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      lastScrollTop.current = st <= 0 ? 0 : st;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ホームに戻る関数
  const goToHome = () => {
    navigate('/');
  };

  // NavHeaderで使用するアイテム
  const navHeaderItems = items.map(item => ({
    name: item.name,
    url: item.url,
    onClick: item.onClick
  }));

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b overflow-hidden transition-all duration-300",
        isScrolled ? "shadow-md" : "shadow-sm"
      )}
      animate={{ 
        opacity: 1,
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          {/* Logo - クリックでホームに戻る */}
          <div className="cursor-pointer flex items-center" onClick={goToHome}>
            <img src="/irulogo-hidariue.svg" alt="IRUTOMO" className="h-8" />
          </div>

          {/* ナビゲーションメニュー - デスクトップのみ表示 */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <NavHeader items={navHeaderItems} language={language} />
          </div>

          {/* ハンバーガーメニュー - 新しいコンポーネントを使用 */}
          <HamburgerMenu 
            items={mobileItems || items} 
            language={language} 
            onLanguageChange={onLanguageChange}
            activeTab={activeTab}
          />
        </div>
      </div>
    </motion.nav>
  );
}