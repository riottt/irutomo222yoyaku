import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Star, ExternalLink, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types/supabase';
import { TubelightNavbar } from './ui/TubelightNavbar';
import { LanguageToggle } from './ui/LanguageToggle';

interface StoreListProps {
  language: 'ko' | 'ja';
  onBack: () => void;
  onLanguageToggle: () => void;
}

export default function StoreList({ language, onBack, onLanguageToggle }: StoreListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Restaurant;
    direction: 'asc' | 'desc';
  } | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('name');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      alert(language === 'ko' 
        ? '데이터 로딩 중 오류가 발생했습니다' 
        : 'データの読み込み中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const openGoogleMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(`${address}, Osaka, Japan`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleSort = (key: keyof Restaurant) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedRestaurants = React.useMemo(() => {
    let result = [...restaurants];
    
    // Filter
    if (searchTerm) {
      result = result.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (restaurant.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (restaurant.cuisine?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] === null) return 1;
        if (b[sortConfig.key] === null) return -1;
        if (a[sortConfig.key]! < b[sortConfig.key]!) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key]! > b[sortConfig.key]!) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [restaurants, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-[#FF8C00] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                {language === 'ko' ? '뒤로' : '戻る'}
              </button>
            </div>
            <h1 className="text-xl font-bold text-[#FF8C00]">
              {language === 'ko' ? '점포 정보' : '店舗情報'}
            </h1>
            <LanguageToggle
              language={language}
              onToggle={onLanguageToggle}
              className="relative"
            />
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={language === 'ko' ? '검색어를 입력하세요' : '検索ワードを入力'}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
              />
            </div>
            <div className="text-sm text-gray-500">
              {language === 'ko'
                ? `총 ${filteredAndSortedRestaurants.length}개의 점포`
                : `全${filteredAndSortedRestaurants.length}店舗`}
            </div>
          </div>
        </div>
      </section>

      {/* Table Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-[#FF8C00]"
                    >
                      {language === 'ko' ? '점포명' : '店舗名'}
                      {sortConfig?.key === 'name' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th
                      onClick={() => handleSort('cuisine')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-[#FF8C00]"
                    >
                      {language === 'ko' ? '종류' : 'ジャンル'}
                      {sortConfig?.key === 'cuisine' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      {language === 'ko' ? '주소' : '住所'}
                    </th>
                    <th
                      onClick={() => handleSort('rating')}
                      className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:text-[#FF8C00]"
                    >
                      {language === 'ko' ? '평점' : '評価'}
                      {sortConfig?.key === 'rating' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                      {language === 'ko' ? '링크' : 'リンク'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSortedRestaurants.map((restaurant) => (
                    <tr
                      key={restaurant.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {restaurant.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {restaurant.cuisine && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FF8C00]/10 text-[#FF8C00]">
                            {restaurant.cuisine}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openGoogleMaps(restaurant.address)}
                          className="flex items-center text-gray-600 hover:text-[#FF8C00]"
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          {restaurant.address}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        {restaurant.rating && (
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-[#FF8C00] fill-current mr-1" />
                            <span>{restaurant.rating}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {restaurant.url ? (
                            <a
                              href={restaurant.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF8C00] hover:text-orange-600 flex items-center gap-1"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span className="text-sm">
                                {language === 'ko' ? '웹사이트' : 'ウェブサイト'}
                              </span>
                            </a>
                          ) : (
                            <span className="text-gray-400 flex items-center gap-1">
                              <Info className="w-4 h-4" />
                              <span className="text-sm">
                                {language === 'ko' ? '정보 없음' : '情報なし'}
                              </span>
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}