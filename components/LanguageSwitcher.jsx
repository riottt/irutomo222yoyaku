import { useRouter } from 'next/router';
import styles from '../styles/LanguageSwitcher.module.css';

const LanguageSwitcher = () => {
  const router = useRouter();
  const { pathname, asPath, query } = router;
  
  const changeLanguage = (locale) => {
    // パスが '/' (ルートパス/LP) の場合の特別処理
    if (pathname === '/') {
      router.push('/', '/', { locale });
      return;
    }
    
    router.push({ pathname, query }, asPath, { locale });
  };
  
  return (
    <div className={styles.languageSwitcher}>
      <button onClick={() => changeLanguage('ja')}>日本語</button>
      <button onClick={() => changeLanguage('en')}>English</button>
    </div>
  );
};

export default LanguageSwitcher; 