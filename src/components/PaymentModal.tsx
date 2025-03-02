import React, { useState, useEffect, useCallback, memo } from 'react';
import { X, AlertCircle, ExternalLink, CreditCard, Check, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  language: 'ko' | 'ja' | 'en';
}

// メモ化されたPayPalボタンコンポーネント
const MemoizedPayPalButtons = memo(PayPalButtons);

export default function PaymentModal({ isOpen, onClose, onComplete, amount, language }: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkError, setSdkError] = useState(false);
  const [loadingPayPal, setLoadingPayPal] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'paypal' | 'info'>('paypal');

  // 環境変数からPayPalクライアントIDを取得
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'AX__ZB3M5gT4CkuFI9T8bXoyZYZPqsvVu7JilzrpPg2rzkOPqJ1kh8WbPdeFEVwp9lS4NzQDzfF_SSqv';
  
  // 通貨コードの取得
  const getCurrencyCode = useCallback((lang: string): string => {
    return lang === 'ko' ? 'KRW' : lang === 'en' ? 'USD' : 'JPY';
  }, []);

  // 言語に応じた金額の変換
  const getConvertedAmount = useCallback((amt: number, lang: string): number => {
    // 円 -> ドル (150円 = 1ドル)
    if (lang === 'en') return amt / 150;
    // 円 -> ウォン (1円 = 9.7ウォン)
    if (lang === 'ko') return amt * 9.7;
    // デフォルトは円
    return amt;
  }, []);

  // 通貨シンボルの取得
  const getCurrencySymbol = useCallback((lang: string): string => {
    return lang === 'ko' ? '₩' : lang === 'en' ? '$' : '¥';
  }, []);

  // 通貨の表示名を取得
  const getCurrencyName = useCallback(() => {
    switch (language) {
      case 'ko': return 'ウォン';
      case 'en': return 'USD';
      case 'ja': return '円';
      default: return '円';
    }
  }, [language]);

  // 通貨のロケールを取得
  const getCurrencyLocale = useCallback(() => {
    switch (language) {
      case 'ko': return 'ko-KR';
      case 'en': return 'en-US';
      case 'ja': return 'ja-JP';
      default: return 'ja-JP';
    }
  }, [language]);

  // 数値をフォーマット
  const formatAmount = useCallback((value: number) => {
    return new Intl.NumberFormat(getCurrencyLocale()).format(value);
  }, [getCurrencyLocale]);
  
  // リセット関数
  const resetPayPalState = useCallback(() => {
    setLoadingPayPal(true);
    setSdkError(false);
    setError(null);
    setSdkReady(false);
  }, []);
  
  useEffect(() => {
    // モーダルが開いたらリセット
    if (isOpen) {
      resetPayPalState();
      
      // デバッグ情報
      console.log('PayPal Client ID (partial):', paypalClientId.substring(0, 10) + '...');
      console.log('Original Amount in JPY:', amount);
      console.log(`Converted Amount in ${getCurrencyCode(language)}:`, getConvertedAmount(amount, language));
      
      // 短いタイムアウトで自動的にローディング状態を解除
      // これにより、SDKが正しく読み込まれなくてもボタンが表示される可能性が高まります
      const loadingTimer = setTimeout(() => {
        setLoadingPayPal(false);
      }, 3000);
      
      // SDKの読み込みエラーを検出するためのタイムアウト
      const errorTimer = setTimeout(() => {
        if (!sdkReady && !sdkError) {
          console.warn('PayPal SDK failed to load within timeout period');
          setSdkError(true);
          setLoadingPayPal(false);
        }
      }, 8000);
      
      // コンポーネントのクリーンアップ時にタイマーをクリア
      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(errorTimer);
      };
    }
  }, [isOpen, language, amount, getCurrencyCode, getConvertedAmount, resetPayPalState]);

  if (!isOpen) return null;

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
              : language === 'ja'
              ? 'PayPal決済を読み込めません'
              : 'Cannot load PayPal payment'}
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              {language === 'ko'
                ? '광고 차단기나 개인 정보 보호 확장 기능을 비활성화하거나 다음 방법으로 예약하세요:'
                : language === 'ja'
                ? '広告ブロッカーやプライバシー保護拡張機能を無効にするか、次の方法で予約してください:'
                : 'Disable ad blockers or privacy extensions, or book using one of these methods:'}
            </p>
            <ul className="list-disc pl-5 mt-2">
              <li>
                {language === 'ko'
                  ? '이메일: support@irutomo.com'
                  : language === 'ja'
                  ? 'メール: support@irutomo.com'
                  : 'Email: support@irutomo.com'}
              </li>
              <li>
                {language === 'ko'
                  ? '전화: +81-XX-XXXX-XXXX'
                  : language === 'ja'
                  ? '電話: +81-XX-XXXX-XXXX'
                  : 'Phone: +81-XX-XXXX-XXXX'}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // 言語に応じたテキストを取得
  const getLocalizedText = (ja: string, en: string, ko: string) => {
    switch (language) {
      case 'ko': return ko;
      case 'en': return en;
      case 'ja': 
      default: return ja;
    }
  };

  // PayPalボタンのレンダリング
  const renderPayPalButton = () => {
    const currencyCode = getCurrencyCode(language);
    const convertedAmount = getConvertedAmount(amount, language);
    
    console.log(`PayPalボタンレンダリング: 金額=${amount}円, 変換後=${convertedAmount}${currencyCode}`);
    
    // PayPalボタンのスタイル
    const buttonStyles = {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'paypal'
    };

    return (
      <div className="w-full">
        <MemoizedPayPalButtons
          forceReRender={[amount, language]}
          createOrder={(data, actions) => {
            console.log("Creating PayPal order with amount:", language === 'en' ? convertedAmount.toFixed(2) : Math.ceil(convertedAmount));
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: language === 'en' ? convertedAmount.toFixed(2) : Math.ceil(convertedAmount).toString(),
                    currency_code: currencyCode
                  },
                  description: "IRUTOMO予約手数料"
                }
              ],
              application_context: {
                shipping_preference: 'NO_SHIPPING'
              }
            });
          }}
          onApprove={(data, actions) => {
            console.log("Payment approved: ", data);
            if (actions.order) {
              return actions.order.capture().then((details) => {
                console.log("Payment completed: ", details);
                onComplete();
                return details;
              });
            } else {
              console.error("Order actions not available");
              setError(`${language === 'ko' ? '결제 처리 중 오류가 발생했습니다.' : language === 'ja' ? '支払い処理中にエラーが発生しました。' : 'An error occurred during payment processing.'}`);
              return Promise.reject("Order actions not available");
            }
          }}
          onError={(err: any) => {
            console.error('PayPal Error:', err);
            setError(`${language === 'ko' ? '결제 중 오류가 발생했습니다.' : language === 'ja' ? '支払い処理中にエラーが発생しました。' : 'An error occurred during payment processing.'}`);
          }}
          style={buttonStyles}
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="relative">
          {/* ヘッダー部分 */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-[#FF8C00]" />
              {getLocalizedText('お支払い', 'Payment', '결제')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors"
              aria-label={getLocalizedText('閉じる', 'Close', '닫기')}
              title={getLocalizedText('閉じる', 'Close', '닫기')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* タブナビゲーション */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setSelectedTab('paypal')}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                selectedTab === 'paypal'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setSelectedTab('info')}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                selectedTab === 'info'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {getLocalizedText('支払い情報', 'Payment Info', '결제 정보')}
            </button>
          </div>

          {/* コンテンツ部分 */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{error}</p>
                      <button 
                        onClick={() => {
                          setError(null);
                          resetPayPalState();
                        }}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        {getLocalizedText('再試行', 'Try again', '다시 시도')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 選択されたタブのコンテンツ */}
              {selectedTab === 'paypal' ? (
                <motion.div
                  key="paypal-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* 金額表示 */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">
                          {getLocalizedText('支払い金額', 'Payment Amount', '결제 금액')}
                        </p>
                        <div className="flex items-center justify-center">
                          <span className="text-3xl font-bold text-gray-900 mr-1">
                            {getCurrencySymbol(language)}
                          </span>
                          <span className="text-4xl font-bold text-gray-900">
                            {formatAmount(getConvertedAmount(amount, language))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {sdkError && renderAlternativePayment()}

                  {/* PayPal決済ボタン */}
                  <div className="mb-4">
                    {!sdkError && (
                      <PayPalScriptProvider
                        options={{
                          "client-id": paypalClientId,
                          currency: getCurrencyCode(language),
                          intent: "capture",
                          components: "buttons",
                          "disable-funding": "credit,card",
                        }}
                        onError={(err) => {
                          console.error("Failed to load PayPal JS SDK:", err);
                          setSdkError(true);
                          setLoadingPayPal(false);
                        }}
                        onSuccess={() => {
                          console.log("PayPal JS SDK loaded successfully");
                          setSdkReady(true);
                          setLoadingPayPal(false);
                        }}
                      >
                        {loadingPayPal ? (
                          <div className="flex justify-center items-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF8C00]"></div>
                          </div>
                        ) : (
                          renderPayPalButton()
                        )}
                      </PayPalScriptProvider>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-center mt-6 mb-2">
                    <Shield className="w-4 h-4 text-gray-400 mr-2" />
                    <p className="text-xs text-gray-500">
                      {getLocalizedText(
                        'お支払いは安全に処理されます',
                        'Your payment is processed securely',
                        '귀하의 결제는 안전하게 처리됩니다'
                      )}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="info-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {getLocalizedText('お支払い詳細', 'Payment Details', '결제 세부 정보')}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {getLocalizedText('サービス料', 'Service Fee', '서비스 요금')}
                        </span>
                        <span className="font-medium">
                          {getCurrencySymbol(language)}{formatAmount(getConvertedAmount(amount, language))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          {getLocalizedText('税金', 'Taxes', '세금')}
                        </span>
                        <span className="font-medium">
                          {getLocalizedText('込み', 'Included', '포함')}
                        </span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                        <span className="font-medium text-gray-900">
                          {getLocalizedText('合計', 'Total', '합계')}
                        </span>
                        <span className="font-bold text-gray-900">
                          {getCurrencySymbol(language)}{formatAmount(getConvertedAmount(amount, language))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-4">
                    <h3 className="font-medium text-gray-900 mb-2">
                      {getLocalizedText('お支払い方法', 'Payment Method', '결제 방법')}
                    </h3>
                    <p className="text-gray-600">
                      {getLocalizedText(
                        'このサービスではPayPalのみご利用いただけます。',
                        'Only PayPal is available for this service.',
                        '이 서비스에는 PayPal만 사용할 수 있습니다.'
                      )}
                    </p>
                    <div className="flex items-center mt-3">
                      <img 
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" 
                        alt="PayPal Logo" 
                        className="h-6 mr-2"
                      />
                      <span className="text-sm text-gray-600">PayPal</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">
                          {getLocalizedText('安全なお取引', 'Secure Transaction', '안전한 거래')}
                        </h3>
                        <p className="mt-1 text-sm text-blue-700">
                          {getLocalizedText(
                            'お客様の支払い情報は保護されています。すべての取引は安全に処理されます。',
                            'Your payment information is protected. All transactions are secure.',
                            '귀하의 결제 정보는 보호됩니다. 모든 거래는 안전하게 처리됩니다.'
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* フッター部分 */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                {getLocalizedText(
                  'お支払いにより、当社の利用規約に同意したことになります。',
                  'By making payment, you agree to our terms of service.',
                  '결제함으로써 당사의 이용 약관에 동의하게 됩니다.'
                )}
              </p>
              <a
                href="#"
                className="text-xs text-[#FF8C00] hover:text-[#E67E00] inline-flex items-center justify-center"
                rel="noopener noreferrer"
              >
                {getLocalizedText('利用規約を読む', 'Read terms of service', '이용 약관 읽기')}
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}