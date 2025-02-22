import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface LanguageToggleProps {
  language: 'ko' | 'ja';
  onToggle: () => void;
  className?: string;
}

export function LanguageToggle({ language, onToggle, className }: LanguageToggleProps) {
  const isKorean = language === 'ko';

  return (
    <div
      className={cn(
        "flex w-20 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isKorean
          ? "bg-[#FF8C00]/5 border border-[#FF8C00]/20"
          : "bg-white border border-[#FF8C00]/20",
        className
      )}
      onClick={onToggle}
      role="button"
      tabIndex={0}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-8 h-6 rounded-full text-sm font-medium transition-transform duration-300",
            isKorean
              ? "transform translate-x-0 bg-[#FF8C00] text-white"
              : "transform translate-x-9 bg-[#FF8C00] text-white"
          )}
        >
          {isKorean ? "한" : "日"}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-8 h-6 rounded-full text-sm font-medium transition-transform duration-300",
            isKorean
              ? "text-[#FF8C00]"
              : "transform -translate-x-9 text-[#FF8C00]"
          )}
        >
          {isKorean ? "日" : "한"}
        </div>
      </div>
      <motion.div
        layoutId="language-glow"
        className="absolute -inset-0.5 bg-[#FF8C00]/10 rounded-full blur-sm -z-10"
        initial={false}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </div>
  );
}