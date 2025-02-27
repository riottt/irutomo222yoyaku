import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types/supabase';
import PaymentModal from './PaymentModal';

interface ReservationInputProps {
  restaurantId: string;
  language: 'ko' | 'ja';
  onBack: () => void;
}

export default function ReservationInput({ restaurantId, language, onBack }: ReservationInputProps) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    const maxDate = new Date('2025-05-22');
    const selectedDate = new Date(date);

    if (!date) {
      newErrors.date = language === 'ko' ? '날짜를 선택해주세요' : '日付を選択してください';
    } else if (selectedDate < today || selectedDate > maxDate) {
      newErrors.date = language === 'ko' 
        ? '2025-02-22부터 2025-05-22 사이의 날짜를 선택해주세요' 
        : '2025-02-22から2025-05-22の間の日付を選択してください';
    }

    if (!time) {
      newErrors.time = language === 'ko' ? '시간을 선택해주세요' : '時間を選択してください';
    }

    if (!partySize) {
      newErrors.partySize = language === 'ko' ? '인원을 선택해주세요' : '人数を選択してください';
    }

    if (!email) {
      newErrors.email = language === 'ko' ? '이메일을 입력해주세요' : 'メールアドレスを入力してください';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = language === 'ko' 
        ? '유효한 이메일을 입력해주세요' 
        : '有効なメールアドレスを入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;
    setShowPaymentModal(true);
  };

  const handlePaymentComplete = async () => {
    setIsSubmitting(true);
    try {
      // Guest reservation (no authentication required)
      // Generate a unique reservation ID
      const reservationDate = new Date(`${date}T${time}`);
      const { data, error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          restaurant_id: restaurantId,
          reservation_date: date,
          reservation_time: time,
          party_size: parseInt(partySize),
          name: email.split('@')[0], // Use part of email as name for simplicity
          email: email,
          status: 'pending',
          payment_status: 'completed',
          payment_amount: 1000
        }])
        .select();

      if (reservationError) throw reservationError;

      // Send to confirmation page with reservation ID
      if (data && data.length > 0) {
        const reservationId = data[0].id;
        // Navigate to success page with reservation ID
        navigate(`/reservation-success/${reservationId}`);
      } else {
        throw new Error('No reservation data returned');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(language === 'ko'
        ? '예약 중 오류가 발생했습니다. 다시 시도해주세요.'
        : '予約中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">
          {language === 'ko' 
            ? '레스토랑 정보를 찾을 수 없습니다' 
            : 'レストラン情報が見つかりません'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Restaurant Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-[#FF8C00] mb-2">{restaurant.name}</h2>
          <p className="text-gray-600 mb-2">{restaurant.address}</p>
          {restaurant.cuisine && (
            <span className="inline-block bg-[#FF8C00] text-white text-sm px-3 py-1 rounded-full">
              {restaurant.cuisine}
            </span>
          )}
        </div>

        {/* Reservation Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {language === 'ko' ? '예약 날짜' : '予約日'}
                </div>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date('2025-05-22').toISOString().split('T')[0]}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.date 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">{errors.date}</p>
              )}
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {language === 'ko' ? '예약 시간' : '予約時間'}
                </div>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.time 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
              >
                <option value="">{language === 'ko' ? '시간 선택' : '時間を選択'}</option>
                {Array.from({ length: 14 }, (_, i) => i + 11).map((hour) => (
                  <option key={hour} value={`${hour}:00`}>
                    {hour}:00
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="mt-1 text-sm text-red-600">{errors.time}</p>
              )}
            </div>

            {/* Party Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {language === 'ko' ? '인원 수' : '人数'}
                </div>
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.partySize 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((size) => (
                  <option key={size} value={size}>
                    {size} {language === 'ko' ? '명' : '名'}
                  </option>
                ))}
              </select>
              {errors.partySize && (
                <p className="mt-1 text-sm text-red-600">{errors.partySize}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {language === 'ko' ? '연락처 이메일' : '連絡先メール'}
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ko' ? '예: user@example.com' : '例: user@example.com'}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.email 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF8C00] text-white py-4 rounded-lg text-lg font-bold 
                hover:brightness-110 transform hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'ko' ? '처리중...' : '処理中...'}
                </span>
              ) : (
                language === 'ko' ? '예약하기' : '予約する'
              )}
            </button>
            <p className="text-center text-gray-500 text-sm mt-4">
              {language === 'ko' 
                ? '1회 예약당 1000엔 수수료 부과됩니다' 
                : '1回の予約につき1000円の手数料が発生します'}
            </p>
          </div>
        </form>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onComplete={handlePaymentComplete}
        amount={1000}
        language={language}
      />
    </div>
  );
}