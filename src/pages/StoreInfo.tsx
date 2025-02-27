import React from 'react';
import { motion } from 'framer-motion';
import { TubelightNavbar } from '../components/ui/TubelightNavbar';
import { Store, MapPin, Phone, Globe, Clock, UtensilsCrossed, Cake, Info } from 'lucide-react';

interface StoreInfoProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
  onBack: () => void;
}

export default function StoreInfo({ language, onLanguageChange, onBack }: StoreInfoProps) {
  const NAV_ITEMS = [
    {
      name: language === 'ko' ? '점포 정보' : language === 'ja' ? '店舗情報' : 'Store Info',
      url: '#',
      icon: Store,
    },
    {
      name: language === 'ko' ? '홈으로 돌아가기' : language === 'ja' ? 'ホームに戻る' : 'Back to Home',
      url: '#',
      icon: Info,
      onClick: onBack,
    },
  ];

  const areaNames = {
    ko: {
      osaka: '오사카',
      kyoto: '교토',
      nara: '나라',
      kobe: '고베'
    },
    ja: {
      osaka: '大阪',
      kyoto: '京都',
      nara: '奈良',
      kobe: '神戸'
    },
    en: {
      osaka: 'Osaka',
      kyoto: 'Kyoto',
      nara: 'Nara',
      kobe: 'Kobe'
    }
  };

  const categoryNames = {
    ko: {
      sushi: '스시',
      yakitori: '야키토리',
      ramen: '라멘',
      cafe: '카페',
      yakiniku: '야키니쿠'
    },
    ja: {
      sushi: '寿司',
      yakitori: '焼き鳥',
      ramen: 'ラーメン',
      cafe: 'カフェ',
      yakiniku: '焼肉'
    },
    en: {
      sushi: 'Sushi',
      yakitori: 'Yakitori',
      ramen: 'Ramen',
      cafe: 'Cafe',
      yakiniku: 'Yakiniku'
    }
  };

  const featuredRestaurants = [
    {
      id: 1,
      name: {
        ko: '스시 미즈타니',
        ja: 'すし みずたに',
        en: 'Sushi Mizutani'
      },
      category: 'sushi',
      area: 'osaka',
      address: {
        ko: '오사카시 중앙구 도톤보리 1-2-3',
        ja: '大阪市中央区道頓堀1-2-3',
        en: '1-2-3 Dotonbori, Chuo-ku, Osaka'
      },
      phone: '06-1234-5678',
      hours: '11:30-14:00, 17:00-22:00',
      website: 'https://sushi-mizutani.jp',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800',
      description: {
        ko: '전통적인 에도마에 스시를 즐길 수 있는 오사카의 인기 스시 레스토랑입니다. 신선한 해산물과 숙련된 셰프의 기술을 경험해보세요.',
        ja: '伝統的な江戸前寿司を楽しめる大阪の人気寿司レストランです。新鮮な海産物と熟練したシェフの技術を体験してください。',
        en: 'A popular sushi restaurant in Osaka where you can enjoy traditional Edomae sushi. Experience fresh seafood and the skills of experienced chefs.'
      },
      vegetarianOptions: true,
      averagePrice: {
        ko: '점심 5,000엔~ / 저녁 15,000엔~',
        ja: 'ランチ 5,000円~ / ディナー 15,000円~',
        en: 'Lunch 5,000 yen~ / Dinner 15,000 yen~'
      }
    },
    {
      id: 2,
      name: {
        ko: '야키토리 혼포',
        ja: '焼き鳥 本舗',
        en: 'Yakitori Honpo'
      },
      category: 'yakitori',
      area: 'osaka',
      address: {
        ko: '오사카시 기타구 우메다 4-5-6',
        ja: '大阪市北区梅田4-5-6',
        en: '4-5-6 Umeda, Kita-ku, Osaka'
      },
      phone: '06-2345-6789',
      hours: '16:00-23:30',
      website: 'https://yakitori-honpo.jp',
      image: 'https://images.unsplash.com/photo-1519690889869-e705e59f72e1?q=80&w=800',
      description: {
        ko: '오사카 우메다에 위치한 인기 야키토리 전문점입니다. 다양한 부위의 닭꼬치와 함께 일본 사케를 즐겨보세요.',
        ja: '大阪梅田に位置する人気焼き鳥専門店です。さまざまな部位の焼き鳥と一緒に日本酒をお楽しみください。',
        en: 'A popular yakitori restaurant located in Umeda, Osaka. Enjoy various parts of chicken skewers with Japanese sake.'
      },
      vegetarianOptions: false,
      averagePrice: {
        ko: '1인당 4,000엔~',
        ja: '一人あたり4,000円~',
        en: '4,000 yen~ per person'
      }
    },
    {
      id: 3,
      name: {
        ko: '교토 카페',
        ja: '京都カフェ',
        en: 'Kyoto Cafe'
      },
      category: 'cafe',
      area: 'kyoto',
      address: {
        ko: '교토시 사쿄구 기요미즈 7-8-9',
        ja: '京都市左京区清水7-8-9',
        en: '7-8-9 Kiyomizu, Sakyo-ku, Kyoto'
      },
      phone: '075-345-6789',
      hours: '9:00-18:00',
      website: 'https://kyoto-cafe.jp',
      image: 'https://images.unsplash.com/photo-1594444406257-89085db8e09c?q=80&w=800',
      description: {
        ko: '교토의 전통적인 마치야를 개조한 카페입니다. 계절의 화과자와 함께 마티차를 즐길 수 있습니다.',
        ja: '京都の伝統的な町家を改造したカフェです。季節の和菓子と共に抹茶を楽しめます。',
        en: 'A cafe renovated from a traditional Kyoto machiya. You can enjoy matcha tea with seasonal Japanese sweets.'
      },
      vegetarianOptions: true,
      averagePrice: {
        ko: '1인당 2,000엔~',
        ja: '一人あたり2,000円~',
        en: '2,000 yen~ per person'
      }
    },
    {
      id: 4,
      name: {
        ko: '라멘 이치란',
        ja: 'ラーメン一蘭',
        en: 'Ramen Ichiran'
      },
      category: 'ramen',
      area: 'osaka',
      address: {
        ko: '오사카시 나니와구 난바 10-11-12',
        ja: '大阪市浪速区難波10-11-12',
        en: '10-11-12 Namba, Naniwa-ku, Osaka'
      },
      phone: '06-3456-7890',
      hours: '24시간 영업',
      website: 'https://ichiran.com',
      image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?q=80&w=800',
      description: {
        ko: '유명한 돈코츠 라멘 체인점입니다. 개인 칸막이 좌석에서 당신만의 맛을 찾을 수 있습니다.',
        ja: '有名な豚骨ラーメンチェーン店です。個室風カウンター席であなただけの味を見つけられます。',
        en: 'A famous tonkotsu ramen chain. Find your own flavor in a private booth seat.'
      },
      vegetarianOptions: false,
      averagePrice: {
        ko: '1,000엔~',
        ja: '1,000円~',
        en: '1,000 yen~'
      }
    }
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
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            {language === 'ko' ? '제휴 점포 정보' : language === 'ja' ? '提携店舗情報' : 'Affiliated Store Information'}
          </h1>
          
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            {language === 'ko' 
              ? 'IRUTOMO와 제휴하고 있는 다양한 레스토랑을 확인해보세요. 모든 레스토랑은 IRUTOMO 서비스를 통해 예약이 가능합니다.' 
              : language === 'ja' 
              ? 'IRUTOMOと提携しているさまざまなレストランをご確認ください。すべてのレストランはIRUTOMOサービスを通じて予約が可能です。' 
              : 'Check out the various restaurants affiliated with IRUTOMO. All restaurants can be booked through the IRUTOMO service.'}
          </p>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-8 text-[#FF8C00] text-center">
              {language === 'ko' ? '추천 레스토랑' : language === 'ja' ? 'おすすめレストラン' : 'Recommended Restaurants'}
            </h2>
            
            <div className="space-y-12">
              {featuredRestaurants.map((restaurant, index) => (
                <motion.div
                  key={restaurant.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 h-60 md:h-auto overflow-hidden">
                      <img 
                        src={restaurant.image} 
                        alt={restaurant.name[language]} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-center mb-2">
                        <span className="inline-block bg-[#FFC458]/20 text-[#FF8C00] text-xs px-2 py-1 rounded mr-2">
                          {categoryNames[language][restaurant.category as keyof typeof categoryNames.ko]}
                        </span>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {areaNames[language][restaurant.area as keyof typeof areaNames.ko]}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{restaurant.name[language]}</h3>
                      <p className="text-gray-600 mb-4">{restaurant.description[language]}</p>
                      
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start">
                          <MapPin className="w-4 h-4 text-[#FF8C00] mt-1 mr-2 flex-shrink-0" />
                          <span>{restaurant.address[language]}</span>
                        </div>
                        <div className="flex items-start">
                          <Phone className="w-4 h-4 text-[#FF8C00] mt-1 mr-2 flex-shrink-0" />
                          <span>{restaurant.phone}</span>
                        </div>
                        <div className="flex items-start">
                          <Clock className="w-4 h-4 text-[#FF8C00] mt-1 mr-2 flex-shrink-0" />
                          <span>{restaurant.hours}</span>
                        </div>
                        <div className="flex items-start">
                          <Globe className="w-4 h-4 text-[#FF8C00] mt-1 mr-2 flex-shrink-0" />
                          <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {restaurant.website}
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center">
                          {restaurant.vegetarianOptions && (
                            <div className="flex items-center mr-4 text-xs text-green-600">
                              <UtensilsCrossed className="w-4 h-4 mr-1" />
                              <span>
                                {language === 'ko' ? '채식 옵션 있음' : language === 'ja' ? 'ベジタリアンオプションあり' : 'Vegetarian options available'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {language === 'ko' ? '평균 가격' : language === 'ja' ? '平均価格' : 'Average price'}
                          </p>
                          <p className="font-semibold text-[#FF8C00]">{restaurant.averagePrice[language]}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-[#FFC458]/10 rounded-lg p-8 mb-12 text-center">
            <Cake className="w-10 h-10 text-[#FF8C00] mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">
              {language === 'ko' ? '더 많은 레스토랑을 찾고 계신가요?' : language === 'ja' ? 'もっと多くのレストランをお探しですか？' : 'Looking for more restaurants?'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              {language === 'ko' 
                ? 'IRUTOMO는 300개 이상의 레스토랑과 제휴하고 있습니다. 예약 페이지에서 지역, 요리 종류, 가격대 등으로 검색하여 원하는 레스토랑을 찾아보세요.' 
                : language === 'ja' 
                ? 'IRUTOMOは300以上のレストランと提携しています。予約ページで地域、料理の種類、価格帯などで検索して、希望のレストランを探してみてください。' 
                : 'IRUTOMO is affiliated with more than 300 restaurants. Search by area, cuisine type, price range, etc. on the reservation page to find the restaurant you want.'}
            </p>
            <a
              href="#"
              onClick={onBack}
              className="inline-block bg-[#FF8C00] hover:bg-[#E67E00] text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              {language === 'ko' ? '레스토랑 검색하기' : language === 'ja' ? 'レストランを検索する' : 'Search Restaurants'}
            </a>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '파트너 레스토랑이 되고 싶으신가요?' : language === 'ja' ? 'パートナーレストランになりたいですか？' : 'Want to become a partner restaurant?'}
            </h3>
            <p className="text-gray-600 mb-4">
              {language === 'ko' 
                ? 'IRUTOMO와 파트너가 되어 한국인 관광객들에게 당신의 레스토랑을 소개해보세요. 파트너십 문의는 아래 이메일로 연락주시기 바랍니다.' 
                : language === 'ja' 
                ? 'IRUTOMOのパートナーになって韓国人観光客にあなたのレストランを紹介してみませんか。パートナーシップのお問い合わせは以下のメールアドレスまでご連絡ください。' 
                : 'Become a partner with IRUTOMO and introduce your restaurant to Korean tourists. Please contact us at the email below for partnership inquiries.'}
            </p>
            <p className="text-[#FF8C00] font-medium">partner@irutomo.com</p>
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