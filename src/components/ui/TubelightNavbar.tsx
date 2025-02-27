import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DivideIcon as LucideIcon, Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useScreenSize } from "../hooks/use-screen-size";
import { PixelTrail } from "./PixelTrail";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
  onClick?: () => void;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  language: 'ko' | 'ja';
}

export function TubelightNavbar({ items, className, language }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name);
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const screenSize = useScreenSize();

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
    }
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="relative bg-white border-b overflow-hidden">
      <div className="absolute inset-0">
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 24 : 40}
          fadeDuration={800}
          delay={200}
          pixelClassName="rounded-full bg-[#FF8C00]/10"
        />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between py-3">
          {/* ハンバーガーメニューボタン - モバイル時のみ表示 */}
          {isMobile && (
            <button 
              className="text-gray-600 hover:text-[#FF8C00] z-10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
          
          {/* デスクトップメニュー - モバイル時は非表示 */}
          <div className={cn("flex-1 items-center justify-center gap-3", isMobile ? "hidden" : "flex")}>
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
        </div>
      </div>

      {/* モバイル用サイドメニュー */}
      {isMobile && (
        <motion.div 
          className={cn(
            "fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 py-20 px-4",
            isMenuOpen ? "block" : "hidden"
          )}
          initial={{ x: -300 }}
          animate={{ x: isMenuOpen ? 0 : -300 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-6">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleClick(e, item)}
                  className={cn(
                    "flex items-center space-x-3 text-base font-medium px-4 py-2 rounded-md transition-colors",
                    "text-gray-700 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00]",
                    isActive && "bg-[#FF8C00]/10 text-[#FF8C00]",
                  )}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
      
      {/* バックドロップ - モバイルメニュー開放時のみ表示 */}
      {isMobile && isMenuOpen && (
        <motion.div 
          className="fixed inset-0 bg-black/30 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </nav>
  );
}