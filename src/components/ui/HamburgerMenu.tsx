import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink, LanguageButton } from "./Sidebar";
import { Menu } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: any;
  onClick?: () => void;
  isMainNav?: boolean;
}

interface HamburgerMenuProps {
  items: NavItem[];
  language: 'ko' | 'ja' | 'en';
  onLanguageChange?: (lang: 'ko' | 'ja' | 'en') => void;
  activeTab?: string;
}

export function HamburgerMenu({ 
  items, 
  language, 
  onLanguageChange,
  activeTab = ''
}: HamburgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 言語切り替えハンドラー
  const handleLanguageChange = (lang: 'ko' | 'ja' | 'en') => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  // メインナビ項目と管理メニュー項目を分離
  const mainNavItems = items.filter(item => item.isMainNav !== false);
  const hamburgerOnlyItems = items.filter(item => item.isMainNav === false);

  // ハンバーガーメニューアイコンをクリックしたときの処理
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative z-50">
      {/* ハンバーガーアイコン */}
      <div 
        className="md:hidden flex items-center justify-center cursor-pointer"
        onClick={toggleMenu}
        aria-label="メニューを開く"
        role="button"
      >
        <Menu
          className="text-[#FF8C00] hover:text-[#E67E00] transition-colors"
          size={24}
        />
      </div>

      {/* サイドバーメニュー */}
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
                  icon: <item.icon size={20} />,
                  onClick: (e) => {
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
                }}
                className={activeTab === item.name ? "bg-[#FFC458]/10 text-[#FF8C00]" : ""}
              />
            ))}
            
            {/* ハンバーガーメニュー専用の項目がある場合はセパレーターを表示 */}
            {hamburgerOnlyItems.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">管理メニュー</p>
              </div>
            )}
            
            {/* ハンバーガーメニュー専用の項目 */}
            {hamburgerOnlyItems.map((item) => (
              <SidebarLink
                key={item.name}
                link={{
                  name: item.name,
                  url: item.url,
                  icon: <item.icon size={20} />,
                  onClick: (e) => {
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
                }}
                className={activeTab === item.name ? "bg-[#FFC458]/10 text-[#FF8C00]" : ""}
              />
            ))}
            
            {/* 言語切り替えセクション - サイドバー内に表示 */}
            <div className="mt-6 pt-6 border-t border-gray-100">
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
  );
} 