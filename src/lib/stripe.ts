// このプロジェクトでは決済にStripeを使用することになりました。
// 決済処理は StripePaymentForm コンポーネントを使用しています。
// 詳細は src/components/PaymentModal.tsx を参照してください。

import { loadStripe } from '@stripe/stripe-js';

// デバッグ用のロガー
const logger = {
  log: (...args: any[]) => console.log('[Stripe]', ...args),
  error: (...args: any[]) => console.error('[Stripe Error]', ...args),
  info: (...args: any[]) => console.info('[Stripe Info]', ...args),
};

// 環境変数のチェックとロギング
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
const STRIPE_API_URL = import.meta.env.VITE_STRIPE_API_URL;

if (!STRIPE_PUBLIC_KEY) {
  logger.error('VITE_STRIPE_PUBLIC_KEY が設定されていません');
}

if (!STRIPE_API_URL) {
  logger.error('VITE_STRIPE_API_URL が設定されていません');
} else {
  logger.info(`Stripe API URL: ${STRIPE_API_URL}`);
}

// Stripeインスタンスを初期化 (失敗してもエラーをスローせず、ログに記録)
let stripeInstance = null;
try {
  logger.info('Stripeの初期化を開始します');
  stripeInstance = await loadStripe(STRIPE_PUBLIC_KEY);
  logger.info('Stripeの初期化が完了しました');
} catch (error) {
  logger.error('Stripeの初期化に失敗しました:', error);
}

export const stripePromise = stripeInstance;

// 支払いインテントを作成
export const createPaymentIntent = async (
  amount: number,
  metadata: Record<string, any> = {}
) => {
  try {
    logger.info(`支払いインテント作成開始: ${amount}円, メタデータ:`, metadata);
    
    if (!STRIPE_API_URL) {
      throw new Error('Stripe API URLが設定されていません');
    }
    
    const response = await fetch(`${STRIPE_API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        metadata,
      }),
      mode: 'cors',
    });

    logger.info(`支払いインテントAPIレスポンス: ステータス=${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`支払いインテント作成エラー: ${response.status}`, errorText);
      throw new Error(`支払いインテントの作成に失敗しました: ${errorText}`);
    }

    const data = await response.json();
    logger.info('支払いインテント作成成功:', data.paymentIntentId);
    
    if (!data.clientSecret) {
      logger.error('クライアントシークレットがありません:', data);
      throw new Error('クライアントシークレットがレスポンスに含まれていません');
    }

    return data;
  } catch (error) {
    logger.error('Stripe支払いインテント作成エラー:', error);
    throw error;
  }
};

// 支払い状態を確認
export const checkPaymentStatus = async (paymentIntentId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_STRIPE_API_URL}/payment-status/${paymentIntentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('支払いステータスの確認に失敗しました');
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe支払いステータス確認エラー:', error);
    throw error;
  }
};

// カード支払いを確認する関数
export const confirmCardPayment = async (
  stripe: any,
  clientSecret: string,
  cardElement: any,
  billingDetails: Record<string, any> = {}
) => {
  try {
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: billingDetails,
      },
    });

    return result;
  } catch (error) {
    console.error('カード支払い確認エラー:', error);
    throw error;
  }
};

// デバッグ用のヘルパー関数
export const testStripeConnection = async () => {
  try {
    logger.info('Stripe接続テスト開始');
    
    // 環境変数確認
    logger.info('環境変数確認:', {
      API_URL: STRIPE_API_URL,
      PUBLIC_KEY_SET: !!STRIPE_PUBLIC_KEY,
    });
    
    // サーバーへの単純なPINGリクエスト
    const pingResponse = await fetch(`${STRIPE_API_URL}/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!pingResponse.ok) {
      const errorText = await pingResponse.text();
      logger.error(`接続テスト失敗: ${pingResponse.status}`, errorText);
      return {
        success: false,
        status: pingResponse.status,
        message: errorText
      };
    }
    
    // 少額のテスト支払いインテント
    const testResponse = await fetch(`${STRIPE_API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 100,
        metadata: { test: true }
      }),
    });
    
    const testResult = await testResponse.json();
    logger.info('接続テスト結果:', testResult);
    
    return {
      success: true,
      pingStatus: pingResponse.status,
      testResult
    };
  } catch (error) {
    logger.error('接続テストエラー:', error);
    return {
      success: false,
      error: error.message
    };
  }
};