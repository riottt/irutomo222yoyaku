import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommercialTransactionsProps {
  language: 'ko' | 'ja' | 'en';
}

export default function CommercialTransactions({ language }: CommercialTransactionsProps) {
  const navigate = useNavigate();
  
  const translations = {
    ko: {
      title: '특정상거래법에 기한 표기',
      back: '뒤로',
      content: `
# 특정상거래법에 기한 표기

판매업자: IRUTOMO 대표자: 專齊夏暉

소재지/주소: 大阪府吹田市江坂町２丁目１−６４

고객 센터 번호: 050-7121-1998
고객 센터 접수 시간: 10:00~19:00

이메일 주소: gespokrofficial@gmail.com

홈페이지 URL: https://irutomops.studio.site

결제 방법: 신용카드

결제 시기/기한:
* 신용카드: 즉시
* 편의점: 주문 후 7일 이내

서비스 제공 시기: 예약일에 서비스를 제공합니다
* 구매시, 예약 확정 후 이메일과 마이페이지를 통해 예약 내용 및 바우처(해당하는 경우)를 확인할 수 있습니다
      `,
    },
    ja: {
      title: '特定商取引法に基づく表記',
      back: '戻る',
      content: `
# 特定商取引法に基づく表記

販売業者: IRUTOMO 代表者: 專齊夏暉 
所在地/住所:  大阪府吹田市江坂町２丁目１−６４

カスタマーセンター番号: 050-7121-1998 
カスタマーセンター受付時間: 10:00~19:00 

メールアドレス: gespokrofficial@gmail.com 

ホームページURL: https://irutomops.studio.site

支払方法: クレジットカード

支払時期/期限:
* クレジットカード: 即時
* コンビニエンスストア: 注文後7日以内

引き渡し時期: 予約日にサービスを提供します
* 購入時、予約確定後にメールとマイページを通じて予約内容およびバウチャー（該当する場合）を確認できます
      `,
    },
    en: {
      title: 'Commercial Transaction Act',
      back: 'Back',
      content: `
# Commercial Transaction Act

Seller: IRUTOMO Representative: Sensei Natsuaki
Location/Address: 2-1-64 Esaka-cho, Suita City, Osaka Prefecture

Customer Center Number: 050-7121-1998
Customer Center Hours: 10:00~19:00

Email Address: gespokrofficial@gmail.com

Website URL: https://irutomops.studio.site

Payment Method: Credit Card

Payment Timing/Deadline:
* Credit Card: Immediate
* Convenience Store: Within 7 days of order

Service Provision Timing: Services are provided on the reservation date
* Upon purchase, after reservation confirmation, you can check the reservation details and voucher (if applicable) via email and your account page
      `,
    }
  };

  const t = translations[language] || translations.ja;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-[#FF8C00] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t.back}
          </button>
          <h1 className="text-2xl font-bold text-[#FF8C00] ml-4">{t.title}</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="commercial-transactions-content prose max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: `
                  <style>
                    h1 { color: #FF8C00; margin-top: 1rem; margin-bottom: 2rem; font-size: 1.8rem; }
                    p { margin-bottom: 1rem; line-height: 1.6; }
                    ul { margin-left: 1.5rem; margin-bottom: 1rem; list-style-type: disc; }
                    li { margin-bottom: 0.5rem; }
                  </style>
                  ${t.content
                    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n\* /g, '</p><ul><li>')
                    .replace(/\n\* /g, '</li><li>')
                    .replace(/<\/li><li>([^<]*?)$/g, '</li></ul><p>')
                    .replace(/^<\/p>/, '')
                    .replace(/$/, '</p>')}
                `
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 