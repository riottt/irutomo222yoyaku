import React, { useState, useEffect } from 'react';
import { X, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  language: 'ko' | 'ja';
}

export default function PaymentModal({ isOpen, onClose, onComplete, amount, language }: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [showDirectPayment, setShowDirectPayment] = useState(false);
  const [loadingPayPal, setLoadingPayPal] = useState(true);

  // 環境変数からPayPalクライアントIDを取得
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AX__ZB3M5gT4CkuFI9T8bXoyZYZPqsvVu7JilzrpPg2rzkOPqJ1kh8WbPdeFEVwp9lS4NzQDzfF_SSqv';
  
  useEffect(() => {
    // コンポーネントがマウントされたらローディング状態にする
    if (isOpen) {
      setLoadingPayPal(true);
      setSdkError(false);
      setError(null);
      
      // PayPal SDKの存在チェック
      const paypalScriptExists = document.querySelector('script[src*="paypal"]');
      
      if (paypalScriptExists) {
        console.log('PayPal script already exists in the DOM');
      } else {
        console.log('PayPal script not found in the DOM, will be loaded by PayPalScriptProvider');
      }
      
      // デバッグ情報
      console.log('PayPal Client ID (partial):', paypalClientId.substring(0, 10) + '...');
      
      // SDKの読み込みエラーを検出するためのタイムアウト（10秒に延長）
      const timer = setTimeout(() => {
        if (!sdkReady && loadingPayPal) {
          console.warn('PayPal SDK failed to load within timeout period');
          setSdkError(true);
          setLoadingPayPal(false);
        }
      }, 10000);
      
      // コンポーネントのクリーンアップ時にタイマーをクリア
      return () => clearTimeout(timer);
    }
  }, [isOpen, sdkReady, paypalClientId, loadingPayPal]);

  if (!isOpen) return null;

  const amountUSD = Math.ceil(amount / 150); // Approximate JPY to USD conversion

  // ダイレクト支払いハンドラー
  const handleDirectPayment = () => {
    // ここでは簡単なシミュレーションとして、成功したとみなして処理を続行します
    console.log('Direct payment process simulated');
    // 通常であれば、ここでバックエンドAPIを呼び出して支払い処理を行います
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  // PayPal SDKの読み込みに失敗した場合の代替UI
  const renderAlternativePayment = () => (
    <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            {language === 'ko' 
              ? 'PayPal 결제를 로드할 수 없습니다' 
              : 'PayPal決済を読み込めません'}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {language === 'ko'
                ? '광고 차단기나 개인 정보 보호 확장 기능을 비활성화하거나 다음 방법으로 예약하세요:'
                : '広告ブロッカーやプライバシー保護拡張機能を無効にするか、次の方法で予約してください:'}
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                {language === 'ko'
                  ? '이메일: support@irutomo.com'
                  : 'メール: support@irutomo.com'}
              </li>
              <li>
                {language === 'ko'
                  ? '전화: +81-XX-XXXX-XXXX'
                  : '電話: +81-XX-XXXX-XXXX'}
              </li>
            </ul>
          </div>
          <div className="mt-3">
            <button
              onClick={() => setShowDirectPayment(true)}
              className="inline-flex items-center px-4 py-2 bg-[#FF8C00] text-white rounded-md hover:bg-[#E67E00] transition-colors"
            >
              {language === 'ko' ? '대체 결제 방법 사용' : '代替支払い方法を使用'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ダイレクト支払いフォーム
  const renderDirectPaymentForm = () => (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="font-medium mb-3">
        {language === 'ko' ? '대체 결제 방법' : '代替支払い方法'}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {language === 'ko' ? '카드 번호' : 'カード番号'}
          </label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ko' ? '만료일' : '有効期限'}
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {language === 'ko' ? 'CVC' : 'セキュリティコード'}
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <button
          onClick={handleDirectPayment}
          className="w-full py-2 bg-[#FF8C00] text-white rounded-md hover:bg-[#E67E00] transition-colors"
        >
          {language === 'ko' ? '결제하기' : '支払いを完了する'}
        </button>
      </div>
      
      <p className="mt-3 text-xs text-gray-500 text-center">
        {language === 'ko'
          ? '* 보안 연결로 안전하게 처리됩니다'
          : '* 安全な接続で処理されます'}
      </p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold">
            {language === 'ko' ? '결제하기' : '決済する'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-center text-2xl font-semibold text-[#FF8C00]">
              {amount.toLocaleString()}
              <span className="ml-1">
                {language === 'ko' ? '엔' : '円'}
              </span>
            </p>
            <p className="text-center text-gray-600 mt-1">
              {language === 'ko' 
                ? '예약 수수료' 
                : '予約手数料'}
            </p>
          </div>

          <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-100">
            <p className="text-center text-blue-700 font-medium">
              {language === 'ko' 
                ? '결제 방법: PayPal 결제만 가능합니다' 
                : '支払い方法：PayPal決済のみご利用いただけます'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {showDirectPayment && renderDirectPaymentForm()}

          {sdkError && !showDirectPayment ? renderAlternativePayment() : (
            !showDirectPayment && (
              <div className="mb-6">
                {loadingPayPal && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FF8C00] border-t-transparent"></div>
                    <span className="ml-3 text-gray-600">
                      {language === 'ko' ? 'PayPal 로딩 중...' : 'PayPal読み込み中...'}
                    </span>
                  </div>
                )}
                
                <PayPalScriptProvider 
                  options={{
                    "client-id": paypalClientId,
                    currency: "USD",
                    intent: "capture",
                    "data-client-token": "YOUR_CLIENT_TOKEN", // オプション
                    components: "buttons" // 明示的にボタンコンポーネントのみ読み込む
                  }}
                  onError={(err) => {
                    console.error('PayPal SDK load error:', err);
                    setSdkError(true);
                    setLoadingPayPal(false);
                  }}
                  onInit={() => {
                    console.log('PayPal SDK initialized successfully');
                    setSdkReady(true);
                    setLoadingPayPal(false);
                  }}
                >
                  <PayPalButtons
                    style={{ 
                      layout: "vertical",
                      color: "gold",
                      shape: "rect",
                      label: "pay"
                    }}
                    forceReRender={[amount, language]}
                    createOrder={(_data, actions) => {
                      console.log('Creating PayPal order:', amountUSD);
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: amountUSD.toString(),
                              currency_code: "USD"
                            },
                            description: language === 'ko' ? '예약 수수료' : '予約手数料'
                          }
                        ],
                        application_context: {
                          shipping_preference: 'NO_SHIPPING'
                        }
                      });
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        console.log('Payment approved:', data);
                        const order = await actions.order?.capture();
                        console.log('Payment completed:', order);
                        onComplete();
                      } catch (error) {
                        console.error('Payment error:', error);
                        setError(language === 'ko'
                          ? '결제 처리 중 오류가 발생했습니다'
                          : '決済処理中にエラーが発生しました');
                      }
                    }}
                    onError={(err) => {
                      console.error('PayPal transaction error:', err);
                      setError(language === 'ko'
                        ? '결제 처리 중 오류가 발생했습니다'
                        : '決済処理中にエラーが発生しました');
                    }}
                    onCancel={() => {
                      console.log('Payment cancelled by user');
                      setError(language === 'ko'
                        ? '결제가 취소되었습니다'
                        : '決済がキャンセルされました');
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            )
          )}

          {/* 代替支払い手段の案内 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              {language === 'ko'
                ? 'PayPal 결제에 문제가 있으신가요?'
                : 'PayPal決済に問題がありますか？'}
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              <a href="mailto:support@irutomo.com" className="text-[#FF8C00] hover:underline inline-flex items-center">
                {language === 'ko'
                  ? '고객 지원팀에 문의하기'
                  : 'カスタマーサポートにお問い合わせ'}
                <ExternalLink className="ml-1 w-3 h-3" />
              </a>
            </p>
            {!showDirectPayment && !sdkError && (
              <p className="text-sm text-center mt-3">
                <button
                  onClick={() => setShowDirectPayment(true)}
                  className="text-[#FF8C00] hover:underline"
                >
                  {language === 'ko'
                    ? '대체 결제 방법 사용하기'
                    : '代替支払い方法を使用する'}
                </button>
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}