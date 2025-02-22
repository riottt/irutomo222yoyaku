import React, { useState } from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';
import type { Restaurant } from '../types/supabase';
import { createReservation } from '../lib/supabase';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  restaurant: Restaurant;
  language: 'ko' | 'ja';
  userId: string;
}

export default function ReservationModal({ isOpen, onClose, restaurant, language, userId }: ReservationModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const reservationDate = new Date(`${date}T${time}`);
      await createReservation(userId, restaurant.id, reservationDate, partySize);
      alert(language === 'ko' 
        ? '예약이 완료되었습니다. 담당자가 확인 후 연락드리겠습니다.' 
        : '予約が完了しました。担当者が確認後、ご連絡いたします。');
      onClose();
    } catch (err) {
      console.error('Reservation error:', err);
      setError(language === 'ko' 
        ? '예약 중 오류가 발생했습니다. 다시 시도해주세요.' 
        : '予約中にエラーが発生しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {language === 'ko' ? '예약하기' : '予約する'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-lg">{restaurant.name}</h4>
          <p className="text-gray-600">{restaurant.address}</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {language === 'ko' ? '날짜' : '日付'}
              </div>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring focus:ring-[#FF8C00] focus:ring-opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {language === 'ko' ? '시간' : '時間'}
              </div>
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring focus:ring-[#FF8C00] focus:ring-opacity-50"
              required
            >
              <option value="">{language === 'ko' ? '시간 선택' : '時間を選択'}</option>
              {Array.from({ length: 14 }, (_, i) => i + 11).map((hour) => (
                <option key={hour} value={`${hour}:00`}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {language === 'ko' ? '인원' : '人数'}
              </div>
            </label>
            <select
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring focus:ring-[#FF8C00] focus:ring-opacity-50"
              required
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((size) => (
                <option key={size} value={size}>
                  {size} {language === 'ko' ? '명' : '名'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF8C00] text-white py-3 rounded-md hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? (
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

          <p className="text-sm text-gray-500 mt-4">
            {language === 'ko'
              ? '* 예약 확정 후 취소는 불가능합니다.'
              : '* 予約確定後のキャンセルはできません。'}
          </p>
        </form>
      </div>
    </div>
  );
}