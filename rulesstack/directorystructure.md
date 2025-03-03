# ディレクトリ構成

以下のディレクトリ構造に従って実装を行ってください：

```
/
├── src/                          # アプリケーションのソースコード
│   ├── components/               # コンポーネント
│   │   ├── ui/                   # 共通UIコンポーネント
│   │   │   ├── button.tsx        # ボタンコンポーネント
│   │   │   ├── HamburgerMenu.tsx # ハンバーガーメニュー
│   │   │   ├── LanguageToggle.tsx# 言語切替
│   │   │   ├── NavHeader.tsx     # ナビゲーションヘッダー
│   │   │   ├── particle-button.tsx # エフェクト付きボタン
│   │   │   ├── pricing-interaction.tsx # 料金インタラクション
│   │   │   ├── Sidebar.tsx       # サイドバー
│   │   │   └── TubelightNavbar.tsx # ナビゲーションバー
│   │   ├── hooks/                # コンポーネント固有のカスタムフック
│   │   │   ├── use-debounced-dimensions.ts # ディメンション処理
│   │   │   └── use-screen-size.ts # 画面サイズ検知
│   │   ├── AuthModal.tsx         # 認証モーダル
│   │   ├── DirectRequestModal.tsx # 直接リクエストモーダル
│   │   ├── Footer.tsx            # フッター
│   │   ├── Header.tsx            # ヘッダー
│   │   ├── PaymentModal.tsx      # 支払いモーダル（PayPal決済）
│   │   ├── PaymentPlans.tsx      # 料金プラン選択
│   │   ├── ReservationInput.tsx  # 予約入力フォーム
│   │   ├── ReservationModal.tsx  # 予約モーダル
│   │   ├── RestaurantDetails.tsx # レストラン詳細
│   │   └── StoreList.tsx         # 店舗リスト
│   ├── contexts/                 # Reactコンテキスト
│   │   └── LanguageContext.tsx   # 言語コンテキスト
│   ├── lib/                      # ユーティリティと共通ロジック
│   │   ├── emailService.ts       # メール送信機能
│   │   ├── navigation.ts         # ナビゲーション関連
│   │   ├── pricePlanService.ts   # 料金プラン処理
│   │   ├── stripe.ts             # Stripe連携
│   │   ├── supabase.ts           # Supabase接続とクエリ関数
│   │   └── utils.ts              # 共通ユーティリティ
│   ├── pages/                    # ページコンポーネント
│   │   ├── AdminDashboard.tsx    # 管理者ダッシュボード
│   │   ├── Cautions.tsx          # 注意事項
│   │   ├── CommercialTransactions.tsx # 商取引法
│   │   ├── LandingPage.tsx       # ランディングページ
│   │   ├── Options.tsx           # オプション
│   │   ├── PrivacyPolicy.tsx     # プライバシーポリシー
│   │   ├── ReservationSuccess.tsx # 予約成功
│   │   ├── Reviews.tsx           # レビュー
│   │   ├── ServiceIntroduction.tsx # サービス紹介
│   │   └── StoreInfo.tsx         # 店舗情報
│   ├── types/                    # 型定義
│   │   ├── pricePlan.ts          # 料金プラン型
│   │   └── supabase.ts           # Supabase型定義
│   ├── App.tsx                   # アプリケーションのメインコンポーネント
│   ├── index.css                 # グローバルCSS
│   ├── LandingPage.tsx           # メインのランディングページ
│   ├── main.tsx                  # エントリーポイント
│   ├── RestaurantSearch.tsx      # レストラン検索
│   └── vite-env.d.ts             # Vite環境型定義
├── migrations/                   # データベースマイグレーションファイル
│   └── create_price_plans.sql    # 料金プラン作成SQL
├── scripts/                      # スクリプト（DB操作、マイグレーションなど）
│   ├── apply-migrations.js       # マイグレーション適用スクリプト
│   ├── apply-production-sql.js   # 本番環境SQL適用スクリプト
│   ├── apply-specific-migrations.js # 特定マイグレーション適用
│   ├── apply-sql.js              # SQL適用スクリプト
│   ├── generate-supabase-types.js # Supabase型定義生成
│   ├── populate-restaurants.ts   # レストランデータ投入
│   ├── setup-supabase-local.js   # ローカルSupabase設定
│   ├── start-dev.bat             # 開発環境起動バッチ
│   ├── start-dev.ps1             # 開発環境起動PowerShell
│   ├── start-mcp-server.js       # MCPサーバー起動
│   └── start-production-mcp-server.js # 本番MCPサーバー起動
├── supabase/                     # Supabase関連設定
│   ├── migrations/               # Supabaseマイグレーション
│   ├── .temp/                    # 一時ファイル
│   ├── config.toml               # Supabase設定
│   └── docker-compose.yml        # Docker Compose設定
├── public/                       # 静的ファイル
├── dist/                         # ビルド出力ディレクトリ
├── .vscode/                      # VSCode設定
├── rulesstack/                   # プロジェクトルール
├── tips/                         # 開発Tips
├── .env                          # 環境変数（開発環境用）
├── .env.production               # 環境変数（本番環境用）
├── .env.example                  # 環境変数サンプル
├── package.json                  # プロジェクト設定
├── package-lock.json             # パッケージロック
├── vite.config.ts                # Vite設定
├── tsconfig.json                 # TypeScript基本設定
├── tsconfig.app.json             # TypeScriptアプリ設定
├── tsconfig.node.json            # TypeScriptノード設定
├── tailwind.config.js            # Tailwind CSS設定
├── postcss.config.js             # PostCSS設定
├── eslint.config.js              # ESLint設定
└── .gitignore                    # Git除外設定
```

### 配置ルール
- コンポーネント → `src/components/`
- UIコンポーネント → `src/components/ui/`
- カスタムフック → `src/components/hooks/`
- ページコンポーネント → `src/pages/`
- ユーティリティ関数 → `src/lib/`
- Supabase関連 → `src/lib/supabase.ts`
- 型定義 → `src/types/`
- データベースマイグレーション → `migrations/`
- スクリプト → `scripts/`
- Supabase設定 → `supabase/`