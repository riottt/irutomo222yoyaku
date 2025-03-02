import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import { X, AlertCircle, ExternalLink, CreditCard, Check, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalButtons, PayPalScriptProvider, usePayPalScriptReducer } from '@paypal/react-paypal-js';

// PaymentModalの型定義
interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  amount: number;
  language: 'ko' | 'ja' | 'en';
}

// fingerprintLoadedプロパティをwindowに追加するための型拡張
declare global {
  interface Window {
    fingerprintLoaded?: boolean;
    paypalSDKLoaded: boolean | (() => void);
    resourceLoadErrors: string[];
    // PayPalの型を明確に定義
    paypal?: {
      Buttons?: (options: any) => {
        render: (element: HTMLElement) => void;
      };
      [key: string]: any;
    };
  }
}

export default function PaymentModal({ isOpen, onClose, onComplete, amount, language }: PaymentModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loadingPayPal, setLoadingPayPal] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'paypal' | 'info'>('paypal');
  const [scriptLoadFailed, setScriptLoadFailed] = useState(false);
  const [scriptLoadAttempted, setScriptLoadAttempted] = useState(false);
  const [adBlockerDetected, setAdBlockerDetected] = useState(false);
  const adBlockerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fallbackMethodUsed = useRef<boolean>(false);

  // ブラウザで広告ブロッカーが検出されているかチェック
  useEffect(() => {
    if (isOpen && document.body.classList.contains('adblock-detected')) {
      setAdBlockerDetected(true);
      setLoadingPayPal(false);
    }
    if (isOpen && document.body.classList.contains('privacy-blocked')) {
      setScriptLoadFailed(true);
      setLoadingPayPal(false);
    }
  }, [isOpen]);

  // 環境変数からPayPalクライアントIDを取得
  const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sb'; // サンドボックスモードをデフォルトに変更
  
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
  
  // PayPalスクリプトの読み込みリセット関数
  const resetPayPalState = useCallback(() => {
    setSdkReady(false);
    setLoadingPayPal(true);
    setScriptLoadFailed(false);
    setScriptLoadAttempted(false);
    setAdBlockerDetected(false);
    setError(null);
    // 支払い完了状態もリセット
    setPaymentSuccess(false);
    fallbackMethodUsed.current = false;
    
    // タイマーをクリア
    if (adBlockerTimerRef.current) {
      clearTimeout(adBlockerTimerRef.current);
      adBlockerTimerRef.current = null;
    }
  }, []);

  // モーダル表示時にリセット
  useEffect(() => {
    if (isOpen) {
      resetPayPalState();
      
      // デバッグ情報（トラブルシューティング用のみ）
      try {
        console.log('PayPal Client ID (partial):', paypalClientId.substring(0, 10) + '...');
        console.log('Original Amount in JPY:', amount);
        console.log(`Converted Amount in ${getCurrencyCode(language)}:`, getConvertedAmount(amount, language));
      } catch (error) {
        console.warn('デバッグ情報の記録中にエラーが発生しました', error);
      }
      
      // 短いタイムアウトで自動的にローディング状態を解除
      const loadingTimer = setTimeout(() => {
        setLoadingPayPal(false);
      }, 3000);
      
      // SDKの読み込みエラーを検出するためのタイムアウト（短縮）
      const errorTimer = setTimeout(() => {
        if (!sdkReady && !scriptLoadFailed) {
          console.warn('PayPal SDK failed to load within timeout period');
          setScriptLoadFailed(true);
          setLoadingPayPal(false);
        }
      }, 6000);
      
      // コンポーネントのクリーンアップ時にタイマーをクリア
      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(errorTimer);
        if (adBlockerTimerRef.current) {
          clearTimeout(adBlockerTimerRef.current);
          adBlockerTimerRef.current = null;
        }
      };
    }
  }, [isOpen, language, amount, getCurrencyCode, getConvertedAmount, resetPayPalState, sdkReady, scriptLoadFailed]);

  // AdBlocker検出タイマー
  useEffect(() => {
    if (isOpen && loadingPayPal && !scriptLoadFailed) {
      // 既存のタイマーをクリア
      if (adBlockerTimerRef.current) {
        clearTimeout(adBlockerTimerRef.current);
      }
      
      // PayPalの読み込みタイムアウト（広告ブロッカー検出）- より早く検出
      adBlockerTimerRef.current = setTimeout(() => {
        if (loadingPayPal && scriptLoadAttempted) {
          console.warn('Ad blocker detected or PayPal script loading issue');
          setAdBlockerDetected(true);
          setLoadingPayPal(false);
        }
      }, 5000); // 5秒後に広告ブロッカー検出とみなす

      return () => {
        if (adBlockerTimerRef.current) {
          clearTimeout(adBlockerTimerRef.current);
          adBlockerTimerRef.current = null;
        }
      };
    }
  }, [isOpen, loadingPayPal, scriptLoadAttempted, scriptLoadFailed]);

  // 代替支払い方法へのフォールバック
  const activateFallbackPayment = useCallback(() => {
    fallbackMethodUsed.current = true;
    setSelectedTab('info');
    setError(null);
  }, []);

  // スクリプトが読み込めない場合のエラー検出
  useEffect(() => {
    if (isOpen && scriptLoadFailed && !fallbackMethodUsed.current) {
      const fallbackTimer = setTimeout(() => {
        // 5秒後に自動的にフォールバック方法を提案
        if (!sdkReady && scriptLoadFailed) {
          activateFallbackPayment();
        }
      }, 5000);
      
      return () => clearTimeout(fallbackTimer);
    }
  }, [isOpen, scriptLoadFailed, sdkReady, activateFallbackPayment]);

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
            {adBlockerDetected && (
              <div className="mt-3 p-2 bg-white rounded border border-yellow-300">
                <p className="font-medium text-yellow-800 mb-1">
                  {language === 'ko'
                    ? '광고 차단기가 감지되었습니다'
                    : language === 'ja'
                    ? '広告ブロッカーが検出されました'
                    : 'Ad blocker detected'}
                </p>
                <p className="text-xs">
                  {language === 'ko'
                    ? '결제를 진행하려면 이 사이트에 대한 광고 차단기를 일시적으로 비활성화하거나 허용 목록에 추가하세요.'
                    : language === 'ja'
                    ? '決済を続行するには、このサイトの広告ブロッカーを一時的に無効にするか、許可リストに追加してください。'
                    : 'To proceed with payment, temporarily disable your ad blocker for this site or add it to your allowlist.'}
                </p>
          </div>
            )}
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

  // PayPalボタンコンポーネント
  const PayPalButtonsComponent = memo(() => {
    const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

    useEffect(() => {
      // ロード状態の更新
      setLoadingPayPal(isPending);
      setScriptLoadAttempted(true);
      
      // スクリプトが正常に読み込まれた場合
      if (isResolved) {
        setSdkReady(true);
        setLoadingPayPal(false);
        setScriptLoadFailed(false);
        try {
          console.log("PayPal SDK successfully loaded");
          
          // PayPalが本当に利用可能かどうかを確認
          if (typeof window.paypal === 'undefined' || typeof window.paypal.Buttons === 'undefined') {
            console.error("PayPal SDK loaded but window.paypal.Buttons is undefined");
            setScriptLoadFailed(true);
            return;
          }
          
          // 検出フラグを設定
          window.fingerprintLoaded = true;
          // グローバルフラグも設定
          if (typeof window.paypalSDKLoaded === 'function') {
            window.paypalSDKLoaded();
          } else {
            window.paypalSDKLoaded = true;
          }
        } catch (error) {
          // 例外をキャッチ（コンソールアクセスが制限されている場合）
          console.warn("コンソールアクセスエラー:", error);
          setScriptLoadFailed(true);
        }
      }
      
      // スクリプトの読み込みに失敗した場合
      if (isRejected) {
        setScriptLoadFailed(true);
        setLoadingPayPal(false);
        try {
          console.error("Failed to load PayPal SDK");
          // エラーの原因を詳細に記録
          if (window.resourceLoadErrors && window.resourceLoadErrors.length > 0) {
            console.error("リソース読み込みエラー:", window.resourceLoadErrors);
          }
        } catch (error) {
          // 例外をキャッチ
          console.warn("エラーログ記録中にエラー:", error);
        }
      }
    }, [isPending, isResolved, isRejected]);

    // エラー発生時に代替UIへの自動切り替え
    useEffect(() => {
      if (isRejected && !fallbackMethodUsed.current) {
        setTimeout(() => {
          activateFallbackPayment();
        }, 3000);
      }
    }, [isRejected]);

    // 通貨コードと金額を安全に取得
    const currencyCode = getCurrencyCode(language);
    const convertedAmount = getConvertedAmount(amount, language);
    const formattedAmount = language === 'en' ? 
      (Math.round(convertedAmount * 100) / 100).toFixed(2) : 
      Math.round(convertedAmount).toString();

    return (
      <>
        {typeof window.paypal !== 'undefined' && window.paypal && typeof window.paypal.Buttons !== 'undefined' ? (
          <PayPalButtons
            style={{
              layout: "vertical",
              color: "gold" as const,
              shape: "rect" as const,
              label: "paypal" as const,
              height: 45
            }}
            createOrder={(_, actions) => {
              try {
                if (!actions || !actions.order) {
                  console.error("PayPal actions.order is undefined");
                  setError(
                    language === "ja"
                      ? "PayPal APIが正しく読み込まれませんでした。ページを再読み込みしてください。"
                      : language === "ko"
                      ? "PayPal API가 제대로 로드되지 않았습니다. 페이지를 새로 고침하세요."
                      : "PayPal API did not load correctly. Please refresh the page."
                  );
                  return Promise.reject("PayPal API not loaded");
                }
                
                return actions.order.create({
                  intent: "CAPTURE",
                  purchase_units: [
                    {
                      amount: {
                        currency_code: currencyCode,
                        value: formattedAmount,
                      },
                      description: "IRU TOMO Reservation",
                    },
                  ],
                  application_context: {
                    shipping_preference: "NO_SHIPPING",
                    user_action: "PAY_NOW", // ユーザーアクションを明示的に指定
                    return_url: window.location.href, // 必要に応じてリターンURLを設定
                    cancel_url: window.location.href, // キャンセル時のURLを設定
                  },
                });
              } catch (error) {
                console.error("Error creating PayPal order:", error);
                setError(
                  language === "ja"
                    ? "PayPal注文の作成中にエラーが発生しました。ページを再読み込みしてください。"
                    : language === "ko"
                    ? "PayPal 주문 생성 중 오류가 발생했습니다. 페이지를 새로 고침하세요."
                    : "Error occurred while creating PayPal order. Please refresh the page."
                );
                return Promise.reject("Failed to create order");
              }
            }}
            onApprove={(data, actions) => {
              if (!actions || !actions.order) {
                setError(getLocalizedText(
                  '支払い処理中にエラーが発生しました。',
                  'An error occurred during payment processing.',
                  '결제 처리 중 오류가 발생했습니다.'
                ));
                return Promise.resolve();
              }
              
              try {
                return actions.order.capture().then((details) => {
                  try {
                    console.log("Payment completed successfully:", details);
                  } catch {
                    // コンソールアクセスが制限されている場合は無視
                  }
                  // 支払いが完了したらonCompleteを呼び出す
                  setPaymentSuccess(true);
                  if (onComplete) onComplete();
                  
                  // 少し遅延してから閉じる（UI表示のため）
                  setTimeout(() => {
                    onClose();
                  }, 1500);
                });
              } catch (error) {
                console.error("Error capturing PayPal order:", error);
                setError(
                  language === "ja"
                    ? "支払い処理中にエラーが発生しました。もう一度お試しください。"
                    : language === "ko"
                    ? "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요."
                    : "An error occurred during payment processing. Please try again."
                );
                return Promise.resolve();
              }
            }}
            onCancel={() => {
              console.log("Payment cancelled by user");
              // 特にエラーではないのでエラーメッセージは表示しない
            }}
            onError={(err) => {
              try {
                console.error("PayPal Error:", err);
              } catch {
                // コンソールアクセスが制限されている場合は無視
              }
              setError(
                language === "ja"
                  ? "支払い処理中にエラーが発生しました。もう一度お試しください。"
                  : language === "ko"
                  ? "결제 처리 중 오류가 발생했습니다. 다시 시도해주세요."
                  : "An error occurred during payment processing. Please try again."
              );
            }}
          />
        ) : (
          <div className="p-4 bg-yellow-50 rounded-md border border-yellow-200 text-yellow-700">
            {getLocalizedText(
              'PayPalの読み込みに失敗しました。ページを再読み込みするか、「支払い情報」タブから別の方法をお試しください。',
              'Failed to load PayPal. Please refresh the page or try the "Payment Info" tab for alternative methods.',
              'PayPal 로딩에 실패했습니다. 페이지를 새로 고침하거나 "결제 정보" 탭에서 대체 방법을 시도하세요.'
            )}
          </div>
        )}
      </>
    );
  });

  // 支払い完了メッセージを表示
  const renderSuccessMessage = () => {
    if (!paymentSuccess) return null;
    
    return (
      <div className="rounded-md bg-green-50 p-4 border border-green-200 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              {getLocalizedText(
                '支払いが完了しました',
                'Payment completed',
                '결제가 완료되었습니다'
              )}
            </h3>
          </div>
        </div>
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
              onClick={() => {
                if (adBlockerDetected || scriptLoadFailed) {
                  // 広告ブロッカーが検出されている場合は警告を表示
                  setError(
                    language === "ja"
                      ? "広告ブロッカーが有効なためPayPalをロードできません。広告ブロッカーを無効にしてから再試行してください。"
                      : language === "ko"
                      ? "광고 차단기가 활성화되어 있어 PayPal을 로드할 수 없습니다. 광고 차단기를 비활성화한 후 다시 시도하세요."
                      : "Cannot load PayPal because an ad blocker is enabled. Please disable your ad blocker and try again."
                  );
                } else {
                  setSelectedTab('paypal');
                  setError(null);
                }
              }}
              className={`flex-1 py-4 text-center text-sm font-medium transition-colors ${
                selectedTab === 'paypal'
                  ? 'text-[#FF8C00] border-b-2 border-[#FF8C00]'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => {
                setSelectedTab('info');
                setError(null);
              }}
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
                      <div className="mt-2 flex space-x-4">
                        <button 
                          onClick={() => {
                            setError(null);
                            resetPayPalState();
                          }}
                          className="text-sm text-red-600 hover:text-red-800 underline"
                        >
                          {getLocalizedText('再試行', 'Try again', '다시 시도')}
                        </button>
                        <button 
                          onClick={activateFallbackPayment}
                          className="text-sm text-blue-600 hover:text-blue-800 underline"
                        >
                          {getLocalizedText('別の方法', 'Alternative method', '대체 방법')}
                        </button>
                      </div>
                    </div>
            </div>
                </motion.div>
              )}

              {/* 支払い成功メッセージ */}
              {renderSuccessMessage()}

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

                  {(adBlockerDetected || scriptLoadFailed) && renderAlternativePayment()}
                
                  {!adBlockerDetected && !scriptLoadFailed && (
                    <div className="min-h-[150px] flex flex-col justify-center">
                <PayPalScriptProvider 
                  options={{
                    clientId: paypalClientId,
                    currency: getCurrencyCode(language),
                    intent: "capture",
                    // 最小限の設定に簡素化
                    components: "buttons",
                    // 資金源の制限を最小限に
                    disableFunding: "card",
                    // デバッグモードを無効化
                    debug: false,
                    // 「今すぐ支払う」ボタンの表示
                    commit: true
                  }}
                  deferLoading={false} // 即時読み込みを強制
                >
                        {loadingPayPal ? (
                          <div className="flex justify-center items-center h-[150px]">
                            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 text-gray-600">
                              {language === "ja"
                                ? "PayPal読み込み中..."
                                : language === "ko"
                                ? "PayPal 로딩 중..."
                                : "Loading PayPal..."}
                            </p>
                          </div>
                        ) : (
                          <div className="pb-2">
                            <PayPalButtonsComponent />
                            <p className="text-xs text-center mt-3 text-gray-500">
                              {getLocalizedText(
                                '※ボタンが表示されない場合は、ページを再読み込みするか、別の支払い方法タブを試してください',
                                '※If buttons are not visible, please refresh the page or try the alternative payment method tab',
                                '※버튼이 표시되지 않는 경우 페이지를 새로 고침하거나 대체 결제 방법 탭을 시도하세요'
                              )}
                            </p>
                          </div>
                        )}
                </PayPalScriptProvider>
              </div>
                  )}
                  
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
                    {adBlockerDetected || scriptLoadFailed ? (
                      <div>
                        <p className="text-amber-600 font-medium mb-2">
                          {getLocalizedText(
                            'PayPalが読み込めないため、他の支払い方法をご利用ください。',
                            'PayPal cannot be loaded. Please use an alternative payment method.',
                            'PayPal을 로드할 수 없습니다. 대체 결제 방법을 사용하세요.'
                          )}
                        </p>
                        <p className="text-gray-600 mb-3">
                          {getLocalizedText(
                            '当社の担当者にご連絡いただき、予約を完了させることができます：',
                            'You can contact our staff to complete your reservation:',
                            '당사 직원에게 연락하여 예약을 완료할 수 있습니다:'
                          )}
                        </p>
                        <ul className="list-disc pl-5 text-gray-600 text-sm">
                          <li className="mb-1">Email: support@irutomo.com</li>
                          <li className="mb-1">Phone: +81-XX-XXXX-XXXX</li>
                        </ul>
                      </div>
                    ) : (
                      <div>
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
                    )}
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

                  {/* 代替支払いボタン - 広告ブロッカーがある場合 */}
                  {(adBlockerDetected || scriptLoadFailed) && (
                    <div className="mt-4">
                      <button
                        onClick={() => {
                          // メール予約リクエストの処理
                          alert(
                            language === "ja"
                              ? "メールによる予約リクエストを送信しました。担当者から連絡があります。"
                              : language === "ko"
                              ? "이메일로 예약 요청을 보냈습니다. 담당자가 연락드릴 것입니다."
                              : "Reservation request sent via email. Our staff will contact you."
                          );
                          onComplete();
                          onClose();
                        }}
                        className="w-full py-3 bg-[#FF8C00] text-white rounded-lg font-medium hover:bg-[#E67E00] transition-colors"
                      >
                        {getLocalizedText(
                          '予約リクエストを送信',
                          'Send Reservation Request',
                          '예약 요청 보내기'
                        )}
                      </button>
                    </div>
                  )}
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