import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DivideIcon as LucideIcon, Globe, Home, Info, AlertCircle, Store, Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { useScreenSize } from "../hooks/use-screen-size";
import { Sidebar, SidebarBody, SidebarLink, LanguageButton } from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import NavHeader from "./NavHeader";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollTop = useRef(0);
  const screenSize = useScreenSize();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // スクロール時のハンバーガーメニュー制御
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

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setActiveTab(item.name);
    if (item.onClick) {
      item.onClick();
    } else if (item.url.startsWith('#')) {
      const element = document.querySelector(item.url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (item.url.startsWith('/')) {
      navigate(item.url);
    }
    setIsMenuOpen(false);
  };

  // 言語切り替えハンドラー
  const handleLanguageChange = (lang: 'ko' | 'ja' | 'en') => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // ホームに戻る関数
  const goToHome = () => {
    navigate('/');
    setIsMenuOpen(false);
  };

  // サイドバー用のナビゲーションアイテム
  const sidebarItems = mobileItems ? mobileItems.map(item => ({
    name: item.name,
    url: item.url,
    icon: <item.icon size={20} />,
    isMainNav: item.isMainNav,
    onClick: (e: any) => {
      e.preventDefault();
      if (item.onClick) {
        item.onClick();
      } else if (item.url.startsWith('#')) {
        const element = document.querySelector(item.url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (item.url.startsWith('/')) {
        navigate(item.url);
      }
      setIsMenuOpen(false);
    }
  })) : items.map(item => ({
    name: item.name,
    url: item.url,
    icon: <item.icon size={20} />,
    onClick: (e: any) => {
      e.preventDefault();
      if (item.onClick) {
        item.onClick();
      } else if (item.url.startsWith('#')) {
        const element = document.querySelector(item.url);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (item.url.startsWith('/')) {
        navigate(item.url);
      }
      setIsMenuOpen(false);
    }
  }));

  // メインナビ項目と管理メニュー項目を分離
  const mainNavItems = sidebarItems.filter(item => item.isMainNav !== false);
  const hamburgerOnlyItems = sidebarItems.filter(item => item.isMainNav === false);

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

          {/* ナビゲーションメニュー - ロゴと同じ行に配置 */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <NavHeader items={navHeaderItems} language={language} />
          </div>

          {/* ハンバーガーメニュー - 常に右上に表示 */}
          <div className="flex items-center">
            <Sidebar open={isMenuOpen} setOpen={setIsMenuOpen}>
              <SidebarBody>
                <div className="flex flex-col space-y-2">
                  {/* メインナビゲーション項目 */}
                  {mainNavItems.map((item) => (
                    <SidebarLink
                      key={item.name}
                      link={{
                        name: item.name,
                        url: item.url,
                        icon: item.icon,
                        onClick: item.onClick
                      }}
                      className={activeTab === item.name ? "bg-[#FFC458]/10 text-[#FF8C00]" : ""}
                    />
                  ))}
                  
                  {/* ハンバーガーメニュー専用の項目がある場合はセパレーターを表示 */}
                  {hamburgerOnlyItems.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500 mb-2 px-4">管理メニュー</p>
                    </div>
                  )}
                  
                  {/* ハンバーガーメニュー専用の項目 */}
                  {hamburgerOnlyItems.map((item) => (
                    <SidebarLink
                      key={item.name}
                      link={{
                        name: item.name,
                        url: item.url,
                        icon: item.icon,
                        onClick: item.onClick
                      }}
                      className={activeTab === item.name ? "bg-[#FFC458]/10 text-[#FF8C00]" : ""}
                    />
                  ))}
                  
                  {/* 言語切り替えセクション - サイドバー内に表示 */}
                  <div className="mt-6 pt-6 border-t border-gray-100 px-6">
                    <p className="text-sm text-gray-500 mb-3">言語を選択</p>
                    <div className="flex flex-col space-y-2">
                      <LanguageButton
                        language={language}
                        targetLang="en"
                        label="English"
                        onClick={() => handleLanguageChange("en")}
                      />
                      <LanguageButton
                        language={language}
                        targetLang="ja"
                        label="日本語"
                        onClick={() => handleLanguageChange("ja")}
                      />
                      <LanguageButton
                        language={language}
                        targetLang="ko"
                        label="한국어"
                        onClick={() => handleLanguageChange("ko")}
                      />
                    </div>
                  </div>
                </div>
              </SidebarBody>
            </Sidebar>
          </div>
        </div>
        
        {/* モバイル専用のナビゲーションメニュー */}
        <div className="md:hidden flex justify-center py-2">
          <NavHeader items={navHeaderItems} language={language} />
        </div>
      </div>
    </motion.nav>
  );
}