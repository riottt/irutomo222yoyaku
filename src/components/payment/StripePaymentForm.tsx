// ... 既存コード ...

// リトライロジックとクールダウンを実装
const fetchPaymentIntent = async () => {
  let attempts = 0;
  const maxAttempts = 3;
  const cooldownPeriod = 2000; // 2秒のクールダウン
  
  setProcessing(true);
  
  while (attempts < maxAttempts) {
    try {
      console.log(`支払いインテントを取得します (試行 ${attempts + 1}/${maxAttempts}): 金額=${selectedPlan.price}, プラン=${selectedPlan.name}`);
      
      const response = await fetch('http://localhost:3001/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          plan: selectedPlan.name,
        }),
      });
      
      // レート制限エラーの場合
      if (response.status === 429) {
        const errorData = await response.json();
        console.warn('レート制限エラー:', errorData.error?.message);
        
        // ユーザーに待機を通知
        setError(`リクエスト頻度が高すぎます。しばらくお待ちください (${attempts + 1}/${maxAttempts})...`);
        
        // クールダウン期間待機
        await new Promise(resolve => setTimeout(resolve, cooldownPeriod * (attempts + 1)));
        attempts++;
        continue;
      }
      
      // その他のエラー
      if (!response.ok) {
        let errorMessage = '支払いの処理に失敗しました';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          console.error('エラーレスポンスの解析に失敗:', e);
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('支払いインテント取得成功:', data.id);
      setProcessing(false);
      return data.clientSecret;
    } catch (error) {
      console.error('Stripe支払いインテント作成エラー:', error);
      
      // 最大試行回数に達した場合
      if (attempts >= maxAttempts - 1) {
        setError(error.message || '支払いインテントの作成に失敗しました。時間をおいて再度お試し 