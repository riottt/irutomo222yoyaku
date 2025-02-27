// このプロジェクトでは決済にPayPalのみを使用することになりました。
// Stripe関連のコードは削除されました。
// すべての決済処理は PayPalButtons コンポーネントを使用しています。
// 詳細は src/components/PaymentModal.tsx を参照してください。

export const createPaymentIntent = async (amount: number) => {
  // PayPalのみを使用するため、この関数は使用されません
  console.warn('createPaymentIntent is deprecated, using PayPal for payments');
  return null;
};