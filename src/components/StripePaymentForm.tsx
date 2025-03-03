import { useState, useEffect, useCallback, useRef } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

interface StripePaymentFormProps {
  amount: number;
  onSuccess: (paymentResult: any) => void;
  onError: (error: Error) => void;
  reservationData?: Record<string, any>;
  language: 'ko' | 'ja' | 'en';
}

// 多言語対応テキスト
const localizedText = {
  cardLabel: {
    ja: 'カード情報',
    en: 'Card Information',
    ko: '카드 정보'
  },
  processingPayment: {
    ja: '処理中...',
    en: 'Processing...',
    ko: '처리 중...'
  },
  payAmount: {
    ja: '¥{amount}を支払う',
    en: 'Pay ¥{amount}',
    ko: '¥{amount} 결제하기'
  },
  cardNumberLabel: {
    ja: 'カード番号',
    en: 'Card Number',
    ko: '카드 번호'
  },
  expiryDateLabel: {
    ja: '有効期限',
    en: 'Expiry Date',
    ko: '유효 기간'
  },
  cvcLabel: {
    ja: 'セキュリティコード',
    en: 'CVC',
    ko: '보안 코드'
  },
  zipCodeLabel: {
    ja: '郵便番号',
    en: 'Postal Code',
    ko: '우편 번호'
  },
  securePayment: {
    ja: 'Stripeによる安全な決済',
    en: 'Secure payment by Stripe',
    ko: 'Stripe에 의한 안전한 결제'
  },
  retryPayment: {
    ja: '接続に失敗しました。再試行してください。',
    en: 'Connection failed. Please try again.',
    ko: '연결에 실패했습니다. 다시 시도해주세요.'
  },
  loadingPayment: {
    ja: '決済システムを読み込んでいます...',
    en: 'Loading payment system...',
    ko: '결제 시스템을 로드하고 있습니다...'
  },
  errorMessages: {
    generic: {
      ja: '支払い処理中にエラーが発生しました',
      en: 'An error occurred during payment processing',
      ko: '결제 처리 중 오류가 발생했습니다'
    },
    connectionFailed: {
      ja: 'サーバーに接続できませんでした。インターネット接続を確認してください。CSP設定やブラウザの制限がある場合は、管理者に連絡してください。',
      en: 'Could not connect to server. Please check your internet connection. If CSP settings or browser restrictions are present, please contact the administrator.',
      ko: '서버에 연결할 수 없습니다. 인터넷 연결을 확인하세요. CSP 설정이나 브라우저 제한이 있는 경우 관리자에게 문의하세요.'
    },
    cspError: {
      ja: 'コンテンツセキュリティポリシー(CSP)エラーが発生しました。ブラウザの制限により、決済サーバーへのアクセスがブロックされています。',
      en: 'Content Security Policy (CSP) error occurred. Browser restrictions are blocking access to the payment server.',
      ko: '콘텐츠 보안 정책(CSP) 오류가 발생했습니다. 브라우저 제한으로 인해 결제 서버에 대한 액세스가 차단되었습니다.'
    }
  }
};

// Stripeロゴコンポーネント
const StripeLogo = () => (
  <svg className="h-6" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
    <path d="M59.64 14.28h-8.06v-1.83h8.06v1.83zm0-3.67h-8.06V8.79h8.06v1.82zm-8.06 5.5h8.06v1.83h-8.06v-1.83zm-18.7 1.83c-.9 0-1.54-.15-2-.46-.45-.32-.68-.84-.68-1.55 0-.72.25-1.25.76-1.6.5-.33 1.26-.5 2.28-.5h2.24v-.48c0-.97-.59-1.46-1.77-1.46-.76 0-1.56.18-2.4.55l-.57-1.37c1.03-.48 2.06-.72 3.1-.72 1.17 0 2.06.27 2.65.8.6.53.9 1.35.9 2.45v5.16h-1.78l-.16-.96h-.06c-.62.74-1.46 1.13-2.52 1.13zm.76-1.53c.52 0 .95-.14 1.27-.42.33-.28.5-.63.5-1.04v-.78h-1.5c-.8 0-1.2.33-1.2 1 0 .3.1.53.28.68.18.16.45.23.8.23l-.15.33zm-6.85 1.45v-6.23h-1.88V8.8h1.88v-1.7c0-1.14.3-2 .88-2.57.59-.57 1.4-.85 2.43-.85.57 0 1.04.06 1.43.17v1.7a5.3 5.3 0 0 0-1.12-.13c-.79 0-1.17.42-1.17 1.28v2.1h2.3v1.63h-2.3v6.23h-2.45zm-5.82.08c-1.47 0-2.68-.48-3.65-1.45-.97-.97-1.45-2.21-1.45-3.73 0-1.52.47-2.77 1.42-3.74.95-.97 2.1-1.45 3.47-1.45 1.44 0 2.58.45 3.4 1.34.82.9 1.23 2.08 1.23 3.53v1.07h-7a2.62 2.62 0 0 0 .85 1.74c.48.42 1.05.63 1.7.63.53 0 1.02-.06 1.49-.16.46-.1.94-.25 1.42-.48v1.78c-.43.22-.89.38-1.38.46-.5.08-1.07.13-1.72.13l.22.33zm-.28-8.5c-.5 0-.92.16-1.26.49a2.3 2.3 0 0 0-.62 1.33h3.7c-.01-.58-.18-1.02-.5-1.33a1.55 1.55 0 0 0-1.17-.49h-.15zm-6.65 8.42c-1.38 0-2.47-.4-3.25-1.18-.78-.8-1.17-1.89-1.17-3.29v-6.58h2.45v6.33c0 1.72.7 2.58 2.12 2.58 1.38 0 2.07-.86 2.07-2.58V8.79h2.45v6.58c0 1.4-.4 2.5-1.2 3.29-.8.79-1.9 1.18-3.31 1.18l-.16-.33zM1.64 14.95l1.5-9.3H8.7l-1.48 9.3h1.48L10.18 8.8h3.03l-1.48 6.15h1.47l1.48-6.15h4.54l-3 17.58h-4.54l1.5-9.3H12.2l-1.48 9.3H8.7l1.5-9.3H8.68l-1.48 9.3H5.18l1.48-9.3H5.18l-1.5 9.3h-2.4L0 8.8h6.06l-1.48 6.15h-2.94z" fill="#6772e5" fillRule="evenodd"/>
  </svg>
);

// Stripe API URL定数を明示的に定義
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL || 'http://localhost:3001';
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export default function StripePaymentForm({
  amount,
  onSuccess,
  onError,
  reservationData = {},
  language
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [fetchAttempted, setFetchAttempted] = useState<boolean>(false);

  // 重複リクエスト防止用のデバウンスタイマー
  const debounceTimerRef = useRef<number | null>(null);
  
  // リクエスト識別子
  const requestIdRef = useRef<string>(`req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`);
  
  // 最後のリクエスト時刻
  const lastRequestTimeRef = useRef<number>(0);
  
  // デバウンス関数
  const debounce = useCallback((fn: () => Promise<void>, delay: number) => {
    // 前回のタイマーをクリア
    if (debounceTimerRef.current !== null) {
      window.clearTimeout(debounceTimerRef.current);
      console.log('前回のデバウンスタイマーをクリアしました');
    }
    
    // 最小間隔チェック
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTimeRef.current;
    
    if (lastRequestTimeRef.current > 0 && timeSinceLastRequest < 1000) {
      console.log(`前回のリクエストから${timeSinceLastRequest}ms経過: 最小間隔(1000ms)未満のため、リクエストを遅延します`);
      delay = Math.max(delay, 1000 - timeSinceLastRequest);
    }
    
    // 新しいタイマーを設定
    console.log(`${delay}ms後にリクエストを実行します`);
    debounceTimerRef.current = window.setTimeout(() => {
      lastRequestTimeRef.current = Date.now();
      fn();
    }, delay);
  }, []);

  const getText = (textObj: Record<string, string>) => {
    return textObj[language] || textObj.en;
  };

  // 接続テストフラグ
  const [serverConnectionTested, setServerConnectionTested] = useState(false);
  const [serverConnectionStatus, setServerConnectionStatus] = useState<'untested' | 'success' | 'error'>('untested');

  // サーバー接続テスト関数
  const testServerConnection = useCallback(async () => {
    if (serverConnectionTested) return;
    
    try {
      console.log('サーバー接続テスト開始:', STRIPE_API_URL);
      setServerConnectionStatus('untested');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${STRIPE_API_URL}/ping`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('サーバー接続成功:', await response.json());
        setServerConnectionStatus('success');
      } else {
        console.error('サーバー接続エラー:', response.status, response.statusText);
        setServerConnectionStatus('error');
        throw new Error(`サーバー応答エラー: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('サーバー接続テスト失敗:', error);
      setServerConnectionStatus('error');
      setError(`サーバー接続エラー: ${error.message}`);
      
      if (error.name === 'AbortError') {
        setError('サーバー接続がタイムアウトしました。サーバーが起動しているか確認してください。');
      } else if (error.message.includes('Failed to fetch')) {
        setError('ネットワークエラー: APIサーバーに接続できません。サーバーが起動しているか確認してください。');
      }
    } finally {
      setServerConnectionTested(true);
    }
  }, [serverConnectionTested]);

  // コンポーネントマウント時にサーバー接続テスト
  useEffect(() => {
    testServerConnection();
  }, [testServerConnection]);

  const fetchPaymentIntent = useCallback(async () => {
    if (!amount || amount <= 0) {
      console.error('無効な金額でfetchPaymentIntentが呼ばれました:', amount);
      setError('無効な金額です');
      return;
    }

    // サーバー接続エラーがある場合は処理しない
    if (serverConnectionStatus === 'error') {
      console.error('サーバー接続エラーのため処理をスキップします');
      setError('サーバー接続エラーのため支払いを処理できません。ページを再読み込みしてください。');
      return;
    }

    console.log('fetchPaymentIntent実行 - リクエスト準備:', {
      amount,
      metadata: reservationData,
      apiUrl: STRIPE_API_URL
    });

    try {
      setConnecting(true);
      
      // リクエストデータの準備
      const requestData = {
        amount,
        metadata: {
          ...reservationData,
          requestId: requestIdRef.current,
        }
      };
      
      console.log('支払いインテント取得APIリクエスト送信:', {
        url: `${STRIPE_API_URL}/create-payment-intent`,
        method: 'POST',
        data: requestData
      });

      // タイムアウト付きのAPIリクエスト
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // APIリクエスト
      const response = await fetch(`${STRIPE_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      // レスポンスヘッダーの取得と表示
      const headers: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        headers[key] = value;
      });

      console.log('支払いレスポンスデバッグ');
      console.log('レスポンスステータス:', response.status);
      console.log('レスポンスヘッダー:', headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('支払いインテント作成失敗:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`支払いの準備に失敗しました (${response.status}): ${errorText}`);
      }

      // JSONレスポンスの解析
      const data = await response.json();
      
      // データ検証
      if (!data || typeof data !== 'object') {
        console.error('不正なレスポンスデータ:', data);
        throw new Error('サーバーからの応答が不正です');
      }
      
      if (!data.success) {
        console.error('支払いインテント作成エラー:', data);
        throw new Error(data.error || '支払いの準備に失敗しました');
      }
      
      if (!data.clientSecret) {
        console.error('クライアントシークレットがありません:', data);
        throw new Error('支払い情報が不完全です');
      }

      console.log('成功レスポンス:', data);
      
      // 状態更新
      setClientSecret(data.clientSecret);
      setError('');
      return data;
    } catch (error) {
      console.error('支払いインテント取得中にエラー発生:', error);
      
      // エラーメッセージの詳細化
      if (error.name === 'AbortError') {
        setError('リクエストがタイムアウトしました。ネットワーク接続を確認してください。');
      } else if (error.message.includes('Failed to fetch')) {
        setError('ネットワークエラー: Stripeサーバーに接続できません。サーバーが起動しているか確認してください。');
      } else {
        setError(error.message || '支払い処理の準備中にエラーが発生しました');
      }
      
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [amount, reservationData, serverConnectionStatus]);

  useEffect(() => {
    console.log('useEffect 実行 - 現在の状態:', {
      amount, 
      stripe: !!stripe, 
      elements: !!elements, 
      connecting, 
      clientSecret: clientSecret ? `${clientSecret.substring(0, 10)}...` : null,
      fetchAttempted,
      requestId: requestIdRef.current
    });

    // すでに接続中か、クライアントシークレットがある場合はスキップ
    if (connecting) {
      console.log('すでに接続中のため、リクエストをスキップします');
      return;
    }

    // 金額が無効な場合はスキップ
    if (!amount || amount <= 0) {
      console.log('金額が無効なため、リクエストをスキップします:', amount);
      return;
    }

    // すでにクライアントシークレットがある場合はスキップ
    if (clientSecret) {
      console.log('既にクライアントシークレットがあります:', clientSecret.substring(0, 10) + '...');
      return;
    }

    // すでに取得を試みた場合はスキップ
    if (fetchAttempted) {
      console.log('すでに取得を試みたため、リクエストをスキップします');
      return;
    }

    // 必要なコンポーネントが揃っていない場合はスキップ
    if (!stripe || !elements) {
      console.log('Stripe/Elementsがまだロードされていません');
      return;
    }

    // インテント取得フラグを設定
    setFetchAttempted(true);
    
    // 支払いインテント取得処理をデバウンス
    debounce(async () => {
      try {
        console.log('デバウンス後の支払いインテント取得開始:', {
          amount,
          requestId: requestIdRef.current
        });
        
        await fetchPaymentIntent();
      } catch (error) {
        console.error('支払いインテント取得エラー:', error);
        setError('支払い処理の準備中にエラーが発生しました。');
        setFetchAttempted(false); // 再試行できるようにフラグをリセット
      }
    }, 300); // 300msのデバウンス
    
  }, [stripe, elements, amount, fetchPaymentIntent, debounce]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('カード情報が見つかりません');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: reservationData.name || '',
            email: reservationData.email || '',
            // 必要に応じて住所などの追加情報
          },
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message || getText(localizedText.errorMessages.generic));
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess({
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount / 100,
          paymentMethod: 'stripe'
        });
      } else {
        throw new Error(getText(localizedText.errorMessages.generic));
      }
    } catch (err) {
      console.error('Stripe支払い処理エラー:', err);
      setError((err as Error).message);
      onError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    console.log('手動再試行がクリックされました - 現在の試行回数:', retryCount);
    
    // 接続状態をリセット
    setFetchAttempted(false);
    setConnecting(false);
    setClientSecret('');
    setError('');
    
    // サーバー接続状態をリセット
    setServerConnectionTested(false);
    setServerConnectionStatus('untested');
    
    // 再試行カウントを更新
    setRetryCount(prev => prev + 1);
    
    // サーバー接続テストを再実行
    testServerConnection();
  };

  // サーバー接続中の表示
  if (connecting) {
    console.log('StripePaymentForm: ローディング状態です', { 
      connecting, 
      clientSecret: clientSecret ? clientSecret.substring(0, 10) + '...' : 'なし', 
      stripe: !!stripe, 
      elements: !!elements,
      attemptCount 
    });
    
    return (
      <div className="text-center py-8">
        <div className="animate-pulse flex flex-col items-center justify-center">
          <div className="mb-4">
            <StripeLogo />
          </div>
          <p className="text-gray-600 mt-4">{getText(localizedText.loadingPayment)}</p>
          <div className="mt-2 text-sm text-gray-500">
            試行回数: {attemptCount}
          </div>
          <button 
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            手動で再試行
          </button>
        </div>
      </div>
    );
  }

  // 接続エラー時の表示
  if (error === getText(localizedText.errorMessages.connectionFailed) || error === getText(localizedText.errorMessages.cspError)) {
    return (
      <div className="text-center py-6">
        <div className="mb-4">
          <StripeLogo />
        </div>
        <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
          {error === getText(localizedText.errorMessages.cspError) && (
            <p className="text-sm text-gray-600 mt-2">
              {language === 'ja' 
                ? 'ブラウザの設定またはセキュリティ制限により、決済処理が妨げられています。管理者にお問い合わせください。' 
                : language === 'ko' 
                  ? '브라우저 설정 또는 보안 제한으로 인해 결제 처리가 방해받고 있습니다. 관리자에게 문의하세요.'
                  : 'Browser settings or security restrictions are preventing payment processing. Please contact the administrator.'}
            </p>
          )}
        </div>
        <button
          onClick={handleRetry}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          {getText(localizedText.retryPayment)}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stripe ブランディングヘッダー */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center">
          <StripeLogo />
          <span className="ml-2 text-sm text-gray-600">{getText(localizedText.securePayment)}</span>
        </div>
        <div className="flex items-center">
          <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="ml-1 text-xs text-gray-600">SSL</span>
        </div>
      </div>
    
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && error !== getText(localizedText.errorMessages.connectionFailed) && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            {getText(localizedText.cardLabel)}
          </label>
          <div className="p-4 border rounded-md bg-white shadow-sm">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    iconColor: '#6772e5',
                  },
                  invalid: {
                    color: '#9e2146',
                    iconColor: '#fa755a',
                  },
                },
                hidePostalCode: true,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{getText(localizedText.cardNumberLabel)}</span>
            <span>{getText(localizedText.expiryDateLabel)}</span>
            <span>{getText(localizedText.cvcLabel)}</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!stripe || loading || !clientSecret}
          className={`w-full py-3 px-4 rounded-md ${
            loading || !stripe || !clientSecret
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
        >
          {loading
            ? getText(localizedText.processingPayment)
            : getText(localizedText.payAmount).replace('{amount}', amount.toLocaleString())}
        </button>
        
        {/* カード会社のロゴ */}
        <div className="flex justify-center space-x-2 mt-4">
          <img src="https://js.stripe.com/v3/fingerprinted/img/visa-729c05c240c4bdb47b03ac81d9945bfe.svg" alt="Visa" className="h-8" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg" alt="Mastercard" className="h-8" />
          <img src="https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg" alt="Amex" className="h-8" />
        </div>
        
        <p className="text-xs text-center text-gray-500 mt-4">
          {language === 'ja' 
            ? 'カード情報は安全に暗号化され、当社のサーバーには保存されません。' 
            : language === 'ko' 
              ? '카드 정보는 안전하게 암호화되며 당사 서버에 저장되지 않습니다.'
              : 'Card information is securely encrypted and not stored on our servers.'}
        </p>
      </form>
    </div>
  );
} 