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

const app = express();
const port = process.env.STRIPE_SERVER_PORT || 3001;
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);

// JSONとCORSの設定
app.use(express.json());
app.use(cors());

// 基本的なルートハンドラ
app.get('/', (req, res) => {
  res.send('Stripeサーバーが実行中です');
});

// 支払いインテントを作成するエンドポイント
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, metadata = {} } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: '金額が指定されていません' });
    }
    
    // 支払いインテントの作成
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripeは金額をセント単位で扱う
      currency: 'jpy',
      metadata,
      automatic_payment_methods: { enabled: true },
    });
    
    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id 
    });
  } catch (error) {
    console.error('支払いインテント作成エラー:', error);
    res.status(500).json({ error: error.message });
  }
});

// 支払いステータスを確認するエンドポイント
app.get('/payment-status/:paymentIntentId', async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      metadata: paymentIntent.metadata
    });
  } catch (error) {
    console.error('支払いステータス確認エラー:', error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook処理用のエンドポイント
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.VITE_STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    return res.status(400).json({ error: 'Webhook secret is not configured' });
  }
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      webhookSecret
    );
    
    // イベントタイプに応じた処理
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('支払い成功:', paymentIntent.id);
        // ここでデータベース更新などの処理を行う
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('支払い失敗:', failedPayment.id);
        break;
      default:
        console.log(`未処理のイベント: ${event.type}`);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook処理エラー:', error);
    res.status(400).json({ error: error.message });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`Stripeサーバーが起動しました: http://localhost:${port}`);
  console.log(`環境: ${process.env.NODE_ENV || 'development'}`);
}); 