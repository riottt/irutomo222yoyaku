import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { Calendar, Clock, Users, MapPin, Phone, Mail, Download, Check, X, RefreshCw } from 'lucide-react';
import { sendReservationConfirmationEmail, sendAdminNotificationEmail } from '../lib/emailService';

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
  const [emailSent, setEmailSent] = useState<boolean | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);

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
      cancelled: '취소됨',
      emailSent: '예약 확인 이메일이 전송되었습니다',
      emailFailed: '이메일 전송에 실패했습니다',
      resendEmail: '이메일 재전송',
      sendingEmail: '이메일 전송 중...'
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
      cancelled: 'キャンセル済み',
      emailSent: '予約確認メールが送信されました',
      emailFailed: 'メール送信に失敗しました',
      resendEmail: 'メールを再送信',
      sendingEmail: 'メール送信中...'
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
      cancelled: 'Cancelled',
      emailSent: 'Confirmation email has been sent',
      emailFailed: 'Failed to send email',
      resendEmail: 'Resend Email',
      sendingEmail: 'Sending email...'
    }
  };

  const t = translations[language] || translations.ja;

  // メール送信処理
  const sendConfirmationEmail = async () => {
    if (!reservation || !restaurant || !reservation.email) return;
    
    setSendingEmail(true);
    setEmailSent(null);
    
    try {
      console.log('Sending confirmation email for reservation:', reservationId);
      
      // 予約確認メールの送信
      const result = await sendReservationConfirmationEmail(
        reservation.email,
        reservation.name,
        reservationId || '',
        getRestaurantName(),
        formatDate(reservation.reservation_date),
        reservation.reservation_time,
        reservation.party_size,
        language
      );
      
      // 管理者通知メールの送信
      await sendAdminNotificationEmail(
        reservationId || '',
        reservation.name,
        reservation.email,
        getRestaurantName(),
        formatDate(reservation.reservation_date),
        reservation.reservation_time,
        reservation.party_size,
        language
      );
      
      console.log('Email sending result:', result);
      setEmailSent(result.success);
    } catch (err) {
      console.error('Error sending email:', err);
      setEmailSent(false);
    } finally {
      setSendingEmail(false);
    }
  };

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
        
        // 自動的にメール送信を試行
        // データ取得後に自動送信を行うため、直接呼び出さず、次のレンダリングサイクルで実行
        setTimeout(() => {
          sendConfirmationEmail();
        }, 1000);

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

  // メール送信状態表示コンポーネント
  const EmailStatusDisplay = () => {
    if (sendingEmail) {
      return (
        <div className="flex items-center bg-blue-50 p-3 rounded-md mb-4">
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin mr-2" />
          <span className="text-blue-700">{t.sendingEmail}</span>
        </div>
      );
    }
    
    if (emailSent === true) {
      return (
        <div className="flex items-center bg-green-50 p-3 rounded-md mb-4">
          <Check className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{t.emailSent}</span>
        </div>
      );
    }
    
    if (emailSent === false) {
      return (
        <div className="flex items-center justify-between bg-red-50 p-3 rounded-md mb-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-700">{t.emailFailed}</span>
          </div>
          <button
            onClick={sendConfirmationEmail}
            disabled={sendingEmail}
            className="text-xs bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-2 rounded"
          >
            {t.resendEmail}
          </button>
        </div>
      );
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#FF8C00] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !reservation || !restaurant) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg hover:brightness-110 transition-all"
        >
          {t.back}
        </button>
      </div>
    );
  }

  const qrData = JSON.stringify({
    id: reservationId,
    name: reservation.name,
    restaurant: restaurant.name,
    date: reservation.reservation_date,
    time: reservation.reservation_time,
    partySize: reservation.party_size,
    status: reservation.status
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* 予約確認ヘッダー */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.title}</h1>
        <p className="text-lg text-gray-600">{t.success}</p>
      </div>
      
      {/* メール送信状態 */}
      <EmailStatusDisplay />
      
      {/* 予約詳細 */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="px-6 py-4 bg-[#FF8C00] text-white">
          <h2 className="text-xl font-semibold">{t.reservationDetails}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 左側のカラム - 予約情報 */}
            <div className="space-y-4">
              {/* レストラン名 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t.restaurant}</h3>
                <p className="text-lg font-medium text-gray-900">{getRestaurantName()}</p>
              </div>
              
              {/* 予約ID */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t.reservationId}</h3>
                <p className="text-lg font-medium text-gray-900">{reservationId}</p>
              </div>
              
              {/* 日付 */}
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-[#FF8C00] mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t.date}</h3>
                  <p className="text-lg font-medium text-gray-900">
                    {formatDate(reservation.reservation_date)}
                  </p>
                </div>
              </div>
              
              {/* 時間 */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-[#FF8C00] mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t.time}</h3>
                  <p className="text-lg font-medium text-gray-900">{reservation.reservation_time}</p>
                </div>
              </div>
              
              {/* 人数 */}
              <div className="flex items-start">
                <Users className="w-5 h-5 text-[#FF8C00] mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-gray-500">{t.partySize}</h3>
                  <p className="text-lg font-medium text-gray-900">{reservation.party_size}</p>
                </div>
              </div>
              
              {/* 予約ステータス */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t.status}</h3>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : reservation.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {reservation.status === 'confirmed'
                      ? t.confirmed
                      : reservation.status === 'cancelled'
                      ? t.cancelled
                      : t.pending}
                  </span>
                </div>
              </div>
              
              {/* 支払い状況 */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">{t.paymentCompleted}</h3>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Check className="w-3 h-3 mr-1" /> {t.paymentCompleted}
                  </span>
                </div>
              </div>
            </div>
            
            {/* 右側のカラム - QRコードと連絡先 */}
            <div className="space-y-6">
              {/* QRコード */}
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.qrCode}</h3>
                <div className="inline-block bg-white p-3 border rounded-lg shadow-sm">
                  <QRCodeSVG
                    id="reservation-qr-code"
                    value={qrData}
                    size={150}
                    level="H"
                    includeMargin
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 mb-4">
                  {t.qrExplanation}
                </p>
                <button 
                  onClick={handleDownloadQR}
                  className="inline-flex items-center text-[#FF8C00] hover:text-orange-600"
                >
                  <Download className="w-4 h-4 mr-1" />
                  {t.download}
                </button>
              </div>
              
              {/* 連絡先情報 */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">{t.contactInfo}</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-600">{restaurant.address}</span>
                  </div>
                  {restaurant.phone && (
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{restaurant.phone}</span>
                    </div>
                  )}
                  {restaurant.email && (
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-gray-600">{restaurant.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* アクションボタン */}
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
        >
          {t.back}
        </button>
        <button
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`, '_blank')}
          className="px-6 py-2 bg-[#FF8C00] text-white rounded-lg hover:brightness-110 transition-all"
        >
          {t.directions}
        </button>
      </div>
    </div>
  );
} 