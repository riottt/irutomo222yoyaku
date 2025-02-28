import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  const { t, i18n } = useTranslation(['common', 'landing']);
  const router = useRouter();
  
  // ユーザーの言語設定を確認して適用
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    // 保存された言語がある、かつ現在の言語と異なる場合は切り替え
    if (savedLanguage && savedLanguage !== router.locale) {
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }
  }, []);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>{t('common:title')}</title>
        <meta name="description" content={t('common:description')} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Header />
      
      <main className={styles.main}>
        <h1 className={styles.title}>
          {t('landing:welcome')}
        </h1>
        
        <p className={styles.description}>
          {t('landing:description')}
        </p>
        
        <div className={styles.grid}>
          {/* ここにLPのコンテンツを追加 */}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// getStaticPropsの修正
export async function getStaticProps({ locale }) {
  // localeが未定義の場合のフォールバック
  const currentLocale = locale || 'ja';
  
  return {
    props: {
      ...(await serverSideTranslations(currentLocale, [
        'common',
        'landing', // LPのための翻訳ファイルを追加
      ])),
    },
  };
} 