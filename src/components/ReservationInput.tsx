import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Mail, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Restaurant } from '../types/supabase';
import PaymentModal from './PaymentModal';
import PaymentPlans from './PaymentPlans';

interface ReservationInputProps {
  restaurantId: string;
  language: 'ko' | 'ja' | 'en';
  onBack: () => void;
  onComplete?: (reservationId: string) => void;
}

// 人数に基づいて金額を計算する関数
const calculateAmount = (partySize: number): number => {
  if (partySize >= 1 && partySize <= 4) {
    return 1000;
  } else if (partySize >= 5 && partySize <= 8) {
    return 2000;
  } else if (partySize >= 9 && partySize <= 12) {
    return 3000;
  } else {
    return 1000; // デフォルト値
  }
};

export default function ReservationInput({ restaurantId, language, onBack, onComplete }: ReservationInputProps) {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(1000);
  const [selectedPlanName, setSelectedPlanName] = useState('');

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  // 人数が変更されたときに金額を更新
  useEffect(() => {
    const size = parseInt(partySize, 10);
    const amount = calculateAmount(size);
    setPaymentAmount(amount);
  }, [partySize]);

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
        : language === 'ja'
        ? 'レストラン情報の読み込み中にエラーが発生しました'
        : 'Error loading restaurant information');
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
      newErrors.date = language === 'ko' 
        ? '날짜를 선택해주세요' 
        : language === 'ja'
        ? '日付を選択してください'
        : 'Please select a date';
    } else if (selectedDate < today || selectedDate > maxDate) {
      newErrors.date = language === 'ko' 
        ? '2025-02-22부터 2025-05-22 사이의 날짜를 선택해주세요' 
        : language === 'ja'
        ? '2025-02-22から2025-05-22の間の日付を選択してください'
        : 'Please select a date between 2025-02-22 and 2025-05-22';
    }

    if (!time) {
      newErrors.time = language === 'ko' 
        ? '시간을 선택해주세요' 
        : language === 'ja'
        ? '時間を選択してください'
        : 'Please select a time';
    }

    if (!partySize) {
      newErrors.partySize = language === 'ko' 
        ? '인원을 선택해주세요' 
        : language === 'ja'
        ? '人数を選択してください'
        : 'Please select the number of people';
    }

    if (!name) {
      newErrors.name = language === 'ko' 
        ? '이름을 입력해주세요' 
        : language === 'ja'
        ? 'お名前を入力してください'
        : 'Please enter your name';
    }

    if (!phone) {
      newErrors.phone = language === 'ko' 
        ? '전화번호를 입력해주세요' 
        : language === 'ja'
        ? '電話番号を入力してください'
        : 'Please enter your phone number';
    }

    if (!email) {
      newErrors.email = language === 'ko' 
        ? '이메일을 입력해주세요' 
        : language === 'ja'
        ? 'メールアドレスを入力してください'
        : 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = language === 'ko' 
        ? '유효한 이메일을 입력해주세요' 
        : language === 'ja'
        ? '有効なメールアドレスを入力してください'
        : 'Please enter a valid email address';
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
          name: name,
          email: email,
          phone: phone,
          special_requests: '',
          status: 'pending',
          payment_status: 'completed',
          payment_amount: paymentAmount
        }])
        .select();

      if (reservationError) throw reservationError;

      // Send to confirmation page with reservation ID
      if (data && data.length > 0) {
        const reservationId = data[0].id;
        // onCompleteが提供されている場合はそれを使用し、そうでなければnavigate
        if (onComplete) {
          onComplete(reservationId);
        } else {
          // Navigate to success page with reservation ID
          navigate(`/reservation-success/${reservationId}`);
        }
      } else {
        throw new Error('No reservation data returned');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert(language === 'ko' 
        ? '예약 중 오류가 발생했습니다. 다시 시도해주세요.'
        : language === 'ja'
        ? '予約中にエラーが発生しました。もう一度お試しください。'
        : 'Error during reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
      setShowPaymentModal(false);
    }
  };

  // プラン選択時の処理
  const handlePlanSelect = (amount: number, planName?: string) => {
    console.log(`予約画面でプラン選択: 金額=${amount}, プラン名=${planName || '未指定'}`);
    setPaymentAmount(amount);
    if (planName) {
      setSelectedPlanName(planName);
    }
  };

  // PayPalボタン表示前の処理
  const handleMakeReservation = () => {
    if (validateForm()) {
      console.log(`予約作成: 金額=${paymentAmount}, プラン=${selectedPlanName || 'デフォルト'}`);
      // 明示的に料金を確認
      const size = parseInt(partySize, 10);
      const amount = calculateAmount(size);
      if (amount !== paymentAmount && selectedPlanName) {
        console.log(`料金の不一致を検出: 計算=${amount}, 選択プラン=${paymentAmount}`);
      }
      setShowPaymentModal(true);
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
            : language === 'ja'
            ? 'レストラン情報が見つかりません'
            : 'Restaurant information not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Restaurant Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#FF8C00]">
          <h2 className="text-2xl font-bold text-[#FF8C00] mb-2">{restaurant.name}</h2>
          <p className="text-gray-600 mb-2">{restaurant.address}</p>
          {restaurant.cuisine && (
            <span className="inline-block bg-[#FF8C00] text-white text-sm px-3 py-1 rounded-full">
              {restaurant.cuisine}
            </span>
          )}
        </div>

        {/* Reservation Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b">
            {language === 'ko' 
              ? '예약 정보 입력' 
              : language === 'ja'
              ? '予約情報の入力'
              : 'Enter Reservation Details'}
          </h3>
          
          <div className="space-y-6">
            {/* Date */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '예약일' : language === 'ja' ? '予約日' : 'Reservation Date'}
                </div>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                min={new Date().toISOString().split('T')[0]}
                aria-label={language === 'ko' ? '예약일 선택' : language === 'ja' ? '予約日を選択' : 'Select reservation date'}
                title={language === 'ko' ? '예약일 선택' : language === 'ja' ? '予約日を選択' : 'Select reservation date'}
                required
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            {/* Time */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '예약 시간' : language === 'ja' ? '予約時間' : 'Reservation Time'}
                </div>
              </label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                aria-label={language === 'ko' ? '예약 시간 선택' : language === 'ja' ? '予約時間を選択' : 'Select reservation time'}
                title={language === 'ko' ? '예약 시간 선택' : language === 'ja' ? '予約時間を選択' : 'Select reservation time'}
                required
              >
                <option value="">
                  {language === 'ko' ? '시간 선택' : language === 'ja' ? '時間を選択' : 'Select time'}
                </option>
                {Array.from({ length: 14 }, (_, i) => i + 10).map((hour) => (
                  <option key={hour} value={`${hour}:00`}>
                    {`${hour}:00`}
                  </option>
                ))}
              </select>
              {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
            </div>

            {/* Party Size */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '인원 수' : language === 'ja' ? '人数' : 'Party Size'}
                </div>
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                aria-label={language === 'ko' ? '인원 수 선택' : language === 'ja' ? '人数を選択' : 'Select party size'}
                title={language === 'ko' ? '인원 수 선택' : language === 'ja' ? '人数を選択' : 'Select party size'}
                required
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((size) => (
                  <option key={size} value={size.toString()}>
                    {size} {language === 'ko' ? '명' : language === 'ja' ? '人' : 'people'}
                  </option>
                ))}
              </select>
              {errors.partySize && <p className="text-red-500 text-sm mt-1">{errors.partySize}</p>}
            </div>

            {/* Name */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '이름' : language === 'ja' ? 'お名前' : 'Name'}
                </div>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={language === 'ko' ? '이름을 입력하세요' : language === 'ja' ? 'お名前を入力してください' : 'Enter your name'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                aria-label={language === 'ko' ? '이름 입력' : language === 'ja' ? 'お名前を入力' : 'Enter your name'}
                title={language === 'ko' ? '이름 입력' : language === 'ja' ? 'お名前を入力' : 'Enter your name'}
                required
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '전화번호' : language === 'ja' ? '電話番号' : 'Phone Number'}
                </div>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={language === 'ko' ? '전화번호를 입력하세요' : language === 'ja' ? '電話番号を入力してください' : 'Enter your phone number'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                aria-label={language === 'ko' ? '전화번호 입력' : language === 'ja' ? '電話番号を入力' : 'Enter your phone number'}
                title={language === 'ko' ? '전화번호 입력' : language === 'ja' ? '電話番号を入力' : 'Enter your phone number'}
                required
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Email */}
            <div className="bg-gray-50 p-4 rounded-lg transition-all hover:bg-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-[#FF8C00] mr-2" />
                  {language === 'ko' ? '이메일' : language === 'ja' ? 'メールアドレス' : 'Email'}
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'ko' ? '이메일을 입력하세요' : language === 'ja' ? 'メールアドレスを入力してください' : 'Enter your email'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                aria-label={language === 'ko' ? '이메일 입력' : language === 'ja' ? 'メールアドレスを入力' : 'Enter your email'}
                title={language === 'ko' ? '이메일 입력' : language === 'ja' ? 'メールアドレスを入力' : 'Enter your email'}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* 料金プラン表示 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-800 mb-4">
                {language === 'ko' 
                  ? '요금 플랜 선택' 
                  : language === 'ja'
                  ? '料金プランの選択'
                  : 'Select Payment Plan'}
              </h4>
              <PaymentPlans 
                partySize={partySize}
                language={language}
                onPlanSelect={handlePlanSelect} 
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#FF8C00] text-white py-4 rounded-lg text-lg font-bold 
                hover:brightness-110 transform hover:scale-[1.02] transition-all disabled:opacity-50
                shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {language === 'ko' ? '처리중...' : language === 'ja' ? '処理中...' : 'Processing...'}
                </span>
              ) : (
                language === 'ko' ? '예약하기' : language === 'ja' ? '予約する' : 'Make Reservation'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onComplete={handlePaymentComplete}
        amount={paymentAmount}
        language={language}
      />
    </div>
  );
}