import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DivideIcon as LucideIcon } from "lucide-react";
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
        <div className="flex items-center justify-center gap-3 py-3">
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
    </nav>
  );
}