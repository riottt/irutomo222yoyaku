import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    // PayPal SDK読み込みエラーを検出するためのタイムアウト
    const timer = setTimeout(() => {
      if (!sdkReady) {
        setSdkError(true);
      }
    }, 5000);

    // コンポーネントのクリーンアップ時にタイマーをクリア
    return () => clearTimeout(timer);
  }, [sdkReady]);

  if (!isOpen) return null;

  const amountUSD = Math.ceil(amount / 150); // Approximate JPY to USD conversion

  // PayPal SDKの読み込みに失敗した場合の代替UI
  const renderAlternativePayment = () => (
    <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
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
        </div>
      </div>
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

          {sdkError ? renderAlternativePayment() : (
            <PayPalScriptProvider 
              options={{
                "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
                currency: "USD",
                intent: "capture"
              }}
              onError={() => setSdkError(true)}
              onInit={() => setSdkReady(true)}
            >
              <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(_data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: amountUSD.toString(),
                          currency_code: "USD"
                        }
                      }
                    ]
                  });
                }}
                onApprove={async (data, actions) => {
                  try {
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
                  console.error('PayPal error:', err);
                  setError(language === 'ko'
                    ? '결제 처리 중 오류가 발생했습니다'
                    : '決済処理中にエラーが発生しました');
                }}
              />
            </PayPalScriptProvider>
          )}

          {/* 代替支払い手段の案内 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              {language === 'ko'
                ? 'PayPal 결제에 문제가 있으신가요?'
                : 'PayPal決済に問題がありますか？'}
            </p>
            <p className="text-sm text-gray-500 text-center mt-1">
              <a href="mailto:support@irutomo.com" className="text-[#FF8C00] hover:underline">
                {language === 'ko'
                  ? '고객 지원팀에 문의하기'
                  : 'カスタマーサポートにお問い合わせ'}
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}