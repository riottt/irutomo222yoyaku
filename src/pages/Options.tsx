import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Check, AlertCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OptionsProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
  onBack: () => void;
}

export default function Options({ 
  language, 
  onLanguageChange,
  onBack
}: OptionsProps) {
  const navigate = useNavigate();

  const basicOptions = [
    {
      title: {
        ko: '기본 예약 (1~4명)',
        ja: '基本予約（1～4名）',
        en: 'Basic Reservation (1-4 people)',
      },
      price: 1000,
      description: {
        ko: '1~4명까지의 일반 예약 서비스입니다. 기본 예약 확인 및 안내가 포함됩니다.',
        ja: '1～4名までの一般予約サービスです。基本的な予約確認と案内が含まれます。',
        en: 'Regular reservation service for 1-4 people. Includes basic reservation confirmation and guidance.',
      },
      includes: [
        {
          ko: '예약 확정 이메일',
          ja: '予約確定メール',
          en: 'Reservation confirmation email',
        },
        {
          ko: '레스토랑 기본 정보 안내',
          ja: 'レストランの基本情報案内',
          en: 'Restaurant basic information',
        },
        {
          ko: '간단한 가이드라인 제공',
          ja: '簡単なガイドライン提供',
          en: 'Simple guidelines provided',
        },
      ],
    },
    {
      title: {
        ko: '중간 규모 예약 (5~8명)',
        ja: '中規模予約（5～8名）',
        en: 'Medium Group Reservation (5-8 people)',
      },
      price: 2000,
      description: {
        ko: '5~8명의 중간 규모 그룹을 위한 예약 서비스입니다. 좀 더 상세한 안내와 지원이 포함됩니다.',
        ja: '5～8名の中規模グループのための予約サービスです。より詳細な案内とサポートが含まれます。',
        en: 'Reservation service for medium-sized groups of 5-8 people. Includes more detailed guidance and support.',
      },
      includes: [
        {
          ko: '예약 확정 이메일',
          ja: '予約確定メール',
          en: 'Reservation confirmation email',
        },
        {
          ko: '레스토랑 상세 정보 안내',
          ja: 'レストランの詳細情報案内',
          en: 'Detailed restaurant information',
        },
        {
          ko: '추가 요청 전달 서비스',
          ja: '追加リクエスト伝達サービス',
          en: 'Additional request delivery service',
        },
        {
          ko: '주변 관광 정보 제공',
          ja: '周辺観光情報の提供',
          en: 'Surrounding tourism information',
        },
      ],
    },
    {
      title: {
        ko: '대규모 예약 (9~12명)',
        ja: '大規模予約（9～12名）',
        en: 'Large Group Reservation (9-12 people)',
      },
      price: 3000,
      description: {
        ko: '9~12명의 대규모 그룹을 위한 예약 서비스입니다. 프리미엄 지원과 상세한 안내가 포함됩니다.',
        ja: '9～12名の大規模グループのための予約サービスです。プレミアムサポートと詳細な案内が含まれます。',
        en: 'Reservation service for large groups of 9-12 people. Includes premium support and detailed guidance.',
      },
      includes: [
        {
          ko: '예약 확정 이메일',
          ja: '予約確定メール',
          en: 'Reservation confirmation email',
        },
        {
          ko: '레스토랑 VIP 정보 안내',
          ja: 'レストランのVIP情報案内',
          en: 'Restaurant VIP information',
        },
        {
          ko: '모든 추가 요청 전달 서비스',
          ja: 'すべての追加リクエスト伝達サービス',
          en: 'All additional request delivery services',
        },
        {
          ko: '주변 관광 및 교통 정보 제공',
          ja: '周辺観光および交通情報の提供',
          en: 'Surrounding tourism and transportation information',
        },
        {
          ko: '긴급 연락처 24시간 제공',
          ja: '緊急連絡先24時間提供',
          en: '24-hour emergency contact provided',
        },
      ],
    },
  ];

  const additionalOptions = [
    {
      title: {
        ko: '특별 요청 전달 서비스',
        ja: '特別リクエスト伝達サービス',
        en: 'Special Request Delivery Service',
      },
      price: 500,
      description: {
        ko: '알레르기, 좌석 선호도, 특별한 행사 등 모든 추가 요청을 레스토랑에 전달해 드립니다.',
        ja: 'アレルギー、座席の好み、特別なイベントなど、すべての追加リクエストをレストランに伝えます。',
        en: 'We will relay all additional requests to the restaurant, such as allergies, seating preferences, special events, etc.',
      },
    },
    {
      title: {
        ko: '맞춤형 음식 가이드',
        ja: 'カスタム料理ガイド',
        en: 'Custom Food Guide',
      },
      price: 800,
      description: {
        ko: '레스토랑의 메뉴에 대한 상세 설명과 추천 메뉴를 포함한 맞춤형 가이드를 제공합니다.',
        ja: 'レストランのメニューに関する詳細な説明とおすすめメニューを含むカスタムガイドを提供します。',
        en: 'We provide a custom guide including detailed descriptions of the restaurant\'s menu and recommended dishes.',
      },
    },
    {
      title: {
        ko: '프리미엄 예약 확정',
        ja: 'プレミアム予約確定',
        en: 'Premium Reservation Confirmation',
      },
      price: 1500,
      description: {
        ko: '우선순위 예약 처리와 함께 24시간 내 빠른 예약 확정을 보장합니다.',
        ja: '優先予約処理とともに24時間以内の迅速な予約確定を保証します。',
        en: 'Guarantees fast reservation confirmation within 24 hours with priority reservation processing.',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-[#FF8C00]">IRUTOMO</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {language === 'ko' ? '예약 옵션' : language === 'ja' ? '予約オプション' : 'Reservation Options'}
          </h1>
          
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {language === 'ko' 
              ? '예약 인원수에 따라 기본 요금이 달라집니다. 추가 옵션을 선택하여 더 맞춤화된 서비스를 받으실 수 있습니다.' 
              : language === 'ja' 
              ? '予約人数によって基本料金が変わります。追加オプションを選択して、よりカスタマイズされたサービスを受けることができます。' 
              : 'The basic fee varies depending on the number of people in your reservation. Select additional options to receive more customized service.'}
          </p>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00] text-center">
              {language === 'ko' ? '기본 옵션' : language === 'ja' ? '基本オプション' : 'Basic Options'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {basicOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden"
                >
                  <div className="bg-[#FFC458]/10 p-6">
                    <h3 className="font-semibold text-lg mb-2">{option.title[language]}</h3>
                    <p className="text-[#FF8C00] font-bold text-2xl">
                      ¥{option.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-6">
                      {option.description[language]}
                    </p>
                    <ul className="space-y-3">
                      {option.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="w-5 h-5 text-[#FF8C00] flex-shrink-0 mr-2" />
                          <span className="text-gray-700">{item[language]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00] text-center">
              {language === 'ko' ? '추가 옵션' : language === 'ja' ? '追加オプション' : 'Additional Options'}
            </h2>
            
            <div className="space-y-6">
              {additionalOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{option.title[language]}</h3>
                      <p className="text-gray-600">{option.description[language]}</p>
                    </div>
                    <div className="mt-4 md:mt-0 md:ml-6 flex-shrink-0">
                      <p className="text-[#FF8C00] font-bold text-xl">
                        ¥{option.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFC458]/10 rounded-lg p-8 mb-12">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-[#FF8C00] flex-shrink-0 mr-3 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-3">
                  {language === 'ko' ? '옵션 관련 주의사항' : language === 'ja' ? 'オプションに関する注意事項' : 'Notes Regarding Options'}
                </h3>
                <ul className="space-y-3 text-gray-700">
                  <li>
                    {language === 'ko' 
                      ? '• 모든 요금은 일본 엔(JPY)으로 표시되며, 세금이 포함된 금액입니다.' 
                      : language === 'ja' 
                      ? '• すべての料金は日本円（JPY）で表示され、税込み金額です。' 
                      : '• All prices are displayed in Japanese Yen (JPY) and include tax.'}
                  </li>
                  <li>
                    {language === 'ko' 
                      ? '• 예약 완료 후에는 옵션 변경이 불가능합니다.' 
                      : language === 'ja' 
                      ? '• 予約完了後はオプションの変更ができません。' 
                      : '• Options cannot be changed after the reservation is completed.'}
                  </li>
                  <li>
                    {language === 'ko' 
                      ? '• 일부 레스토랑에서는 특정 추가 옵션이 제공되지 않을 수 있습니다.' 
                      : language === 'ja' 
                      ? '• 一部のレストランでは特定の追加オプションが提供されない場合があります。' 
                      : '• Certain additional options may not be available at some restaurants.'}
                  </li>
                  <li>
                    {language === 'ko' 
                      ? '• 추가 옵션에 대한 결제는 예약 결제 시 함께 진행됩니다.' 
                      : language === 'ja' 
                      ? '• 追加オプションの支払いは予約支払い時に一緒に行われます。' 
                      : '• Payment for additional options is processed together with the reservation payment.'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center">
            <a
              href="#"
              onClick={onBack}
              className="inline-block bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {language === 'ko' ? '예약하러 가기' : language === 'ja' ? '予約する' : 'Make a Reservation'}
            </a>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-50 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 IRUTOMO All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
} 