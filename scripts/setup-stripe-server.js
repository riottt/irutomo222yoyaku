// ExpressとStripeを使用したシンプルなサーバー
import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// 環境変数のロード
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// dotenvのパスを指定して環境変数をロード
dotenv.config({ path: join(rootDir, '.env') });

// デバッグログ - 環境変数の確認
console.log('環境変数の確認:');
console.log('STRIPE_SERVER_PORT:', process.env.VITE_STRIPE_SERVER_PORT);
console.log('STRIPE_API_URL:', process.env.VITE_STRIPE_API_URL);
console.log('STRIPE_SECRET_KEY が設定されているか:', !!process.env.VITE_STRIPE_SECRET_KEY);
console.log('STRIPE_PUBLIC_KEY が設定されているか:', !!process.env.VITE_STRIPE_PUBLIC_KEY);

const app = express();
const port = process.env.VITE_STRIPE_SERVER_PORT || 3001;

// Stripeの初期化
let stripe;
try {
  stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
  console.log('Stripeが正常に初期化されました');
} catch (error) {
  console.error('Stripeの初期化に失敗しました:', error);
  process.exit(1);
}

// JSONとCORSの設定
app.use(express.json());

// CORSミドルウェアを修正
app.use((req, res, next) => {
  // すべてのオリジンを許可
  res.header('Access-Control-Allow-Origin', '*');
  // 許可するHTTPメソッド
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // 許可するヘッダー
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // プリフライトリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// リクエストログミドルウェア
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // リクエスト詳細をログに残す（開発環境のみ）
  if (process.env.NODE_ENV !== 'production') {
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
    if (req.method !== 'GET') {
      console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
  }
  
  next();
});

// 基本的なルートハンドラ
app.get('/', (req, res) => {
  console.log('ルートエンドポイントにアクセスがありました');
  res.send('Stripeサーバーが実行中です');
});

// デバッグ用のPingエンドポイント
app.get('/ping', (req, res) => {
  console.log('Pingリクエスト受信:', new Date().toISOString());
  // CORS ヘッダーを明示的に設定
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // ステータスコード200で応答
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    server: 'Stripe API Server',
    version: '1.0.0' 
  });
});

// 支払いインテントを作成するエンドポイント
app.post('/create-payment-intent', async (req, res) => {
  try {
    console.group('支払いインテント作成リクエスト');
    console.log('受信時刻:', new Date().toISOString());
    
    // CORS ヘッダーを明示的に設定
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // リクエストボディが存在しない場合
    if (!req.body) {
      console.error('リクエストボディが空です');
      console.groupEnd();
      return res.status(400).json({
        error: 'リクエストボディが空です',
        success: false
      });
    }
    
    console.log('リクエストヘッダー:', req.headers);
    console.log('リクエスト本文:', req.body);
    
    const { amount, metadata = {} } = req.body;
    
    // 金額のバリデーション強化
    console.log('金額検証:', {
      値: amount,
      型: typeof amount,
      数値変換後: Number(amount),
      isNaN: isNaN(Number(amount))
    });
    
    if (!amount) {
      console.error('金額未指定エラー');
      console.groupEnd();
      return res.status(400).json({ 
        error: '金額が指定されていません',
        success: false
      });
    }
    
    // 数値型の確実な変換
    const amountValue = Number(amount);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      console.error('金額不正エラー:', amount);
      console.groupEnd();
      return res.status(400).json({
        error: `金額が正しくありません: ${amount}`,
        success: false,
        receivedValue: amount,
        receivedType: typeof amount
      });
    }
    
    const amountInCents = Math.round(amountValue * 100);
    console.log(`支払いインテント作成開始: ${amountValue}円 (${amountInCents}セント)`);
    
    // Stripe APIリクエスト
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'jpy',
        metadata,
        automatic_payment_methods: { enabled: true },
      });
      
      console.log('支払いインテント作成成功:', paymentIntent.id);
      console.log('クライアントシークレット:', paymentIntent.client_secret.substring(0, 10) + '...');
      
      // レスポンス構造
      const response = { 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        success: true 
      };
      
      console.log('レスポンス送信:', {
        ...response,
        clientSecret: response.clientSecret.substring(0, 10) + '...'
      });
      console.groupEnd();
      
      res.status(200).json(response);
    } catch (stripeError) {
      console.error('Stripe API エラー:', stripeError);
      console.groupEnd();
      res.status(500).json({
        error: stripeError.message,
        errorType: stripeError.type,
        success: false,
        stripeErrorCode: stripeError.code
      });
    }
  } catch (error) {
    console.error('予期せぬエラー:', error);
    console.groupEnd();
    res.status(500).json({ 
      error: '予期せぬエラーが発生しました',
      message: error.message,
      success: false
    });
  }
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error('サーバーエラー:', err);
  res.status(500).json({
    error: 'サーバー内部エラー',
    message: err.message,
    success: false
  });
});

// 未定義のルートへのリクエストを処理
app.use((req, res) => {
  console.log(`不明なエンドポイント: ${req.method} ${req.url}`);
  res.status(404).json({
    error: '要求されたリソースが見つかりません',
    success: false
  });
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Stripeサーバーが起動しました: http://localhost:${port}`);
  console.log(`環境: ${process.env.NODE_ENV || 'development'}`);
}); 