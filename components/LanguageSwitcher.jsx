import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/LanguageSwitcher.module.css';

const LanguageSwitcher = ({ floating = false }) => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  const buttonRefs = useRef({
    ja: null,
    en: null
  });
  
  // リップルエフェクト用の状態
  const [ripples, setRipples] = useState([]);
  
  // 5秒後にリップルを削除
  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples([]);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [ripples]);
  
  const createRipple = (e, locale) => {
    const button = buttonRefs.current[locale];
    if (!button) return;
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    const newRipple = {
      id: Date.now(),
      locale,
      size,
      x,
      y
    };
    
    setRipples([...ripples, newRipple]);
  };
  
  const changeLanguage = (locale, e) => {
    // リップルエフェクト作成
    createRipple(e, locale);
    
    // localStorage に選択した言語を保存
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', locale);
    }
    
    // LPページの時の特別な処理
    if (pathname === '/') {
      // クエリパラメータを保持しながら言語切り替え
      router.push({ pathname: '/', query }, asPath, { locale: locale });
      return;
    }
    
    router.push({ pathname, query }, asPath, { locale });
  };
  
  return (
    <div className={`${styles.languageSwitcher} ${floating ? styles.floating : ''}`}>
      <button 
        ref={(el) => buttonRefs.current.ja = el}
        className={router.locale === 'ja' ? styles.active : ''} 
        onClick={(e) => changeLanguage('ja', e)}
      >
        日本語
        {ripples.filter(r => r.locale === 'ja').map(ripple => (
          <span 
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size
            }}
          />
        ))}
      </button>
      <button 
        ref={(el) => buttonRefs.current.en = el}
        className={router.locale === 'en' ? styles.active : ''} 
        onClick={(e) => changeLanguage('en', e)}
      >
        English
        {ripples.filter(r => r.locale === 'en').map(ripple => (
          <span 
            key={ripple.id}
            className={styles.ripple}
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size
            }}
          />
        ))}
      </button>
    </div>
  );
};

export default LanguageSwitcher; 