import { cn } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
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

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
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
  const { open, setOpen } = useSidebar();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
    setOpen(false);
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
        <div 
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          <Menu
            className="text-[#FF8C00] hover:text-[#E67E00] transition-colors"
            size={24}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full md:w-[300px] top-0 right-0 bg-white shadow-lg z-[100] flex flex-col",
                className
              )}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <div className="text-xl font-bold text-[#FF8C00] cursor-pointer" onClick={handleLogoClick}>
                  <img src="irulogo-hidariue.svg" alt="IRUTOMO" className="h-6" />
                </div>
                <div
                  className="cursor-pointer text-[#FF8C00] hover:text-[#E67E00] transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <X size={24} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {children}
              </div>
            </motion.div>
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
    <a
      href={link.url}
      className={cn(
        "flex items-center px-6 py-3 hover:bg-[#FFC458]/10 text-gray-700 hover:text-[#FF8C00] transition-colors",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="mr-3">{link.icon}</span>
      <span className="font-medium">{link.name}</span>
    </a>
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
    <button
      className={cn(
        "flex items-center justify-center px-4 py-2 rounded-md w-full transition-colors",
        isActive 
          ? "bg-[#FFC458]/20 text-[#FF8C00]" 
          : "hover:bg-[#FFC458]/10 text-gray-600 hover:text-[#FF8C00]",
        className
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}; 