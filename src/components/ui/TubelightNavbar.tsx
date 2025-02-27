import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DivideIcon as LucideIcon, Globe, Home, Info, AlertCircle, Store, Star } from "lucide-react";
import { cn } from "../../lib/utils";
import { useScreenSize } from "../hooks/use-screen-size";
import { Sidebar, SidebarBody, SidebarLink, LanguageButton } from "./Sidebar";
import { useNavigate } from "react-router-dom";

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
  const screenSize = useScreenSize();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
    if (isMobile) {
      setIsMenuOpen(false);
    }
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
  const sidebarItems = [
    {
      name: "ホーム",
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

  return (
    <nav className="relative bg-white border-b overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-3">
          {/* Logo - クリックでホームに戻る */}
          <div className="cursor-pointer" onClick={goToHome}>
            <img src="/irulogo-hidariue.svg" alt="IRUTOMO" className="h-8" />
          </div>

          {/* デスクトップメニュー - 常に表示 */}
          <div className="flex-1 items-center justify-center gap-3 flex ml-4">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleClick(e, item)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-gray-600 hover:text-[#FF8C00]",
                    isActive && "text-[#FF8C00]",
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-[#FF8C00]/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#FF8C00] rounded-t-full">
                        <div className="absolute w-12 h-6 bg-[#FF8C00]/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-[#FF8C00]/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-[#FF8C00]/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </a>
              );
            })}
          </div>

          {/* サイドバーメニュー */}
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
    </nav>
  );
}