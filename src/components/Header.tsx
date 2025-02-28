import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative flex items-center justify-between p-4">
      {/* ... existing code ... */}
      
      {/* モバイルメニューボタン */}
      <button
        onClick={toggleSidebar}
        className="md:hidden flex items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <Menu className="h-6 w-6" />
      </button>
    </div>

    {/* サイドバー - z-indexを高く設定し、固定位置に */}
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg"
        >
          {/* サイドバーの内容 */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="IRUTOMO" className="h-6" />
              </Link>
              <button onClick={toggleSidebar} aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* サイドバーのリンク */}
            <div className="flex flex-col p-4 space-y-4">
              {/* ... existing sidebar links ... */}
            </div>
            
            {/* 言語切り替え */}
            <div className="mt-auto p-4 border-t">
              <div className="flex space-x-2">
                {/* ... language buttons ... */}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Header; 