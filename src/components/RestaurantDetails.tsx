import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, MapPin, ExternalLink, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types/supabase';

interface RestaurantDetailsProps {
  restaurantId: string;
  language: 'ko' | 'ja';
  onBack: () => void;
  onReserve: (restaurantId: string) => void;
}

export default function RestaurantDetails({ restaurantId, language, onBack, onReserve }: RestaurantDetailsProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) throw error;
      setRestaurant(data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      alert(language === 'ko' 
        ? '레스토랑 정보를 불러오는 중 오류가 발생했습니다' 
        : 'レストラン情報の読み込み中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (!restaurant) return;

    // レストランのGoogle Mapsリンクがある場合はそれを使用し、ない場合は住所で検索
    const mapsUrl = restaurant.google_maps_link || 
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${restaurant.name} ${restaurant.address} 大阪`)}`;

    // 新しいタブでGoogleマップを開く
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">
          {language === 'ko' 
            ? '레스토랑 정보를 찾을 수 없습니다' 
            : 'レストラン情報が見つかりません'}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Image */}
      <div className="relative h-64 md:h-96 bg-gray-100">
        <img
          src={restaurant.image_url || 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <button
          onClick={onBack}
          className="absolute top-4 left-4 flex items-center text-white hover:text-[#FF8C00] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-1" />
          {language === 'ko' ? '뒤로' : '戻る'}
        </button>
      </div>

      {/* Restaurant Info */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative -mt-16 mx-4 bg-white rounded-t-3xl shadow-xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'ko' ? restaurant.name : restaurant.japanese_name || restaurant.name}
            </h1>
            {restaurant.cuisine && (
              <span className="inline-block bg-[#FF8C00]/10 text-[#FF8C00] text-sm px-3 py-1 rounded-full">
                {restaurant.cuisine}
              </span>
            )}
          </div>
          {restaurant.rating && (
            <div className="flex items-center bg-[#FF8C00] text-white px-3 py-1 rounded-lg">
              <Star className="w-4 h-4 mr-1" />
              <span className="font-semibold">{restaurant.rating}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">
          {restaurant.description}
        </p>

        <div className="space-y-4 mb-8">
          {/* Google Maps Button */}
          <button
            onClick={openGoogleMaps}
            className="flex items-center text-gray-600 hover:text-[#FF8C00] transition-colors w-full group"
            aria-label={language === 'ko' ? 'Google Maps에서 위치 보기' : 'Google Mapsで場所を確認'}
          >
            <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-left flex-1">{restaurant.address}</span>
            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Operating Hours */}
          {restaurant.operating_hours && (
            <div className="flex items-start text-gray-600">
              <Clock className="w-5 h-5 mr-2 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-medium mb-1">
                  {language === 'ko' ? '영업 시간' : '営業時間'}
                </h3>
                <p className="whitespace-pre-line text-sm">
                  {restaurant.operating_hours}
                </p>
              </div>
            </div>
          )}

          {/* Website Link */}
          {restaurant.url && (
            <a
              href={restaurant.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#FF8C00] hover:text-orange-600 transition-colors group"
              aria-label={language === 'ko' ? '레스토랑 웹사이트 방문' : 'レストランのウェブサイトを訪問'}
            >
              <Globe className="w-5 h-5 mr-2" />
              <span className="flex-1">{language === 'ko' ? '웹사이트 방문하기' : 'ウェブサイトを見る'}</span>
              <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          )}
        </div>

        {/* Reservation Section */}
        <div className="space-y-4">
          <button
            onClick={() => onReserve(restaurant.id)}
            className="w-full bg-[#FF8C00] text-white py-4 rounded-lg text-lg font-bold 
              hover:brightness-110 transform hover:scale-[1.02] transition-all"
          >
            {language === 'ko' ? '예약하기' : '予約する'}
          </button>
          <p className="text-center text-gray-500 text-sm">
            {language === 'ko' 
              ? '1회 예약당 1000엔 수수료 부과됩니다' 
              : '1回の予約につき1000円の手数料が発生します'}
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-12 space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4">
              {language === 'ko' ? '예약 안내' : '予約案内'}
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• {language === 'ko' 
                ? '예약 확정 후 취소는 불가능합니다' 
                : '予約確定後のキャンセルはできません'}</li>
              <li>• {language === 'ko'
                ? '예약 시간 10분 전까지 도착해 주세요'
                : '予約時間の10分前までにお越しください'}</li>
              <li>• {language === 'ko'
                ? '특별 요청사항은 예약 시 기재해 주세요'
                : '特別なご要望は予約時にご記入ください'}</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}