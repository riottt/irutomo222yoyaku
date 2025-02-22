import React, { useState } from 'react';
import { X, Calendar, Clock, Users, Mail, MapPin, AlertCircle, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { ParticleButton } from './ui/particle-button';
import PaymentModal from './PaymentModal';

interface DirectRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ko' | 'ja';
}

export default function DirectRequestModal({ isOpen, onClose, language }: DirectRequestModalProps) {
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantUrl, setRestaurantUrl] = useState('');
  const [address, setAddress] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [email, setEmail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const today = new Date();
    const maxDate = new Date('2025-05-22');
    const selectedDate = new Date(date);

    if (!restaurantName) {
      newErrors.restaurantName = language === 'ko' 
        ? '레스토랑 이름을 입력해주세요' 
        : 'レストラン名を入力してください';
    }

    if (restaurantUrl && !restaurantUrl.startsWith('http')) {
      newErrors.restaurantUrl = language === 'ko'
        ? '올바른 URL을 입력해주세요'
        : '正しいURLを入力してください';
    }

    if (!date) {
      newErrors.date = language === 'ko' 
        ? '날짜를 선택해주세요' 
        : '日付を選択してください';
    } else if (selectedDate < today || selectedDate > maxDate) {
      newErrors.date = language === 'ko'
        ? '2025-02-22부터 2025-05-22 사이의 날짜를 선택해주세요'
        : '2025-02-22から2025-05-22の間の日付を選択してください';
    }

    if (!time) {
      newErrors.time = language === 'ko' 
        ? '시간을 선택해주세요' 
        : '時間を選択してください';
    }

    if (!email) {
      newErrors.email = language === 'ko' 
        ? '이메일을 입력해주세요' 
        : 'メールアドレスを入力してください';
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
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Create a new restaurant entry
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([{
          name: restaurantName,
          address: address || null,
          location: 'Osaka',
          description: additionalNotes || null,
          url: restaurantUrl || null
        }])
        .select()
        .single();

      if (restaurantError) throw restaurantError;

      // Create the reservation
      const reservationDate = new Date(`${date}T${time}`);
      const { error: reservationError } = await supabase
        .from('reservations')
        .insert([{
          user_id: user.id,
          restaurant_id: restaurantData.id,
          reservation_date: reservationDate.toISOString(),
          party_size: parseInt(partySize),
          status: 'pending',
          payment_status: 'completed',
          payment_amount: 1000
        }]);

      if (reservationError) throw reservationError;

      // Simulate email sending
      console.log('Sending confirmation email to:', email);
      
      alert(language === 'ko'
        ? '예약이 완료되었습니다!\n\n예약 확인 메일이 발송되었습니다.\n담당자가 확인 후 24시간 이내에 연락드리겠습니다.'
        : '予約が完了しました！\n\n予約確認メールを送信しました。\n担当者が確認後、24時間以内にご連絡いたします。');

      onClose();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#FF8C00]">
            {language === 'ko' ? '직접 요청하기' : '直接リクエスト'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Restaurant Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {language === 'ko' ? '레스토랑 이름' : 'レストラン名'}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.restaurantName
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
                placeholder={language === 'ko' ? '방문하고 싶은 레스토랑 이름' : '訪れたいレストランの名前'}
              />
              {errors.restaurantName && (
                <p className="mt-1 text-sm text-red-600">{errors.restaurantName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  {language === 'ko' ? '레스토랑 URL' : 'レストランURL'}
                  <span className="text-gray-500 text-sm ml-1">
                    ({language === 'ko' ? '선택사항' : '任意'})
                  </span>
                </div>
              </label>
              <input
                type="url"
                value={restaurantUrl}
                onChange={(e) => setRestaurantUrl(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.restaurantUrl
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
                placeholder={language === 'ko' 
                  ? '예: https://www.restaurant.com' 
                  : '例: https://www.restaurant.com'}
              />
              {errors.restaurantUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.restaurantUrl}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {language === 'ko' ? '주소' : '住所'}
                  <span className="text-gray-500 text-sm ml-1">
                    ({language === 'ko' ? '선택사항' : '任意'})
                  </span>
                </div>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-opacity-50"
                placeholder={language === 'ko' 
                  ? '오사카시 ○○구 ○○정 1-2-3' 
                  : '大阪市○○区○○町1-2-3'}
              />
            </div>
          </div>

          {/* Reservation Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {language === 'ko' ? '예약 날짜' : '予約日'}
                  <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {language === 'ko' ? '예약 시간' : '予約時間'}
                  <span className="text-red-500">*</span>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {language === 'ko' ? '인원 수' : '人数'}
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <select
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-opacity-50"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((size) => (
                  <option key={size} value={size}>
                    {size} {language === 'ko' ? '명' : '名'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {language === 'ko' ? '연락처 이메일' : '連絡先メール'}
                  <span className="text-red-500">*</span>
                </div>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`mt-1 block w-full rounded-md shadow-sm transition-colors
                  ${errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-[#FF8C00] focus:ring-[#FF8C00]'}`}
                placeholder={language === 'ko' ? '예: user@example.com' : '例: user@example.com'}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ko' ? '추가 요청사항' : '追加リクエスト'}
              <span className="text-gray-500 text-sm ml-1">
                ({language === 'ko' ? '선택사항' : '任意'})
              </span>
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00] focus:ring-opacity-50"
              placeholder={language === 'ko'
                ? '특별한 요청사항이 있다면 입력해주세요'
                : '特別なリクエストがありましたら、入力してください'}
            />
          </div>

          {/* Warning */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-[#FF8C00] mt-0.5 mr-3" />
              <p className="text-sm text-gray-600">
                {language === 'ko'
                  ? '예약 확정 후 취소는 불가능하며, 수수료는 환불되지 않습니다.'
                  : '予約確定後のキャンセルはできず、手数料は返金されません。'}
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <ParticleButton
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full font-bold text-lg py-6"
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
            </ParticleButton>
            <p className="text-center text-gray-500 text-sm mt-4">
              {language === 'ko'
                ? '1회 예약당 1000엔 수수료 부과됩니다'
                : '1回の予約につき1000円の手数料が発生します'}
            </p>
          </div>
        </form>
      </motion.div>

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