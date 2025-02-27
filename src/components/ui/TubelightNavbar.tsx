import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
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
    <nav className={cn("relative", className)}>
      {/* モバイルメニューボタン */}
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      )}

      {/* デスクトップナビゲーション */}
      {!isMobile && (
        <div className="flex items-center justify-center gap-2 p-2">
          {items.map((item) => (
            <PixelTrail key={item.name}>
              <motion.a
                href={item.url}
                onClick={(e) => handleClick(e, item)}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  activeTab === item.name
                    ? "text-white"
                    : "text-white/75 hover:text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </span>
                {activeTab === item.name && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    style={{
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                    }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.a>
            </PixelTrail>
          ))}
        </div>
      )}

      {/* モバイルメニュー */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 p-4">
              {items.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleClick(e, item)}
                  className={cn(
                    "relative px-6 py-3 text-lg font-medium transition-colors rounded-full",
                    activeTab === item.name
                      ? "text-white bg-white/10"
                      : "text-white/75 hover:text-white hover:bg-white/5"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}