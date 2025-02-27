import emailjs from '@emailjs/browser';

// EmailJSの設定
// これらの値は実際の値に置き換える必要があります
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_default';
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_default';
const USER_ID = import.meta.env.VITE_EMAILJS_USER_ID || 'user_default';

// 初期化
emailjs.init(USER_ID);

// 予約確認メールを送信する関数
export const sendReservationConfirmationEmail = async (
  email: string,
  name: string,
  reservationId: string,
  restaurantName: string,
  date: string,
  time: string,
  partySize: number,
  language: 'ko' | 'ja' | 'en' = 'ja'
) => {
  try {
    console.log('Sending confirmation email to:', email);
    
    // 言語に基づいた件名と挨拶
    const subjects = {
      ko: '예약 확인: ' + restaurantName,
      ja: '予約確認: ' + restaurantName,
      en: 'Reservation Confirmation: ' + restaurantName
    };
    
    const greetings = {
      ko: name + '님, 예약해 주셔서 감사합니다!',
      ja: name + '様、ご予約ありがとうございます！',
      en: 'Dear ' + name + ', thank you for your reservation!'
    };
    
    // テンプレートパラメータ
    const templateParams = {
      to_email: email,
      to_name: name,
      subject: subjects[language],
      greeting: greetings[language],
      reservation_id: reservationId,
      restaurant_name: restaurantName,
      reservation_date: date,
      reservation_time: time,
      party_size: partySize,
      language: language
    };
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );
    
    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};

// 予約キャンセルメールを送信する関数
export const sendReservationCancellationEmail = async (
  email: string,
  name: string,
  reservationId: string,
  restaurantName: string,
  language: 'ko' | 'ja' | 'en' = 'ja'
) => {
  try {
    console.log('Sending cancellation email to:', email);
    
    // 言語に基づいた件名と挨拶
    const subjects = {
      ko: '예약 취소 확인: ' + restaurantName,
      ja: '予約キャンセル確認: ' + restaurantName,
      en: 'Reservation Cancellation: ' + restaurantName
    };
    
    const greetings = {
      ko: name + '님, 예약이 취소되었습니다.',
      ja: name + '様、ご予約がキャンセルされました。',
      en: 'Dear ' + name + ', your reservation has been cancelled.'
    };
    
    // テンプレートパラメータ
    const templateParams = {
      to_email: email,
      to_name: name,
      subject: subjects[language],
      greeting: greetings[language],
      reservation_id: reservationId,
      restaurant_name: restaurantName,
      language: language
    };
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    );
    
    console.log('Cancellation email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send cancellation email:', error);
    return { success: false, error };
  }
};

// 管理者への新規予約通知メールを送信する関数
export const sendAdminNotificationEmail = async (
  reservationId: string,
  customerName: string,
  customerEmail: string,
  restaurantName: string,
  date: string,
  time: string,
  partySize: number,
  language: 'ko' | 'ja' | 'en' = 'ja'
) => {
  try {
    console.log('Sending admin notification email');
    
    // 管理者のメールアドレス
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'support@irutomo.com';
    
    // テンプレートパラメータ
    const templateParams = {
      to_email: adminEmail,
      to_name: 'Admin',
      subject: '新規予約通知: ' + reservationId,
      reservation_id: reservationId,
      customer_name: customerName,
      customer_email: customerEmail,
      restaurant_name: restaurantName,
      reservation_date: date,
      reservation_time: time,
      party_size: partySize,
      customer_language: language
    };
    
    const response = await emailjs.send(
      SERVICE_ID,
      'template_admin_notification', // 管理者通知用の別テンプレートID
      templateParams
    );
    
    console.log('Admin notification email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send admin notification email:', error);
    return { success: false, error };
  }
};

// メールテンプレートをテストする関数（開発用）
export const testEmailTemplate = async (email: string, language: 'ko' | 'ja' | 'en' = 'ja') => {
  try {
    const testParams = {
      to_email: email,
      to_name: 'テストユーザー',
      subject: 'テストメール',
      greeting: '予約システムのテストメールです',
      reservation_id: 'TEST12345',
      restaurant_name: 'テストレストラン',
      reservation_date: '2023-05-01',
      reservation_time: '18:00',
      party_size: 2,
      language: language
    };
    
    const response = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      testParams
    );
    
    console.log('Test email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send test email:', error);
    return { success: false, error };
  }
}; 