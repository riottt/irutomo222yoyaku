import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, createContext, useContext, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

interface Links {
  name: string;
  url: string;
  icon: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
  isScrolling: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollTop = useRef(0);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  // スクロール検出とサイドバー制御
  useEffect(() => {
    const handleScroll = () => {
      const st = window.scrollY;
      const scrollDelta = Math.abs(st - lastScrollTop.current);
      
      // スクロール状態を検出（閾値以上のスクロールがあった場合）
      if (scrollDelta > 10) {
        setIsScrolling(true);
        
        // 下スクロール時、メニューが開いていれば閉じる
        if (st > lastScrollTop.current && st > 50 && open) {
          setOpen(false);
        }
        
        // スクロール状態を一定時間後にリセット
        setTimeout(() => {
          setIsScrolling(false);
        }, 200);
      }
      
      lastScrollTop.current = st <= 0 ? 0 : st;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open, setOpen]);

  // サイドバーが開いているときは背景スクロールを防止
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate, isScrolling }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return <MobileSidebar {...(props as React.ComponentProps<"div">)} />;
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen, isScrolling } = useSidebar();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
    setOpen(false);
  };
  
  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, setOpen]);

  // サイドバー外クリックで閉じる
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex items-center justify-end z-20",
          className
        )}
        {...props}
      >
        <motion.div 
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="メニューを開く"
          aria-expanded={open}
          aria-controls="sidebar-menu"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <Menu
            className="text-[#FF8C00] hover:text-[#E67E00] transition-colors"
            size={24}
          />
        </motion.div>
        <AnimatePresence>
          {open && (
            <>
              {/* オーバーレイ背景 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black z-[99]"
                onClick={handleOverlayClick}
                aria-hidden="true"
              />
              
              {/* サイドバー本体 */}
              <motion.div
                initial={{ x: "100%", opacity: 0.5 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                }}
                className={cn(
                  "fixed h-full w-full md:w-[300px] top-0 right-0 bg-white shadow-lg z-[100] flex flex-col",
                  className
                )}
              >
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="text-xl font-bold text-[#FF8C00] cursor-pointer" onClick={handleLogoClick}>
                    <img src="/irulogo-hidariue.svg" alt="IRUTOMO" className="h-6" />
                  </div>
                  <motion.div
                    className="cursor-pointer text-[#FF8C00] hover:text-[#E67E00] transition-colors"
                    onClick={() => setOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="メニューを閉じる"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(false);
                      }
                    }}
                  >
                    <X size={24} />
                  </motion.div>
                </div>
                <div className="flex-1 overflow-y-auto py-4" id="sidebar-menu" role="navigation" aria-label="サイドバーメニュー">
                  {children}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
  props?: any;
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (link.onClick) {
      link.onClick(e);
    } else if (link.url && link.url.startsWith('/')) {
      navigate(link.url);
    }
  };

  return (
    <motion.a
      href={link.url}
      className={cn(
        "flex items-center px-6 py-3 hover:bg-[#FFC458]/10 text-gray-700 hover:text-[#FF8C00] transition-colors",
        className
      )}
      onClick={handleClick}
      whileHover={{ x: 5 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <span className="mr-3">{link.icon}</span>
      <span className="font-medium">{link.name}</span>
    </motion.a>
  );
};

// 言語切り替えボタンコンポーネント
export const LanguageButton = ({
  language,
  targetLang,
  label,
  onClick,
  className,
}: {
  language: string;
  targetLang: string;
  label: string;
  onClick: () => void;
  className?: string;
}) => {
  const isActive = language === targetLang;
  
  return (
    <motion.button
      className={cn(
        "flex items-center justify-center px-4 py-2 rounded-md w-full transition-colors",
        isActive 
          ? "bg-[#FFC458]/20 text-[#FF8C00]" 
          : "hover:bg-[#FFC458]/10 text-gray-600 hover:text-[#FF8C00]",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: isActive ? 1 : 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      {label}
    </motion.button>
  );
}; 