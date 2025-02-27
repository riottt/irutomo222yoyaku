import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Phone, Clock, CreditCard, Info, Store, Star, AlertCircle, Settings, XCircle, Camera, UtensilsCrossed, Cake, DoorClosed, MapPin, Calendar } from 'lucide-react';
import { ParticleButton } from './components/ui/particle-button';
import { renderCanvas } from './components/ui/canvas';
import { TubelightNavbar } from './components/ui/TubelightNavbar';
import { getCommonNavItems } from './lib/navigation';

interface LandingPageProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
}

const FOOD_IMAGES = [
  {
    url: 'https://images.unsplash.com/photo-1553621042-f6e147245754',
    alt: 'Japanese Sushi',
  },
  {
    url: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c',
    alt: 'Tempura',
  },
  {
    url: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56',
    alt: 'Ramen',
  },
  {
    url: 'https://images.unsplash.com/photo-1624374053855-39a5a1a41402',
    alt: 'Wagyu Beef',
  },
];

const CAUTION_ITEMS = {
  ko: [
    {
      title: '예약 취소 불가',
      description: '예약이 확정된 후에는 취소가 불가능합니다. 신중하게 예약해주세요.',
    },
    {
      title: '수수료 환불 불가',
      description: '예약 수수료는 어떠한 경우에도 환불되지 않습니다.',
    },
    {
      title: '예약 시간 엄수',
      description: '예약 시간 10분 전까지 도착하지 않을 경우 예약이 취소될 수 있습니다.',
    },
    {
      title: '인원 수 변경',
      description: '예약 인원 수의 변경은 불가능합니다. 새로 예약해주셔야 합니다.',
    },
    {
      title: '노쇼 패널티',
      description: '노쇼 시 향후 서비스 이용이 제한될 수 있습니다.',
    }
  ],
  ja: [
    {
      title: '予約キャンセル不可',
      description: '予約確定後のキャンセルはできません。慎重に予約してください。',
    },
    {
      title: '手数料返金不可',
      description: '予約手数料はいかなる場合も返金されません。',
    },
    {
      title: '予約時間厳守',
      description: '予約時間の10分前までに到着されない場合、予約がキャンセルされる可能性があります。',
    },
    {
      title: '人数変更',
      description: '予約人数の変更はできません。新規予約が必要です。',
    },
    {
      title: 'ノーショーペナルティ',
      description: 'ノーショーの場合、今後のサービス利用が制限される可能性があります。',
    }
  ]
};

const REVIEWS = {
  ko: [
    {
      name: '김지현',
      date: '2025.02.15',
      rating: 5,
      comment: '일본어를 못해도 원하는 레스토랑을 예약할 수 있어서 너무 좋았어요! 직원분들도 친절하고 빠른 응대가 인상적이었습니다.',
      restaurant: '스시 미즈타니'
    },
    {
      name: '이서준',
      date: '2025.02.10',
      rating: 5,
      comment: '급하게 예약이 필요했는데 몇 시간 만에 예약을 확정해주셨어요. 정말 편리한 서비스입니다.',
      restaurant: '야키토리 혼포'
    },
    {
      name: '박민지',
      date: '2025.02.05',
      rating: 4,
      comment: '수수료가 조금 있지만 그만한 가치가 있는 서비스예요. 일본 현지 전화번호 없이도 인기 맛집을 예약할 수 있다는 게 큰 장점입니다.',
      restaurant: '라멘 이치란'
    }
  ],
  ja: [
    {
      name: '田中美咲',
      date: '2025.02.15',
      rating: 5,
      comment: '日本語が話せなくても希望のレストランを予約できて、とても良かったです！スタッフの方々も親切で、素早い対応が印象的でした。',
      restaurant: 'すし みずたに'
    },
    {
      name: '山田健一',
      date: '2025.02.10',
      rating: 5,
      comment: '急いで予約が必要だった時、数時間で予約を確定していただきました。本当に便利なサービスです。',
      restaurant: '焼き鳥 本舗'
    },
    {
      name: '佐藤優子',
      date: '2025.02.05',
      rating: 4,
      comment: '手数料は少しかかりますが、それだけの価値のあるサービスです。日本の電話番号がなくても人気店を予約できるのが大きな利点です。',
      restaurant: 'ラーメン一蘭'
    }
  ]
};

const OPTIONS = {
  ko: [
    {
      title: '총 인원 1~4명 (성인, 어린이 포함 이용 인원)',
      price: 1000
    },
    {
      title: '총 인원 5~8명 (성인, 어린이 포함 이용 인원)',
      price: 2000
    },
    {
      title: '총 인원 9~12명 (성인, 어린이 포함 이용 인원)',
      price: 3000
    }
  ],
  ja: [
    {
      title: '合計人数1～4名（大人、子供含めたご利用人数）',
      price: 1000
    },
    {
      title: '合計人数5～8名（大人、子供含めたご利用人数）',
      price: 2000
    },
    {
      title: '合計人数9～12名（大人、子供含めたご利用人数）',
      price: 3000
    }
  ]
};

export default function LandingPage({ language, onLanguageChange }: LandingPageProps) {
  const navigate = useNavigate();

  const goToServiceIntroduction = () => navigate('/service-introduction');
  const goToOptions = () => navigate('/options');
  const goToCautions = () => navigate('/cautions');
  const goToStoreInfo = () => navigate('/store-info');
  const goToReviews = () => navigate('/reviews');
  const goToSearch = () => navigate('/search');
  const goToStores = () => navigate('/stores');

  useEffect(() => {
    renderCanvas();
  }, []);

  const NAV_ITEMS = getCommonNavItems(language, {
    goToServiceIntroduction,
    goToOptions,
    goToCautions,
    goToStoreInfo,
    goToReviews
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Canvas Animation */}
      <canvas
        className="fixed inset-0 pointer-events-none"
        id="canvas"
      ></canvas>

      {/* Header - ナビゲーションバーを一番上に固定 */}
      <TubelightNavbar items={NAV_ITEMS} language={language} onLanguageChange={onLanguageChange} />

      {/* ヘッダーの高さ分のスペース確保 */}
      <div className="h-16 md:h-16"></div>

      {/* Hero Section - 背景を白に変更 */}
      <section className="bg-white py-24 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-[#FF8C00]">
              {language === 'ko'
                ? '일본 전화번호 없이도\n원하는 맛집 예약 가능!'
                : language === 'ja'
                ? '日本の電話番号がなくても\n行きたいお店を予約可能！'
                : '日本の電話番号がなくても\n行きたいお店を予約可能！'}
            </h1>
            <p className="text-gray-700 text-lg mb-8">
              {language === 'ko'
                ? '일본의 인기 레스토랑은 전화로만 예약이 가능한 경우가 많습니다.\nIRUTOMO가 여러분의 맛있는 여행을 도와드립니다.'
                : language === 'ja'
                ? '日本の人気店は電話予約のみの場合が多いです。\nIRUTOMOがあなたの美味しい旅をサポートします。'
                : '일본의 인기 레스토랑은 전화로만 예약이 가능한 경우가 많습니다.\nIRUTOMO가 여러분의 맛있는 여행을 도와드립니다.'}
            </p>
            <ParticleButton
              onClick={goToSearch}
              size="lg"
              className="font-bold text-lg"
            >
              {language === 'ko' ? '지금 예약하기' : language === 'ja' ? '今すぐ予約' : 'Book Now'}
            </ParticleButton>
          </div>

          {/* Food Image Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {FOOD_IMAGES.map((image, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-square"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="service" className="py-20 bg-white backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'ko' ? '서비스 특징' : language === 'ja' ? 'サービスの特徴' : 'Service Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-[#FF8C00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '전화 예약 대행' : language === 'ja' ? '電話予約代行' : '電話予約代行'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '일본 전화번호가 없어도 예약 가능'
                  : language === 'ja'
                  ? '日本の電話番号がなくても予約可能'
                  : '일본 전화번호가 없어도 예약 가능'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-[#FF8C00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '한국어 지원' : language === 'ja' ? '韓国語サポート' : '한국어 지원'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '모든 서비스를 한국어로 이용'
                  : language === 'ja'
                  ? 'すべてのサービスを韓国語で利用'
                  : '모든 서비스를 한국어로 이용'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-[#FF8C00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '빠른 예약' : language === 'ja' ? '迅速な予約' : '빠른 예약'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '24시간 이내 예약 확정'
                  : language === 'ja'
                  ? '24時間以内に予約確定'
                  : '24시간 이내 예약 확정'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="bg-[#FF8C00]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '합리적인 가격' : language === 'ja' ? 'リーズナブルな価格' : '합리적인 가격'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '예약 건당 1000엔'
                  : language === 'ja'
                  ? '予約1件につき1000円'
                  : '예약 건당 1000엔'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'ko' ? '이용 방법' : language === 'ja' ? 'ご利用方法' : '이용 방법'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-[#FF8C00] text-4xl font-bold mb-4">01</div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '맛집 선택' : language === 'ja' ? 'お店を選択' : '맛집 선택'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '추천 맛집 중에서 선택하거나 원하는 맛집을 요청하세요'
                  : language === 'ja'
                  ? 'おすすめ店から選ぶか、希望のお店をリクエスト'
                  : '추천 맛집 중에서 선택하거나 원하는 맛집을 요청하세요'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-[#FF8C00] text-4xl font-bold mb-4">02</div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '예약 정보 입력' : language === 'ja' ? '予約情報入力' : '예약 정보 입력'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '날짜, 시간, 인원수를 입력하고 예약을 요청하세요'
                  : language === 'ja'
                  ? '日付、時間、人数を入力して予約をリクエスト'
                  : '날짜, 시간, 인원수를 입력하고 예약을 요청하세요'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-[#FF8C00] text-4xl font-bold mb-4">03</div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '수수료 결제' : language === 'ja' ? '手数料のお支払い' : '수수료 결제'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '1000엔의 예약 수수료를 결제해주세요'
                  : language === 'ja'
                  ? '1000円の予約手数料をお支払い'
                  : '1000엔의 예약 수수료를 결제해주세요'}
              </p>
            </div>
            <div className="text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-[#FF8C00] text-4xl font-bold mb-4">04</div>
              <h3 className="font-semibold mb-2">
                {language === 'ko' ? '예약 확정' : language === 'ja' ? '予約確定' : '예약 확정'}
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'ko'
                  ? '24시간 이내에 이메일로 예약 확정을 알려드립니다'
                  : language === 'ja'
                  ? '24時間以内にメールで予約確定をお知らせ'
                  : '24시간 이내에 이메일로 예약 확정을 알려드립니다'}
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <ParticleButton
              onClick={goToSearch}
              size="lg"
              className="font-bold text-lg"
            >
              {language === 'ko' ? '지금 예약하기' : language === 'ja' ? '今すぐ予約' : '지금 예약하기'}
            </ParticleButton>
          </div>
        </div>
      </section>

      {/* Options Section */}
      <section id="options" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'ko' ? '추가 옵션' : language === 'ja' ? '追加オプション' : '추가 옵션'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {OPTIONS[language].map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{option.title}</h3>
                    <p className="text-[#FF8C00] font-semibold">
                      ¥{option.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8 text-gray-600">
            {language === 'ko'
              ? '* 옵션은 예약 시 추가할 수 있습니다'
              : language === 'ja'
              ? '* オプションは予約時に追加できます'
              : '* 옵션은 예약 시 추가할 수 있습니다'}
          </div>
        </div>
      </section>

      {/* Caution Section */}
      <section id="caution" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'ko' ? '주의사항' : language === 'ja' ? '注意事項' : '주의사항'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CAUTION_ITEMS[language].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF8C00]/10 p-3 rounded-full">
                    <XCircle className="w-6 h-6 text-[#FF8C00]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            {language === 'ko' ? '이용후기' : language === 'ja' ? 'レビュー' : '이용후기'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REVIEWS[language].map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{review.name}</h3>
                    <p className="text-gray-500 text-sm">{review.date}</p>
                  </div>
                  <div className="flex items-center">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#FF8C00] fill-current"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Store className="w-4 h-4 mr-2" />
                  {review.restaurant}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <ParticleButton
              onClick={goToSearch}
              size="lg"
              className="font-bold text-lg"
            >
              {language === 'ko' ? '지금 예약하기' : language === 'ja' ? '今すぐ予約' : '지금 예약하기'}
            </ParticleButton>
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <h2 className="text-2xl font-bold mb-8">
              {language === 'ko' ? '가격 안내' : language === 'ja' ? '料金案内' : '가격 안내'}
            </h2>
            <div className="bg-white rounded-lg shadow-lg p-8 transform hover:scale-105 transition-all duration-300">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="line-through text-gray-400 text-2xl">¥11,000</span>
                <span className="text-[#FF8C00] font-bold text-4xl">¥1,000</span>
              </div>
              <p className="text-gray-600 mb-8">
                {language === 'ko' ? '예약 1건당 수수료' : language === 'ja' ? '予約1件につき手数料' : '예약 1건당 수수료'}
              </p>
              <ParticleButton
                onClick={goToSearch}
                size="lg"
                className="w-full font-bold text-lg py-6"
              >
                {language === 'ko' ? '예약하기' : language === 'ja' ? '予約する' : '예약하기'}
              </ParticleButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-600 text-sm">
            © 2025 IRUTOMO. {language === 'ko' ? '모든 권리 보유.' : language === 'ja' ? '全ての権利を保有。' : '모든 권리 보유.'}
          </p>
        </div>
      </footer>

      {/* New section after reviews */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white py-20"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">
            {language === 'ko' ? '지금 바로 예약하세요' : language === 'ja' ? '今すぐ予約しよう' : 'Book Now'}
          </h2>
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={goToSearch}
              className="px-8 py-3 bg-[#ff8b00] text-white font-medium rounded-lg hover:bg-[#e67e00] transition-colors"
            >
              {language === 'ko' ? '레스토랑 예약하기' : language === 'ja' ? 'レストラン予約する' : 'Reserve a Restaurant'}
            </button>
            <button
              onClick={goToStores}
              className="px-8 py-3 bg-white text-[#ff8b00] font-medium rounded-lg border border-[#ff8b00] hover:bg-[#fff8f0] transition-colors"
            >
              {language === 'ko' ? '제휴 점포 목록 보기' : language === 'ja' ? '提携店舗リストを見る' : 'View Partner Stores'}
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}