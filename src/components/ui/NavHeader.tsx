"use client"; 

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

interface NavHeaderProps {
  items: Array<{
    name: string;
    url: string;
    onClick?: () => void;
  }>;
  language: 'ko' | 'ja' | 'en';
}

function NavHeader({ items, language }: NavHeaderProps) {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });
  const [activeTab, setActiveTab] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef<HTMLUListElement>(null);

  // アクティブなタブを現在のURLから設定
  useEffect(() => {
    const currentPath = location.pathname;
    const currentItem = items.find(item => 
      item.url === currentPath || 
      (item.url.startsWith('#') && currentPath === '/')
    );
    
    if (currentItem) {
      setActiveTab(currentItem.name);
      // アクティブなタブにカーソルを自動設定
      const activeElement = document.querySelector(`[data-tab="${currentItem.name}"]`);
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement as HTMLElement;
        setPosition({
          left: offsetLeft,
          width: offsetWidth,
          opacity: 1
        });
      }
    } else {
      // デフォルトはホーム
      const homeItem = items.find(item => item.url === '/');
      if (homeItem) {
        setActiveTab(homeItem.name);
      }
    }
  }, [location.pathname, items]);

  const handleClick = (url: string, onClick?: () => void, name?: string) => {
    if (name) {
      setActiveTab(name);
    }
    
    if (onClick) {
      onClick();
    } else if (url.startsWith('#')) {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (url.startsWith('/')) {
      navigate(url);
    }
  };

  return (
    <ul
      ref={navRef}
      className="relative mx-auto flex w-fit rounded-full border-2 border-[#FF8C00] bg-white p-1"
      onMouseLeave={() => {
        // マウスが離れた時、アクティブなタブにカーソルを戻す
        const activeElement = document.querySelector(`[data-tab="${activeTab}"]`);
        if (activeElement) {
          const { offsetLeft, offsetWidth } = activeElement as HTMLElement;
          setPosition({
            left: offsetLeft,
            width: offsetWidth,
            opacity: 1
          });
        } else {
          setPosition((pv) => ({ ...pv, opacity: 0 }));
        }
      }}
    >
      {items.map((item) => (
        <Tab 
          key={item.name} 
          name={item.name}
          active={activeTab === item.name}
          setPosition={setPosition}
          onClick={() => handleClick(item.url, item.onClick, item.name)}
        >
          {item.name}
        </Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

const Tab = ({
  children,
  name,
  active,
  setPosition,
  onClick,
}: {
  children: React.ReactNode;
  name: string;
  active: boolean;
  setPosition: any;
  onClick: () => void;
}) => {
  const ref = useRef<HTMLLIElement>(null);
  
  // アクティブなタブ用のエフェクト
  useEffect(() => {
    if (active && ref.current) {
      const { width } = ref.current.getBoundingClientRect();
      setPosition({
        width,
        opacity: 1,
        left: ref.current.offsetLeft,
      });
    }
  }, [active, setPosition]);

  return (
    <motion.li
      ref={ref}
      onClick={onClick}
      data-tab={name}
      onMouseEnter={() => {
        if (!ref.current) return;

        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          width,
          opacity: 1,
          left: ref.current.offsetLeft,
        });
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.li>
  );
};

const Cursor = ({ position }: { position: any }) => {
  return (
    <motion.li
      animate={position}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 28
      }}
      className="absolute z-0 h-7 rounded-full bg-[#FF8C00] md:h-12"
    />
  );
};

export default NavHeader; 