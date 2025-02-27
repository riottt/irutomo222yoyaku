import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Restaurant } from './types/supabase';
import DirectRequestModal from './components/DirectRequestModal';

// Restaurant type images based on cuisine
const CUISINE_IMAGES = {
  '스시': [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    'https://images.unsplash.com/photo-1553621042-f6e147245754',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252'
  ],
  '라멘': [
    'https://images.unsplash.com/photo-1557872943-16a5ac26437e',
    'https://images.unsplash.com/photo-1591814468924-caf88d1232e1',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
  ],
  '야키토리': [
    'https://images.unsplash.com/photo-1519690889869-e705e59f72e1',
    'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab',
    'https://images.unsplash.com/photo-1511689660979-10d2b1aada49'
  ],
  '덴푸라': [
    'https://images.unsplash.com/photo-1581184953963-d15972933db1',
    'https://images.unsplash.com/photo-1615361200141-f45040f367be',
    'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f'
  ],
  '우동': [
    'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3',
    'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624'
  ],
  default: [
    'https://images.unsplash.com/photo-1554502078-ef0fc409efce',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
    'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de'
  ]
};

interface RestaurantSearchProps {
  language: 'ko' | 'ja' | 'en';
  onSelectRestaurant: (restaurantId: string) => void;
}

export default function RestaurantSearch({ language, onSelectRestaurant }: RestaurantSearchProps) {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDirectRequestModalOpen, setIsDirectRequestModalOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 12;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      console.log('レストラン情報取得開始...');
      
      // まず接続テストを実行
      const testResult = await supabase.from('restaurants').select('id').limit(1);
      if (testResult.error) {
        console.error('接続テストエラー:', testResult.error);
        throw new Error(`接続テストエラー: ${testResult.error.message}`);
      }
      
      console.log('接続テスト成功。全レストラン情報を取得します...');
      
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('rating', { ascending: false });

      if (error) {
        console.error('レストラン情報取得エラー:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.warn('レストランデータが取得できませんでした（空のデータセット）');
      } else {
        console.log(`${data.length}件のレストラン情報を取得しました`);
      }
      
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      // ユーザーフレンドリーなエラーメッセージ
      alert(language === 'ko' 
        ? '데이터 로딩 중 오류가 발생했습니다. 다시 시도해 주세요.' 
        : language === 'ja' 
        ? 'データの読み込み中にエラーが発生しました。再度お試しください。' 
        : 'Error loading data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomImage = (cuisine: string | null) => {
    const images = CUISINE_IMAGES[cuisine as keyof typeof CUISINE_IMAGES] || CUISINE_IMAGES.default;
    return images[Math.floor(Math.random() * images.length)];
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (restaurant.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (restaurant.cuisine?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const paginatedRestaurants = filteredRestaurants.slice(
    (currentPage - 1) * restaurantsPerPage,
    currentPage * restaurantsPerPage
  );

  const totalPages = Math.ceil(filteredRestaurants.length / restaurantsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(`${address}, Osaka, Japan`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleSelectRestaurant = (restaurantId: string) => {
    // Call the provided onSelectRestaurant function
    onSelectRestaurant(restaurantId);
    
    // Navigate to the restaurant details page
    navigate(`/restaurant-details/${restaurantId}`);
  };

  return (
    <div className="bg-white">
      {/* Search Section */}
      <section className="py-8 bg-gray-50 sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1">
              <input
                type="text"
                placeholder={language === 'ko' ? '오사카 맛집 검색' : language === 'ja' ? '大阪のグルメを検索' : 'Search Osaka restaurants'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg hover:brightness-110 transition-all"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </section>

      {/* Restaurant List */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={restaurant.image_url || getRandomImage(restaurant.cuisine)}
                      alt={restaurant.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-semibold">
                          {restaurant.name}
                        </h3>
                        {restaurant.rating && (
                          <div className="flex items-center bg-[#FF8C00] text-white px-2 py-1 rounded">
                            <Star className="w-4 h-4 mr-1" />
                            <span>{restaurant.rating}</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {restaurant.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => openGoogleMaps(restaurant.address)}
                          className="flex items-center text-[#FF8C00] hover:text-orange-600 transition-colors"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {language === 'ko' ? '지도에서 보기' : language === 'ja' ? '地図で見る' : 'View on Map'}
                        </button>
                        <button
                          onClick={() => handleSelectRestaurant(restaurant.id.toString())}
                          className="px-4 py-2 bg-[#FF8C00] text-white rounded hover:brightness-110 transition-all"
                        >
                          {language === 'ko' ? '선택' : language === 'ja' ? '選択' : 'Select'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded ${
                        currentPage === page
                          ? 'bg-[#FF8C00] text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Custom Request CTA */}
          <div className="mt-8 text-center">
            <button
              onClick={() => setIsDirectRequestModalOpen(true)}
              className="px-6 py-3 bg-[#FF8C00] text-white rounded-lg hover:brightness-110 transition-all"
            >
              {language === 'ko' ? '직접 요청하기' : language === 'ja' ? '直接リクエスト' : 'Direct Request'}
            </button>
          </div>
        </div>
      </section>

      {/* DirectRequestModal */}
      <DirectRequestModal
        isOpen={isDirectRequestModalOpen}
        onClose={() => setIsDirectRequestModalOpen(false)}
        language={language}
      />
    </div>
  );
}