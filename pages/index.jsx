import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function Home() {
  const { t } = useTranslation('common');
  const router = useRouter();
  
  // ... existing code ...
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