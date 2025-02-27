import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, Download } from 'lucide-react';

interface ReservationSuccessProps {
  language: 'ko' | 'ja' | 'en';
}

export default function ReservationSuccess({ language }: ReservationSuccessProps) {
  const { reservationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    ko: {
      title: '예약 확인',
      success: '예약이 성공적으로 완료되었습니다!',
      reservationDetails: '예약 상세 정보',
      restaurant: '레스토랑',
      date: '날짜',
      time: '시간',
      partySize: '인원 수',
      contactInfo: '연락처 정보',
      name: '이름',
      email: '이메일',
      phone: '전화번호',
      address: '주소',
      qrCode: 'QR 코드',
      qrExplanation: '레스토랑에 도착하면 이 QR 코드를 보여주세요',
      download: 'QR 코드 다운로드',
      error: '예약 정보를 불러올 수 없습니다',
      back: '홈으로',
      directions: '가는 길',
      paymentCompleted: '결제 완료',
      reservationId: '예약 ID',
      specialRequests: '특별 요청',
      none: '없음',
      status: '상태',
      pending: '대기 중',
      confirmed: '확인됨',
      cancelled: '취소됨'
    },
    ja: {
      title: '予約確認',
      success: '予約が完了しました！',
      reservationDetails: '予約詳細',
      restaurant: 'レストラン',
      date: '日付',
      time: '時間',
      partySize: '人数',
      contactInfo: '連絡先情報',
      name: '名前',
      email: 'メールアドレス',
      phone: '電話番号',
      address: '住所',
      qrCode: 'QRコード',
      qrExplanation: 'レストランに到着したら、このQRコードを提示してください',
      download: 'QRコードをダウンロード',
      error: '予約情報を取得できませんでした',
      back: 'ホームに戻る',
      directions: '道順',
      paymentCompleted: '支払い完了',
      reservationId: '予約ID',
      specialRequests: '特別リクエスト',
      none: 'なし',
      status: 'ステータス',
      pending: '保留中',
      confirmed: '確認済み',
      cancelled: 'キャンセル済み'
    },
    en: {
      title: 'Reservation Confirmation',
      success: 'Your reservation has been successfully completed!',
      reservationDetails: 'Reservation Details',
      restaurant: 'Restaurant',
      date: 'Date',
      time: 'Time',
      partySize: 'Party Size',
      contactInfo: 'Contact Information',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      qrCode: 'QR Code',
      qrExplanation: 'Show this QR code when you arrive at the restaurant',
      download: 'Download QR Code',
      error: 'Could not load reservation information',
      back: 'Back to Home',
      directions: 'Get Directions',
      paymentCompleted: 'Payment Completed',
      reservationId: 'Reservation ID',
      specialRequests: 'Special Requests',
      none: 'None',
      status: 'Status',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled'
    }
  };

  const t = translations[language] || translations.ja;

  useEffect(() => {
    const fetchReservationData = async () => {
      if (!reservationId) return;

      try {
        setLoading(true);
        
        // 予約詳細情報をフェッチ
        const { data: reservationData, error: reservationError } = await supabase
          .from('reservations')
          .select('*')
          .eq('id', reservationId)
          .single();

        if (reservationError) throw reservationError;
        if (!reservationData) throw new Error('Reservation not found');

        setReservation(reservationData);

        // レストラン情報をフェッチ
        const { data: restaurantData, error: restaurantError } = await supabase
          .from('restaurants')
          .select('*')
          .eq('id', reservationData.restaurant_id)
          .single();

        if (restaurantError) throw restaurantError;
        setRestaurant(restaurantData);

      } catch (err) {
        console.error('Error fetching reservation data:', err);
        setError(t.error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationData();
  }, [reservationId, language]);

  const handleDownloadQR = () => {
    const svg = document.getElementById('reservation-qr-code');
    if (!svg) return;
    
    // SVGをデータURLに変換
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    // SVGをPNGに変換
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      // PNGをダウンロード
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = `reservation-${reservationId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 一時的なURLを解放
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(
        language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      );
    } catch (e) {
      return dateString;
    }
  };

  const getRestaurantName = () => {
    if (!restaurant) return '';
    
    if (language === 'ko' && restaurant.korean_name) {
      return restaurant.korean_name;
    } else if (language === 'ja' && restaurant.japanese_name) {
      return restaurant.japanese_name;
    }
    
    return restaurant.name;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return t.confirmed;
      case 'cancelled':
        return t.cancelled;
      default:
        return t.pending;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !reservation || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-red-600 text-2xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">{t.error}</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#FF8C00] text-white rounded-md shadow-md hover:bg-[#E67E00] transition-colors"
          >
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  const qrValue = JSON.stringify({
    id: reservation.id,
    name: reservation.name,
    restaurantId: reservation.restaurant_id,
    date: reservation.reservation_date,
    time: reservation.reservation_time,
    party_size: reservation.party_size
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* 成功メッセージ */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.success}</p>
          </div>

          {/* 予約詳細カード */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{t.reservationDetails}</h2>
                <span className={`${getStatusColor(reservation.status)} font-medium`}>
                  {getStatusText(reservation.status)}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              {/* 予約ID */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">{t.reservationId}</p>
                <p className="text-base font-medium">{reservation.id}</p>
              </div>
              
              {/* レストラン情報 */}
              <div className="mb-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-[#FF8C00] mt-0.5 mr-2" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{getRestaurantName()}</h3>
                    <p className="text-gray-600 mt-1">{restaurant.address}</p>
                    {restaurant.phone && (
                      <p className="flex items-center text-gray-600 mt-2">
                        <Phone className="w-4 h-4 mr-1" />
                        {restaurant.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 予約情報 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-[#FF8C00] mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t.date}</p>
                    <p className="text-base font-medium">
                      {formatDate(reservation.reservation_date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-[#FF8C00] mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t.time}</p>
                    <p className="text-base font-medium">{reservation.reservation_time}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-[#FF8C00] mr-2" />
                  <div>
                    <p className="text-sm text-gray-500">{t.partySize}</p>
                    <p className="text-base font-medium">{reservation.party_size}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-5 h-5 flex items-center justify-center text-[#FF8C00] mr-2">
                    <span className="text-lg font-bold">₩</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.paymentCompleted}</p>
                    <p className="text-base font-medium">
                      {reservation.payment_status === 'completed' ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-yellow-600">⚠</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 連絡先情報 */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.contactInfo}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">{t.name}</p>
                    <p className="text-base font-medium">{reservation.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{t.email}</p>
                    <p className="text-base font-medium">{reservation.email}</p>
                  </div>
                </div>
              </div>
              
              {/* 特別リクエスト */}
              {reservation.special_requests && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-800 mb-2">{t.specialRequests}</h3>
                  <p className="text-gray-600">
                    {reservation.special_requests || t.none}
                  </p>
                </div>
              )}
              
              {/* QRコード */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.qrCode}</h3>
                <div className="flex flex-col items-center">
                  <div className="bg-white p-3 border border-gray-300 rounded-lg mb-3">
                    <QRCodeSVG 
                      id="reservation-qr-code"
                      value={qrValue}
                      size={180}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-4">
                    {t.qrExplanation}
                  </p>
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center text-[#FF8C00] hover:text-[#E67E00] transition-colors"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t.download}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 地図ボタン */}
          {restaurant.google_maps_url && (
            <div className="flex justify-center">
              <a
                href={restaurant.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#FF8C00] text-white rounded-md shadow-md hover:bg-[#E67E00] transition-colors flex items-center"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {t.directions}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 