// リクエスト数制限のための簡易カウンター
const requestCounts = {};
const RATE_LIMIT_WINDOW = 60000; // 1分間のウィンドウ
const RATE_LIMIT_MAX = 10; // 1分間に許可する最大リクエスト数

// レート制限を確認するミドルウェア
app.use((req, res, next) => {
  const ip = req.ip || 'unknown';
  const now = Date.now();
  
  // 古いリクエスト記録をクリア
  if (!requestCounts[ip]) {
    requestCounts[ip] = [];
  }
  
  // ウィンドウ外のリクエストを削除
  requestCounts[ip] = requestCounts[ip].filter(time => now - time < RATE_LIMIT_WINDOW);
  
  // リクエスト数チェック
  if (requestCounts[ip].length >= RATE_LIMIT_MAX) {
    console.log(`Rate limit exceeded for ${ip}`);
    return res.status(429).json({
      error: {
        message: 'リクエスト頻度が高すぎます。しばらく待ってから再試行してください。',
        type: 'rate_limit_error'
      }
    });
  }
  
  // 新しいリクエストを記録
  requestCounts[ip].push(now);
  next();
});

// 支払いインテント作成エンドポイント
app.post('/create-payment-intent', async (req, res) => {
  try {
    console.log('Payment intent request received:', req.body);
    const { amount, plan } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: { message: '有効な金額を指定してください' } 
      });
    }
    
    // リトライロジックを追加
    let retries = 0;
    const maxRetries = 3;
    let success = false;
    let paymentIntent;
    let lastError;
    
    while (!success && retries < maxRetries) {
      try {
        // バックオフ（再試行間隔を徐々に増やす）
        if (retries > 0) {
          const delay = retries * 1000; // 1秒、2秒、3秒と待機時間を増やす
          console.log(`リトライ ${retries}回目、${delay}ミリ秒待機...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        
        paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: 'jpy',
          metadata: { plan },
          description: `予約プラン: ${plan}`,
        });
        
        success = true;
      } catch (err) {
        lastError = err;
        
        // レート制限エラーの場合のみリトライ
        if (err.type === 'StripeRateLimitError') {
          console.log(`レート制限エラーが発生しました。リトライします (${retries + 1}/${maxRetries})`);
          retries++;
        } else {
          // その他のエラーはすぐに失敗
          throw err;
        }
      }
    }
    
    // 最大リトライ回数に達しても成功しなかった場合
    if (!success) {
      throw lastError;
    }
    
    console.log('Payment intent created successfully:', paymentIntent.id);
    
    res.send({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (err) {
    console.error('Stripe API Error:', err.type);
    console.error('Stripe Error Message:', err.message);
    
    let errorMessage = '支払い処理の初期化中にエラーが発生しました';
    let statusCode = 500;
    
    if (err.type === 'StripeRateLimitError') {
      errorMessage = 'リクエスト頻度が高すぎます。しばらく待ってから再試行してください。';
      statusCode = 429;
    } else if (err.type === 'StripeAuthenticationError') {
      errorMessage = 'Stripe認証エラー: APIキーを確認してください';
    } else if (err.type === 'StripeInvalidRequestError') {
      errorMessage = '無効なリクエスト: ' + err.message;
      statusCode = 400;
    }
    
    res.status(statusCode).json({ error: { message: errorMessage, type: err.type } });
  }
});

// エラーログ改善
app.use((err, req, res, next) => {
  console.error('サーバーエラー:', err);
  console.error('エラースタック:', err.stack);
  
  res.status(500).json({
    error: {
      message: '予期しないエラーが発生しました',
      type: 'server_error'
    }
  });
}); 