import React, { useState } from 'react';
import { X, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// PayPal関連のインポートをコメントアウト
// import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from './StripePaymentForm';
import { stripePromise } from '../lib/stripe';
import type { StripeElementsOptions } from '@stripe/stripe-js';

// PayPalNamespaceの型定義をコメントアウト
/*
interface PayPalNamespace {
  Buttons?: (options: Record<string, unknown>) => {
    render: (element: HTMLElement) => void;
  };
  [key: string]: unknown;
}
*/

// PaymentModalの型定義
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  language: 'ko' | 'ja' | 'en';
}

// PayPal決済の詳細情報の型定義
interface PaymentDetails {
  id: string;
  status: string;
  [key: string]: unknown;
}

// fingerprintLoadedプロパティをwindowに追加するための型拡張
declare global {
  interface Window {
    // paypal: PayPalNamespace | null | undefined;
    // paypalSDKLoaded?: boolean | (() => void);
    fingerprintLoaded?: boolean;
    resourceLoadErrors: string[];
  }
}

// 支払い方法の型定義 - PayPalをコメントアウト
// type PaymentMethod = 'paypal' | 'stripe' | 'info';
type PaymentMethod = 'stripe' | 'info';

// PayPalButtonsWrapperコンポーネントをコメントアウト
/*
const PayPalButtonsWrapper = memo(
  ({ amount, onSuccess, onError, currency = 'JPY', language = 'ja' }: {
    amount: number;
    onSuccess: (details: PaymentDetails) => void;
    onError: (err: Error) => void;
    currency?: string;
    language?: 'ko' | 'ja' | 'en';
  }) => {
    // PayPalButtonsWrapperの実装
    return (
      <PayPalButtons
        style={{ layout: 'vertical', label: 'pay' }}
        createOrder={(data, actions) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: currency,
                  value: amount.toString(),
                },
              },
            ],
            application_context: {
              locale: language === 'ko' ? 'ko-KR' : language === 'en' ? 'en-US' : 'ja-JP',
            },
          });
        }}
        onApprove={async (data, actions) => {
          if (actions.order) {
            const details = await actions.order.capture();
            onSuccess(details as PaymentDetails);
          }
        }}
        onError={(err) => {
          console.error('PayPal Error:', err);
          onError(err instanceof Error ? err : new Error(String(err)));
        }}
      />
    );
  }
);
*/

export default function PaymentModal({ isOpen, onClose, onComplete, amount, language }: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null);
  // PayPal関連のstate管理をコメントアウト
  // const [sdkReady, setSdkReady] = useState(false);
  // const [loadingPayPal, setLoadingPayPal] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState<PaymentMethod>('stripe'); // デフォルトでStripeタブを選択
  // const [scriptLoadFailed, setScriptLoadFailed] = useState(false);
  // const [scriptLoadAttempted, setScriptLoadAttempted] = useState(false);
  // const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  // const adBlockerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // const fallbackMethodUsed = useRef<boolean>(false);

  // Stripeの初期化オプション
  const stripeOptions: StripeElementsOptions = {
    locale: language === 'ko' ? 'ko' : language === 'en' ? 'en' : 'ja',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0366d6',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  };

  // 支払い成功時の処理
  const handlePaymentSuccess = (details: PaymentDetails) => {
    console.log('支払い成功:', details);
    setPaymentSuccess(true);
    setError(null);
    
    // 必要に応じて予約データを更新するなどの処理を追加

    // 親コンポーネントに成功を通知
    onComplete();
  };

  // PayPalスクリプトのロード関連の処理をコメントアウト
  /*
  // PayPal SDKが読み込まれたことを検知する関数
  const detectPayPalSDKLoaded = useCallback(() => {
    if (typeof window.paypal !== 'undefined' && window.paypal !== null) {
      console.log('PayPal SDK loaded successfully via direct detection');
      setSdkReady(true);
      setLoadingPayPal(false);
      return true;
    }
    return false;
  }, []);

  // 広告ブロッカーが検出された時の代替処理を行う関数
  const activateFallbackPayment = useCallback(() => {
    if (fallbackMethodUsed.current) {
      return;
    }
    
    console.log('Activating fallback payment method');
    fallbackMethodUsed.current = true;
    setSelectedTab('stripe');
    setAdBlockerDetected(true);
    setLoadingPayPal(false);
  }, []);

  // モーダルが開いた際にPayPalスクリプトの読み込み状態を確認
  useEffect(() => {
    if (isOpen) {
      // すでにロードされている場合は早期リターン
      if (sdkReady || scriptLoadFailed) {
        return;
      }
      
      setLoadingPayPal(true);
      
      // PayPalがすでに存在するか確認
      if (detectPayPalSDKLoaded()) {
        return;
      }
      
      // スクリプトのロード試行済みフラグを設定
      if (!scriptLoadAttempted) {
        setScriptLoadAttempted(true);
        
        // 広告ブロッカーのタイマーをセット
        adBlockerTimerRef.current = setTimeout(() => {
          if (!sdkReady && !scriptLoadFailed) {
            console.log('PayPal script loading timeout - possible adblock');
            activateFallbackPayment();
          }
        }, 5000); // 5秒後にタイムアウト
      }
    }
    
    // クリーンアップ関数
    return () => {
      if (adBlockerTimerRef.current) {
        clearTimeout(adBlockerTimerRef.current);
      }
    };
  }, [isOpen, scriptLoadFailed, sdkReady, activateFallbackPayment, detectPayPalSDKLoaded, scriptLoadAttempted]);
  */

  // モーダルが閉じられている場合は何も表示しない
  if (!isOpen) return null;

  const getLocalizedText = (ja: string, en: string, ko: string) => {
    switch (language) {
      case 'ja':
        return ja;
      case 'en':
        return en;
      case 'ko':
        return ko;
      default:
        return en;
    }
  };

  const renderSuccessMessage = () => {
    return (
      <div className="text-center p-6">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {getLocalizedText(
            '支払いが完了しました',
            'Payment Successful',
            '결제가 완료되었습니다'
          )}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {getLocalizedText(
            'ご予約の確認メールをお送りしました。',
            'A confirmation email has been sent for your reservation.',
            '예약 확인 이메일이 발송되었습니다.'
          )}
        </p>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={onClose}
        >
          {getLocalizedText('閉じる', 'Close', '닫기')}
        </button>
      </div>
    );
  };

  // 代替支払い方法のUIとタブ切り替えのレンダリング
  const renderAlternativePayment = () => {
    return (
      <div className="mt-4">
        <div className="flex border-b">
          <button
            onClick={() => setSelectedTab('stripe')}
            className={`px-4 py-2 font-medium ${
              selectedTab === 'stripe'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title={getLocalizedText('クレジット/デビットカード', 'Credit/Debit Card', '신용/직불 카드')}
          >
            {getLocalizedText(
              'クレジット/デビットカード',
              'Credit/Debit Card',
              '신용/직불 카드'
            )}
          </button>
          <button
            onClick={() => setSelectedTab('info')}
            className={`px-4 py-2 font-medium ${
              selectedTab === 'info'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            title={getLocalizedText('情報', 'Info', '정보')}
          >
            {getLocalizedText('情報', 'Info', '정보')}
          </button>
        </div>

        {/* 選択されたタブに基づいてコンテンツを表示 */}
        <div className="mt-4">
          {selectedTab === 'stripe' && (
            <Elements stripe={stripePromise} options={stripeOptions}>
              <StripePaymentForm
                amount={amount}
                onSuccess={handlePaymentSuccess}
                onError={(err) => setError(err.message)}
                language={language}
              />
            </Elements>
          )}
          
          {selectedTab === 'info' && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h4 className="font-medium text-gray-900 mb-2">
                {getLocalizedText(
                  'お支払い情報',
                  'Payment Information',
                  '결제 정보'
                )}
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                {getLocalizedText(
                  'お支払いは安全な環境で処理されます。カード情報は暗号化され、当社のサーバーに保存されることはありません。',
                  'Payments are processed in a secure environment. Your card information is encrypted and never stored on our servers.',
                  '결제는 안전한 환경에서 처리됩니다. 카드 정보는 암호화되어 당사 서버에 저장되지 않습니다.'
                )}
              </p>
              <p className="text-sm text-gray-600">
                {getLocalizedText(
                  'テスト用カード番号: 4242 4242 4242 4242、有効期限: 任意の将来の日付、CVC: 任意の3桁の数字',
                  'Test card number: 4242 4242 4242 4242, Expiry: Any future date, CVC: Any 3 digits',
                  '테스트 카드 번호: 4242 4242 4242 4242, 만료일: 미래의 날짜, CVC: 아무 3자리 숫자'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 transition-opacity"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-lg shadow-xl transform transition-all max-w-lg w-full mx-4 sm:mx-auto relative z-50 overflow-hidden"
          >
            {/* ヘッダー */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {getLocalizedText('お支払い', 'Payment', '결제')}
              </h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition-colors"
                onClick={onClose}
                title={getLocalizedText('閉じる', 'Close', '닫기')}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* 本体 */}
            <div className="p-4 sm:p-6">
              {paymentSuccess ? (
                renderSuccessMessage()
              ) : (
                <>
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">
                        {getLocalizedText('お支払い金額', 'Payment Amount', '결제 금액')}
                      </h4>
                      <span className="text-lg font-bold">
                        ¥{amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {getLocalizedText(
                        '安全な支払い処理のため、外部の決済サービスを利用しています。',
                        'We use external payment services for secure payment processing.',
                        '안전한 결제 처리를 위해 외부 결제 서비스를 이용하고 있습니다.'
                      )}
                    </p>
                  </div>
                  
                  {error && (
                    <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">
                            {getLocalizedText(
                              'エラーが発生しました',
                              'An error occurred',
                              '오류가 발생했습니다'
                            )}
                          </h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>{error}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* 支払い方法のレンダリング */}
                  {renderAlternativePayment()}
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}