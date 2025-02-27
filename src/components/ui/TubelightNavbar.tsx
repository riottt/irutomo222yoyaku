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
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  language: 'ko' | 'ja' | 'en';
  onLanguageChange?: (lang: 'ko' | 'ja' | 'en') => void;
}

export function TubelightNavbar({ items, className, language, onLanguageChange }: NavBarProps) {
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
      
      // スクロール方向を判定
      if (st > lastScrollTop.current && st > 50) {
        // 下スクロール時
        setIsScrolled(true);
        // メニューが開いていたら閉じる
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      } else if (st < lastScrollTop.current) {
        // 上スクロール時
        setIsScrolled(false);
      }
      
      lastScrollTop.current = st <= 0 ? 0 : st;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMenuOpen]);

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

  // ナビゲーションアイテムにホームを追加
  const navItemsWithHome = [
    {
      name: language === 'ko' ? '홈' : language === 'ja' ? 'ホーム' : 'Home',
      url: '/',
      icon: Home,
      onClick: goToHome
    },
    ...items
  ];

  // サイドバー用のナビゲーションアイテム
  const sidebarItems = [
    {
      name: language === 'ko' ? '홈' : language === 'ja' ? 'ホーム' : 'Home',
      url: "/",
      icon: <Home size={20} />,
      onClick: (e: any) => {
        e.preventDefault();
        navigate('/');
        setIsMenuOpen(false);
      }
    },
    ...items.map(item => ({
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
    }))
  ];

  // NavHeaderで使用するアイテム
  const navHeaderItems = navItemsWithHome.map(item => ({
    name: item.name,
    url: item.url,
    onClick: item.onClick
  }));

  return (
    <motion.nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-white border-b overflow-hidden transition-all duration-300",
        isScrolled ? "shadow-md transform -translate-y-1/2 opacity-0" : "shadow-sm transform translate-y-0 opacity-100"
      )}
      animate={{ 
        y: isScrolled ? -20 : 0,
        opacity: isScrolled ? 0.95 : 1,
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
                  {sidebarItems.map((item) => (
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