import React from 'react';
import { motion } from 'framer-motion';
import { TubelightNavbar } from '../components/ui/TubelightNavbar';
import { MessageSquare, Star, ThumbsUp, User, Calendar, Bookmark, Search, Info } from 'lucide-react';

interface ReviewsProps {
  language: 'ko' | 'ja' | 'en';
  onLanguageChange: (lang: 'ko' | 'ja' | 'en') => void;
  onBack: () => void;
}

export default function Reviews({ language, onLanguageChange, onBack }: ReviewsProps) {
  const NAV_ITEMS = [
    {
      name: language === 'ko' ? '리뷰' : language === 'ja' ? 'レビュー' : 'Reviews',
      url: '#',
      icon: MessageSquare,
    },
    {
      name: language === 'ko' ? '홈으로 돌아가기' : language === 'ja' ? 'ホームに戻る' : 'Back to Home',
      url: '#',
      icon: Info,
      onClick: onBack,
    },
  ];

  const reviewTitles = {
    ko: {
      title: '방문자 리뷰',
      subtitle: '실제 방문자들의 의견을 확인해보세요',
      searchPlaceholder: '레스토랑 이름, 지역, 요리 종류 검색...',
      filterAll: '전체',
      filterPositive: '긍정적',
      filterNeutral: '중립적',
      filterNegative: '부정적',
      sortRecent: '최신순',
      sortHighest: '평점높은순',
      sortLowest: '평점낮은순',
      reviewCount: '개의 리뷰',
      verified: '인증된 방문',
      seeMore: '더 보기',
      helpful: '도움이 되었나요?',
      helpfulCount: '명이 도움이 되었다고 했습니다',
      writeButton: '리뷰 작성하기',
      featuredReviews: '추천 리뷰',
      allReviews: '모든 리뷰',
      userReviews: '나의 리뷰'
    },
    ja: {
      title: '訪問者レビュー',
      subtitle: '実際の訪問者の意見をご確認ください',
      searchPlaceholder: 'レストラン名、地域、料理の種類で検索...',
      filterAll: 'すべて',
      filterPositive: '肯定的',
      filterNeutral: '中立的',
      filterNegative: '否定的',
      sortRecent: '最新順',
      sortHighest: '評価高い順',
      sortLowest: '評価低い順',
      reviewCount: '件のレビュー',
      verified: '認証済み訪問',
      seeMore: 'もっと見る',
      helpful: '参考になりましたか？',
      helpfulCount: '人が参考になったと言っています',
      writeButton: 'レビューを書く',
      featuredReviews: 'おすすめレビュー',
      allReviews: 'すべてのレビュー',
      userReviews: '自分のレビュー'
    },
    en: {
      title: 'Visitor Reviews',
      subtitle: 'Check out opinions from actual visitors',
      searchPlaceholder: 'Search restaurant name, area, cuisine type...',
      filterAll: 'All',
      filterPositive: 'Positive',
      filterNeutral: 'Neutral',
      filterNegative: 'Negative',
      sortRecent: 'Most Recent',
      sortHighest: 'Highest Rated',
      sortLowest: 'Lowest Rated',
      reviewCount: 'reviews',
      verified: 'Verified Visit',
      seeMore: 'See More',
      helpful: 'Was this helpful?',
      helpfulCount: 'people found this helpful',
      writeButton: 'Write a Review',
      featuredReviews: 'Featured Reviews',
      allReviews: 'All Reviews',
      userReviews: 'My Reviews'
    }
  };

  const reviews = [
    {
      id: 1,
      restaurantName: {
        ko: '스시 미즈타니',
        ja: 'すし みずたに',
        en: 'Sushi Mizutani'
      },
      userName: 'Kim Min-ji',
      userAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      date: '2024-05-15',
      rating: 5,
      isVerified: true,
      content: {
        ko: '오사카 여행 중 최고의 스시 레스토랑이었습니다. 재료가 신선하고 셰프의 솜씨가 훌륭했어요. 특히 오토로와 아나고는 꼭 드셔보세요. 가격은 조금 비싸지만 그만한 가치가 있습니다. 서비스도 친절하고 한국어로 된 메뉴판도 있어서 편리했습니다.',
        ja: '大阪旅行中、最高の寿司レストランでした。素材が新鮮でシェフの腕前が素晴らしかったです。特に大トロと穴子は必ず食べてみてください。価格は少し高いですが、それだけの価値があります。サービスも親切で、韓国語のメニューもあり便利でした。',
        en: 'The best sushi restaurant during my Osaka trip. The ingredients were fresh and the chef\'s skills were excellent. Especially try the otoro and anago. It\'s a bit expensive, but worth it. The service was also friendly, and they had a Korean menu which was convenient.'
      },
      helpfulCount: 28,
      images: [
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500',
        'https://images.unsplash.com/photo-1534482421-64566f76aee7?q=80&w=500'
      ],
      tags: ['オタク', 'ファミリー', '接待'],
      featured: true
    },
    {
      id: 2,
      restaurantName: {
        ko: '야키토리 혼포',
        ja: '焼き鳥 本舗',
        en: 'Yakitori Honpo'
      },
      userName: 'Park Jae-sung',
      userAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      date: '2024-05-10',
      rating: 4,
      isVerified: true,
      content: {
        ko: '우메다 역 근처에 있는 좋은 야키토리 가게입니다. 다양한 부위의 닭꼬치를 맛볼 수 있었고, 특히 쓰쿠네와 하츠가 맛있었습니다. 분위기도 좋고 직원들도 친절했어요. 다만 금요일 저녁에는 조금 붐비니 예약하시는 것을 추천합니다.',
        ja: '梅田駅近くにある良い焼き鳥屋さんです。様々な部位の焼き鳥を味わうことができ、特につくねとハツが美味しかったです。雰囲気も良く、スタッフも親切でした。ただし、金曜日の夜は少し混雑するので、予約することをお勧めします。',
        en: 'A good yakitori place near Umeda Station. I could taste various parts of chicken skewers, especially the tsukune and heart were delicious. The atmosphere was nice and the staff were friendly. However, it gets a bit crowded on Friday evenings, so I recommend making a reservation.'
      },
      helpfulCount: 16,
      images: [
        'https://images.unsplash.com/photo-1519690889869-e705e59f72e1?q=80&w=500'
      ],
      tags: ['カップル', '接待'],
      featured: true
    },
    {
      id: 3,
      restaurantName: {
        ko: '라멘 이치란',
        ja: 'ラーメン一蘭',
        en: 'Ramen Ichiran'
      },
      userName: 'Lee Ji-hye',
      userAvatar: 'https://randomuser.me/api/portraits/women/33.jpg',
      date: '2024-05-03',
      rating: 3,
      isVerified: true,
      content: {
        ko: '유명한 체인점이라 기대를 많이 했는데, 개인적으로는 그저 그랬습니다. 라멘 맛은 괜찮았지만 가격 대비 양이 조금 적은 것 같아요. 개인 칸막이 좌석은 독특한 경험이었습니다. 한번쯤 경험해볼만 하지만 다시 방문할지는 모르겠네요.',
        ja: '有名なチェーン店なので期待していましたが、個人的にはまあまあでした。ラーメンの味は悪くなかったですが、価格の割に量が少ない気がします。個室風カウンター席はユニークな経験でした。一度は経験する価値がありますが、再訪するかどうかは分かりません。',
        en: 'I had high expectations because it\'s a famous chain, but personally, it was just okay. The ramen taste was fine, but the portion seemed a bit small for the price. The private booth seating was a unique experience. It\'s worth experiencing once, but I\'m not sure if I\'ll visit again.'
      },
      helpfulCount: 9,
      images: [],
      tags: ['一人', 'カジュアル'],
      featured: false
    },
    {
      id: 4,
      restaurantName: {
        ko: '교토 카페',
        ja: '京都カフェ',
        en: 'Kyoto Cafe'
      },
      userName: 'Choi Su-jin',
      userAvatar: 'https://randomuser.me/api/portraits/women/56.jpg',
      date: '2024-04-25',
      rating: 5,
      isVerified: true,
      content: {
        ko: '교토에서 가장 좋았던 카페 중 하나입니다. 전통적인 일본 가옥에서 현대적인 카페를 경험할 수 있어요. 말차 라떼와 화과자의 조합이 정말 좋았습니다. 창문 너머로 작은 정원도 보여서 분위기도 최고였어요. 교토를 방문한다면 꼭 들러보세요.',
        ja: '京都で最も良かったカフェの一つです。伝統的な日本家屋で現代的なカフェを体験できます。抹茶ラテと和菓子の組み合わせが本当に良かったです。窓越しに小さな庭園も見えて雰囲気も最高でした。京都を訪れるなら、ぜひ立ち寄ってみてください。',
        en: 'One of the best cafes I visited in Kyoto. You can experience a modern cafe in a traditional Japanese house. The combination of matcha latte and wagashi was really good. The atmosphere was also great with a small garden visible through the window. Definitely stop by if you visit Kyoto.'
      },
      helpfulCount: 24,
      images: [
        'https://images.unsplash.com/photo-1594444406257-89085db8e09c?q=80&w=500',
        'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=500',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=500'
      ],
      tags: ['カフェ', 'インスタ映え', 'カップル'],
      featured: true
    }
  ];

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

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
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">
            {reviewTitles[language].title}
          </h1>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            {reviewTitles[language].subtitle}
          </p>

          {/* Search and filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <div className="flex items-center border rounded-lg overflow-hidden mb-6 focus-within:ring-2 focus-within:ring-[#FF8C00]/50">
              <Search className="ml-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={reviewTitles[language].searchPlaceholder}
                className="flex-1 px-4 py-3 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-[#FF8C00] text-white rounded-full text-sm font-medium">
                  {reviewTitles[language].filterAll}
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
                  {reviewTitles[language].filterPositive}
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
                  {reviewTitles[language].filterNeutral}
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors">
                  {reviewTitles[language].filterNegative}
                </button>
              </div>

              <div className="flex items-center">
                <select className="bg-white border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00]/50">
                  <option>{reviewTitles[language].sortRecent}</option>
                  <option>{reviewTitles[language].sortHighest}</option>
                  <option>{reviewTitles[language].sortLowest}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Reviews */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-[#FF8C00]">
              {reviewTitles[language].featuredReviews}
            </h2>
            
            <div className="space-y-8">
              {reviews
                .filter(review => review.featured)
                .map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-10 h-10 rounded-full mr-3 object-cover"
                        />
                        <div>
                          <div className="font-medium">{review.userName}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(review.date).toLocaleDateString()}
                            {review.isVerified && (
                              <span className="ml-2 flex items-center text-green-600 text-xs">
                                <Bookmark className="w-3 h-3 mr-1" />
                                {reviewTitles[language].verified}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-2">
                      {review.restaurantName[language]}
                    </h3>
                    
                    <p className="text-gray-700 mb-4">
                      {review.content[language]}
                    </p>
                    
                    {review.images.length > 0 && (
                      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                        {review.images.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Review image ${idx+1}`}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        {review.tags.map((tag, idx) => (
                          <span key={idx} className="bg-gray-100 rounded-full px-3 py-1">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <button className="flex items-center hover:text-[#FF8C00] transition-colors mr-2">
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {reviewTitles[language].helpful}
                        </button>
                        <span className="text-xs">
                          {review.helpfulCount} {reviewTitles[language].helpfulCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* All Reviews (Sample) */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-[#FF8C00]">
                {reviewTitles[language].allReviews}
              </h2>
              <p className="text-gray-500">
                {reviews.length} {reviewTitles[language].reviewCount}
              </p>
            </div>
            
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-lg border border-gray-200 p-5"
                >
                  <div className="flex items-center mb-3">
                    <img
                      src={review.userAvatar}
                      alt={review.userName}
                      className="w-8 h-8 rounded-full mr-3 object-cover"
                    />
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="ml-auto">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  
                  <h3 className="font-medium mb-2">
                    {review.restaurantName[language]}
                  </h3>
                  
                  <p className="text-gray-700 text-sm mb-3">
                    {review.content[language].length > 150 
                      ? `${review.content[language].substring(0, 150)}...` 
                      : review.content[language]}
                  </p>
                  
                  {review.content[language].length > 150 && (
                    <button className="text-[#FF8C00] text-sm hover:underline">
                      {reviewTitles[language].seeMore}
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <button className="bg-white border border-[#FF8C00] text-[#FF8C00] hover:bg-[#FF8C00] hover:text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                {reviewTitles[language].writeButton}
              </button>
            </div>
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