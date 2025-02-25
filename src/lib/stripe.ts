import { loadStripe } from '@stripe/stripe-js';

// Stripeの公開キーを環境変数から取得
const stripePublicKey = 'pk_test_51OvLQbJN0dqwuQGPyqJSxvjJXBDWjG8Vc6gSvlF6ZXZQZQx7x7x7x7x7x';

// 開発環境用のモックStripeクライアント
const mockStripe = {
  elements: () => ({
    create: () => ({
      mount: () => {},
      destroy: () => {},
      on: () => {},
    }),
  }),
  confirmCardPayment: async () => ({
    paymentIntent: { status: 'succeeded' },
  }),
};

// 開発環境ではモックを使用
export const stripePromise = Promise.resolve(mockStripe);

export const createPaymentIntent = async (amount: number) => {
  // 開発環境では固定のclientSecretを返す
  return 'mock_client_secret';
};