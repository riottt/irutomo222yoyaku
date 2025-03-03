// このプロジェクトでは決済にPayPalのみを使用することになりました。
// Stripe関連のコードは削除されました。
// すべての決済処理は PayPalButtons コンポーネントを使用しています。
// 詳細は src/components/PaymentModal.tsx を参照してください。

import { loadStripe } from '@stripe/stripe-js';

// Stripeインスタンスを初期化
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// 支払いインテントを作成
export const createPaymentIntent = async (
  amount: number,
  metadata: Record<string, any> = {}
) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_STRIPE_API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        metadata,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`支払いインテントの作成に失敗しました: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Stripe支払いインテント作成エラー:', error);
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