import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Filter, CheckCircle, XCircle, RefreshCw, Calendar, Clock, Users, Mail } from 'lucide-react';

interface AdminDashboardProps {
  language: 'ko' | 'ja' | 'en';
  onBack: () => void;
}

export default function AdminDashboard({ language, onBack }: AdminDashboardProps) {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    date: '',
    status: 'all',
    restaurant: ''
  });
  const [restaurants, setRestaurants] = useState([]);

  const translations = {
    ko: {
      title: '관리자 대시보드',
      noReservations: '예약이 없습니다',
      filters: '필터',
      date: '날짜',
      status: '상태',
      all: '모두',
      pending: '대기 중',
      confirmed: '확인됨',
      cancelled: '취소됨',
      restaurant: '레스토랑',
      loading: '로딩 중...',
      refresh: '새로고침',
      reservationList: '예약 목록',
      id: '예약 ID',
      customer: '고객',
      restaurantName: '레스토랑',
      dateTime: '날짜/시간',
      partySize: '인원',
      paymentStatus: '결제 상태',
      actions: '작업',
      confirm: '확인',
      cancel: '취소',
      paid: '결제 완료',
      notPaid: '미결제',
      cancelReason: '취소 사유',
      submit: '제출',
      closeModal: '닫기',
      cancelReservation: '예약 취소',
      confirmReservation: '예약 확인',
      confirmMessage: '이 예약을 확인하시겠습니까?',
      cancelQuestion: '이 예약을 취소하시겠습니까?'
    },
    ja: {
      title: '管理者ダッシュボード',
      noReservations: '予約がありません',
      filters: 'フィルター',
      date: '日付',
      status: 'ステータス',
      all: 'すべて',
      pending: '保留中',
      confirmed: '確認済み',
      cancelled: 'キャンセル済み',
      restaurant: 'レストラン',
      loading: '読み込み中...',
      refresh: '更新',
      reservationList: '予約リスト',
      id: '予約ID',
      customer: '顧客',
      restaurantName: 'レストラン',
      dateTime: '日付/時間',
      partySize: '人数',
      paymentStatus: '支払い状況',
      actions: '操作',
      confirm: '確認',
      cancel: 'キャンセル',
      paid: '支払い完了',
      notPaid: '未払い',
      cancelReason: 'キャンセル理由',
      submit: '送信',
      closeModal: '閉じる',
      cancelReservation: '予約をキャンセル',
      confirmReservation: '予約を確認',
      confirmMessage: 'この予約を確認しますか？',
      cancelQuestion: 'この予約をキャンセルしますか？'
    },
    en: {
      title: 'Admin Dashboard',
      noReservations: 'No reservations',
      filters: 'Filters',
      date: 'Date',
      status: 'Status',
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      restaurant: 'Restaurant',
      loading: 'Loading...',
      refresh: 'Refresh',
      reservationList: 'Reservation List',
      id: 'Reservation ID',
      customer: 'Customer',
      restaurantName: 'Restaurant',
      dateTime: 'Date/Time',
      partySize: 'Party Size',
      paymentStatus: 'Payment Status',
      actions: 'Actions',
      confirm: 'Confirm',
      cancel: 'Cancel',
      paid: 'Paid',
      notPaid: 'Not Paid',
      cancelReason: 'Cancellation Reason',
      submit: 'Submit',
      closeModal: 'Close',
      cancelReservation: 'Cancel Reservation',
      confirmReservation: 'Confirm Reservation',
      confirmMessage: 'Are you sure you want to confirm this reservation?',
      cancelQuestion: 'Are you sure you want to cancel this reservation?'
    }
  };

  const t = translations[language] || translations.ja;

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchReservations();
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [filter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reservations')
        .select(`
          *,
          restaurants (id, name, japanese_name, korean_name)
        `)
        .order('reservation_date', { ascending: false });

      if (filter.date) {
        query = query.eq('reservation_date', filter.date);
      }

      if (filter.status !== 'all') {
        query = query.eq('status', filter.status);
      }

      if (filter.restaurant) {
        query = query.eq('restaurant_id', filter.restaurant);
      }

      const { data, error } = await query;

      if (error) throw error;
      setReservations(data || []);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      alert(language === 'ko' 
        ? '예약 정보를 불러오는 중 오류가 발생했습니다' 
        : language === 'ja'
        ? '予約情報の取得中にエラーが発生しました'
        : 'Error fetching reservation information');
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name')
        .order('name');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };

  const handleConfirmReservation = async () => {
    try {
      if (!selectedReservation) return;

      const { error } = await supabase
        .from('reservations')
        .update({ status: 'confirmed' })
        .eq('id', selectedReservation.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert({
          action: 'confirm_reservation',
          details: { reservation_id: selectedReservation.id }
        });

      fetchReservations();
      setShowConfirmModal(false);
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert(language === 'ko' 
        ? '예약 확인 중 오류가 발생했습니다' 
        : language === 'ja'
        ? '予約確認中にエラーが発生しました'
        : 'Error confirming reservation');
    }
  };

  const handleCancelReservation = async () => {
    try {
      if (!selectedReservation || !cancelReason) return;

      const { error } = await supabase
        .from('reservations')
        .update({
          status: 'cancelled',
          cancellation_reason: cancelReason
        })
        .eq('id', selectedReservation.id);

      if (error) throw error;

      // Log the action
      await supabase
        .from('audit_logs')
        .insert({
          action: 'cancel_reservation',
          details: {
            reservation_id: selectedReservation.id,
            reason: cancelReason
          }
        });

      fetchReservations();
      setShowCancelModal(false);
      setCancelReason('');
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert(language === 'ko' 
        ? '예약 취소 중 오류가 발생했습니다' 
        : language === 'ja'
        ? '予約キャンセル中にエラーが発生しました'
        : 'Error cancelling reservation');
    }
  };

  const formatDateTime = (date, time) => {
    try {
      const dateObj = new Date(date);
      const formattedDate = dateObj.toLocaleDateString(
        language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US',
        { year: 'numeric', month: '2-digit', day: '2-digit' }
      );
      return `${formattedDate} ${time}`;
    } catch (e) {
      return `${date} ${time}`;
    }
  };

  const getRestaurantName = (reservation) => {
    if (!reservation.restaurants) return '';
    
    if (language === 'ko' && reservation.restaurants.korean_name) {
      return reservation.restaurants.korean_name;
    } else if (language === 'ja' && reservation.restaurants.japanese_name) {
      return reservation.restaurants.japanese_name;
    }
    
    return reservation.restaurants.name;
  };

  // モーダルコンポーネント
  const CancelModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-semibold mb-4">{t.cancelReservation}</h3>
        <p className="mb-4">{t.cancelQuestion}</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.cancelReason}
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={3}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowCancelModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            {t.closeModal}
          </button>
          <button
            onClick={handleCancelReservation}
            className="px-4 py-2 bg-red-600 text-white rounded-md"
            disabled={!cancelReason}
          >
            {t.cancel}
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-xl font-semibold mb-4">{t.confirmReservation}</h3>
        <p className="mb-6">{t.confirmMessage}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 border border-gray-300 rounded-md"
          >
            {t.closeModal}
          </button>
          <button
            onClick={handleConfirmReservation}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#FF8C00]">{t.title}</h1>
          <button
            onClick={() => fetchReservations()}
            className="flex items-center text-gray-600 hover:text-[#FF8C00]"
          >
            <RefreshCw className="w-5 h-5 mr-1" />
            {t.refresh}
          </button>
        </div>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            <Filter className="w-5 h-5 mr-2 text-[#FF8C00]" />
            <h2 className="text-lg font-semibold">{t.filters}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t.date}
                </div>
              </label>
              <input
                type="date"
                value={filter.date}
                onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.status}
              </label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00]"
              >
                <option value="all">{t.all}</option>
                <option value="pending">{t.pending}</option>
                <option value="confirmed">{t.confirmed}</option>
                <option value="cancelled">{t.cancelled}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.restaurant}
              </label>
              <select
                value={filter.restaurant}
                onChange={(e) => setFilter({ ...filter, restaurant: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#FF8C00] focus:ring-[#FF8C00]"
              >
                <option value="">{t.all}</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 予約リスト */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">{t.reservationList}</h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
              <span className="ml-3 text-gray-600">{t.loading}</span>
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              {t.noReservations}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.customer}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.restaurantName}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.dateTime}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.partySize}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.status}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.paymentStatus}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t.actions}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                        <div className="text-sm text-gray-500">{reservation.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getRestaurantName(reservation)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {formatDateTime(reservation.reservation_date, reservation.reservation_time)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-900">{reservation.party_size}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${reservation.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              reservation.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                              'bg-yellow-100 text-yellow-800'}`}
                        >
                          {reservation.status === 'confirmed' ? t.confirmed :
                            reservation.status === 'cancelled' ? t.cancelled :
                            t.pending}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${reservation.payment_status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {reservation.payment_status === 'completed' ? t.paid : t.notPaid}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {reservation.status === 'pending' && (
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setShowConfirmModal(true);
                              }}
                              className="text-green-600 hover:text-green-900"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                          {reservation.status !== 'cancelled' && (
                            <button
                              onClick={() => {
                                setSelectedReservation(reservation);
                                setShowCancelModal(true);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
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
      </div>

      {/* キャンセルモーダル */}
      {showCancelModal && <CancelModal />}

      {/* 確認モーダル */}
      {showConfirmModal && <ConfirmModal />}
    </div>
  );
} 