import React from 'react';
import { motion } from 'framer-motion';
import { TubelightNavbar } from '../components/ui/TubelightNavbar';
import { Info, Phone, Globe, Clock, CreditCard } from 'lucide-react';

interface ServiceIntroductionProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
  onBack: () => void;
}

export default function ServiceIntroduction({ 
  language, 
  onLanguageChange,
  onBack
}: ServiceIntroductionProps) {
  
  const NAV_ITEMS = [
    {
      name: language === 'ko' ? '서비스 소개' : language === 'ja' ? 'サービス紹介' : 'Service',
      url: '#',
      icon: Info,
    },
    {
      name: language === 'ko' ? '홈으로 돌아가기' : language === 'ja' ? 'ホームに戻る' : 'Back to Home',
      url: '#',
      icon: Info,
      onClick: onBack,
    },
  ];

  const features = [
    {
      icon: Phone,
      title: {
        ko: '일본 전화번호 없이 예약',
        ja: '日本の電話番号なしで予約',
        en: 'Reserve Without Japanese Phone',
      },
      description: {
        ko: '한국 전화번호만으로 일본 인기 레스토랑을 예약할 수 있습니다. 일본어 통화 걱정 없이 맛집을 경험하세요.',
        ja: '韓国の電話番号だけで日本の人気レストランを予約できます。日本語での会話の心配なく美味しいお店を体験しましょう。',
        en: 'Reserve at popular Japanese restaurants with just your Korean phone number. Experience great restaurants without worrying about Japanese phone calls.',
      },
    },
    {
      icon: Globe,
      title: {
        ko: '다국어 지원',
        ja: '多言語対応',
        en: 'Multilingual Support',
      },
      description: {
        ko: '한국어, 일본어, 영어로 서비스를 이용할 수 있어 언어 장벽 없이 편리하게 이용 가능합니다.',
        ja: '韓国語、日本語、英語でサービスを利用できるため、言語の壁なく便利に利用可能です。',
        en: 'Use our service in Korean, Japanese, and English for a convenient experience without language barriers.',
      },
    },
    {
      icon: Clock,
      title: {
        ko: '빠른 예약 확정',
        ja: '迅速な予約確定',
        en: 'Quick Reservation Confirmation',
      },
      description: {
        ko: '평균 2시간 이내에 예약을 확정해 드립니다. 급한 예약도 걱정 마세요.',
        ja: '平均2時間以内に予約を確定いたします。急ぎの予約も心配いりません。',
        en: "We confirm reservations within an average of 2 hours. Don't worry about urgent reservations.",
      },
    },
    {
      icon: CreditCard,
      title: {
        ko: '간편한 결제',
        ja: '簡単な決済',
        en: 'Easy Payment',
      },
      description: {
        ko: '신용카드, 페이팔 등 다양한 결제 방법을 지원합니다. 안전하고 편리한 결제 시스템을 이용하세요.',
        ja: 'クレジットカード、PayPalなど様々な決済方法に対応しています。安全で便利な決済システムをご利用ください。',
        en: 'We support various payment methods including credit cards and PayPal. Use our safe and convenient payment system.',
      },
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: {
        ko: '레스토랑 선택',
        ja: 'レストラン選択',
        en: 'Select Restaurant',
      },
      description: {
        ko: '지역, 요리 종류 등으로 원하는 레스토랑을 검색하고 선택하세요.',
        ja: '地域、料理の種類などで希望のレストランを検索して選択してください。',
        en: 'Search and select your desired restaurant by location, cuisine type, etc.',
      },
    },
    {
      number: '02',
      title: {
        ko: '예약 정보 입력',
        ja: '予約情報入力',
        en: 'Enter Reservation Info',
      },
      description: {
        ko: '날짜, 시간, 인원 수 등 필요한 정보를 입력하세요.',
        ja: '日付、時間、人数など必要な情報を入力してください。',
        en: 'Enter necessary information such as date, time, number of guests, etc.',
      },
    },
    {
      number: '03',
      title: {
        ko: '수수료 결제',
        ja: '手数料のお支払い',
        en: 'Pay the Fee',
      },
      description: {
        ko: '1,000엔의 예약 수수료를 결제하세요. 이 금액은 레스토랑 이용 금액과는 별도입니다.',
        ja: '1,000円の予約手数料をお支払いください。この金額はレストランの利用料金とは別です。',
        en: 'Pay the reservation fee of 1,000 yen. This amount is separate from the restaurant bill.',
      },
    },
    {
      number: '04',
      title: {
        ko: '예약 확정',
        ja: '予約確定',
        en: 'Reservation Confirmation',
      },
      description: {
        ko: '당사 담당자가 레스토랑에 직접 연락하여 예약을 확정합니다. 확정 후 이메일로 알려드립니다.',
        ja: '当社の担当者がレストランに直接連絡し、予約を確定します。確定後、メールでお知らせします。',
        en: 'Our staff will contact the restaurant directly to confirm your reservation. You will be notified by email upon confirmation.',
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
        <TubelightNavbar items={NAV_ITEMS} language={language} onLanguageChange={onLanguageChange} />
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {language === 'ko' ? '서비스 소개' : language === 'ja' ? 'サービス紹介' : 'Service Introduction'}
          </h1>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-[#FF8C00]">
              {language === 'ko' ? 'IRUTOMO란?' : language === 'ja' ? 'IRUTOMOとは？' : 'What is IRUTOMO?'}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {language === 'ko' 
                ? 'IRUTOMO는 한국인을 위한 일본 레스토랑 예약 서비스입니다. 일본어를 몰라도, 일본 전화번호가 없어도 쉽게 인기 있는 일본 레스토랑을 예약할 수 있습니다. "있을 友(친구)"라는 의미의 IRUTOMO는 여러분의 일본 여행에서 든든한 친구가 되어 드립니다.'
                : language === 'ja'
                ? 'IRUTOMOは韓国人のための日本のレストラン予約サービスです。日本語が分からなくても、日本の電話番号がなくても、簡単に人気のある日本のレストランを予約することができます。「いる友（友達）」という意味のIRUTOMOは、あなたの日本旅行における頼もしい友達になります。'
                : 'IRUTOMO is a Japanese restaurant reservation service for Koreans. Even if you don\'t know Japanese or don\'t have a Japanese phone number, you can easily reserve popular Japanese restaurants. IRUTOMO, meaning "friend who is there" in Japanese, will be your reliable friend during your trip to Japan.'}
            </p>
            <p className="text-gray-700 leading-relaxed">
              {language === 'ko'
                ? '주요 서비스 지역은 오사카, 교토, 나라, 고베 등 간사이 지역을 중심으로 운영되며, 점차 도쿄 등 다른 지역으로 확대할 예정입니다.'
                : language === 'ja'
                ? '主なサービス地域は大阪、京都、奈良、神戸など関西地域を中心に運営されており、徐々に東京などの他の地域にも拡大する予定です。'
                : 'Our main service areas are Osaka, Kyoto, Nara, Kobe, and other Kansai regions, with plans to gradually expand to other areas such as Tokyo.'}
            </p>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00]">
              {language === 'ko' ? '서비스 특징' : language === 'ja' ? 'サービスの特徴' : 'Service Features'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md p-6 border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-[#FFC458]/20 p-3 rounded-full mr-4">
                      <feature.icon className="w-6 h-6 text-[#FF8C00]" />
                    </div>
                    <h3 className="font-semibold text-lg">{feature.title[language]}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description[language]}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00]">
              {language === 'ko' ? '이용 방법' : language === 'ja' ? '利用方法' : 'How to Use'}
            </h2>
            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col md:flex-row items-start md:items-center gap-6"
                >
                  <div className="flex-shrink-0 bg-[#FFC458] text-white font-bold text-2xl w-14 h-14 rounded-full flex items-center justify-center">
                    {step.number}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold text-lg mb-2">{step.title[language]}</h3>
                    <p className="text-gray-600">{step.description[language]}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFC458]/10 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-[#FF8C00]">
              {language === 'ko' ? '자주 묻는 질문' : language === 'ja' ? 'よくある質問' : 'FAQ'}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === 'ko' 
                    ? '예약 수수료는 얼마인가요?' 
                    : language === 'ja' 
                    ? '予約手数料はいくらですか？' 
                    : 'How much is the reservation fee?'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ko' 
                    ? '모든 예약에 대해 일률적으로 1,000엔의 수수료가 부과됩니다. 이 금액은 예약 서비스에 대한 비용이며, 레스토랑 이용 금액과는 별도입니다.' 
                    : language === 'ja' 
                    ? 'すべての予約に対して一律1,000円の手数料が発生します。この金額は予約サービスに対する費用であり、レストランの利用料金とは別です。' 
                    : 'A flat fee of 1,000 yen is charged for all reservations. This amount is for the reservation service and is separate from the restaurant bill.'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === 'ko' 
                    ? '예약이 확정되기까지 얼마나 걸리나요?' 
                    : language === 'ja' 
                    ? '予約が確定するまでどのくらいかかりますか？' 
                    : 'How long does it take to confirm a reservation?'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ko' 
                    ? '일반적으로 2시간 이내에 예약 확정 여부를 알려드립니다. 단, 레스토랑의 응답 시간에 따라 더 오래 걸릴 수 있습니다.' 
                    : language === 'ja' 
                    ? '一般的に2時間以内に予約確定の可否をお知らせします。ただし、レストランの応答時間によってはさらに時間がかかる場合があります。' 
                    : 'We will generally notify you of the reservation confirmation within 2 hours. However, it may take longer depending on the restaurant\'s response time.'}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {language === 'ko' 
                    ? '예약을 취소할 수 있나요?' 
                    : language === 'ja' 
                    ? '予約をキャンセルできますか？' 
                    : 'Can I cancel my reservation?'}
                </h3>
                <p className="text-gray-700">
                  {language === 'ko' 
                    ? '예약이 확정되기 전에는 취소가 가능하며 수수료는 전액 환불됩니다. 예약 확정 후에는 취소가 불가능하며 수수료는 환불되지 않습니다.' 
                    : language === 'ja' 
                    ? '予約が確定する前であればキャンセルが可能で、手数料は全額返金されます。予約確定後はキャンセルができず、手数料も返金されません。' 
                    : 'You can cancel before the reservation is confirmed, and the fee will be fully refunded. After confirmation, cancellation is not possible, and the fee is non-refundable.'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 IRUTOMO All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
} 