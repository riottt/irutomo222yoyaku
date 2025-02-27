import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  language: 'ko' | 'ja' | 'en';
}

export default function Footer({ language }: FooterProps) {
  const translations = {
    ko: {
      privacyPolicy: '개인정보 처리방침',
      commercialTransactions: '특정상거래법에 기한 표기',
      copyright: '© 2024 IRUTOMO. All rights reserved.',
      contact: '문의하기',
    },
    ja: {
      privacyPolicy: 'プライバシーポリシー',
      commercialTransactions: '特定商取引法に基づく表記',
      copyright: '© 2024 IRUTOMO. All rights reserved.',
      contact: 'お問い合わせ',
    },
    en: {
      privacyPolicy: 'Privacy Policy',
      commercialTransactions: 'Commercial Transaction Act',
      copyright: '© 2024 IRUTOMO. All rights reserved.',
      contact: 'Contact Us',
    }
  };

  const t = translations[language] || translations.ja;

  return (
    <footer className="bg-gray-50 mt-8 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <img 
              src="/irulogo-hidariue.svg" 
              alt="IRUTOMO" 
              className="h-8 mb-2"
            />
            <p className="text-sm text-gray-500">{t.copyright}</p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8 items-center">
            <Link 
              to="/privacy-policy" 
              className="text-sm text-gray-600 hover:text-[#FF8C00] transition-colors"
            >
              {t.privacyPolicy}
            </Link>
            <Link 
              to="/commercial-transactions" 
              className="text-sm text-gray-600 hover:text-[#FF8C00] transition-colors"
            >
              {t.commercialTransactions}
            </Link>
            <a 
              href="mailto:gespokrofficial@gmail.com" 
              className="text-sm text-gray-600 hover:text-[#FF8C00] transition-colors"
            >
              {t.contact}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 