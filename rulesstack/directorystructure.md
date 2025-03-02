# ディレクトリ構成

以下のディレクトリ構造に従って実装を行ってください：

```
/
├── src/                          # アプリケーションのソースコード
│   ├── components/               # コンポーネント
│   │   ├── ui/                   # 共通UIコンポーネント
│   │   ├── hooks/                # コンポーネント固有のカスタムフック
│   │   ├── PaymentModal.tsx      # 支払いモーダル（PayPal決済）
│   │   ├── ReservationInput.tsx  # 予約入力フォーム
│   │   ├── PaymentPlans.tsx      # 料金プラン選択
│   │   └── ...                   # その他のコンポーネント
│   ├── lib/                      # ユーティリティと共通ロジック
│   │   ├── supabase.ts           # Supabase接続とクエリ関数
│   │   ├── navigation.ts         # ナビゲーション関連
│   │   ├── pricePlanService.ts   # 料金プラン処理
│   │   ├── emailService.ts       # メール送信機能
│   │   └── ...                   # その他のユーティリティ
│   ├── types/                    # 型定義
│   ├── contexts/                 # Reactコンテキスト
│   ├── pages/                    # ページコンポーネント
│   ├── App.tsx                   # アプリケーションのメインコンポーネント
│   ├── main.tsx                  # エントリーポイント
│   └── ...                       # その他のファイル
├── scripts/                      # スクリプト（DB操作、マイグレーションなど）
│   ├── apply-migrations.js       # マイグレーション適用スクリプト
│   ├── apply-production-sql.js   # 本番環境SQL適用スクリプト
│   └── ...                       # その他のスクリプト
├── migrations/                   # データベースマイグレーションファイル
├── supabase/                     # Supabase関連設定
├── public/                       # 静的ファイル
├── .vscode/                      # VSCode設定
├── rulesstack/                   # プロジェクトルール
├── .env                          # 環境変数（開発環境用）
├── .env.production               # 環境変数（本番環境用）
├── package.json                  # プロジェクト設定
├── vite.config.ts                # Vite設定
├── tailwind.config.js            # Tailwind CSS設定
├── tsconfig.json                 # TypeScript設定
├── postcss.config.js             # PostCSS設定
└── ...                           # その他の設定ファイル
```

### 配置ルール
- コンポーネント → `src/components/`
- ページコンポーネント → `src/pages/`
- ユーティリティ関数 → `src/lib/`
- Supabase関連 → `src/lib/supabase.ts`
- 型定義 → `src/types/`
- データベースマイグレーション → `migrations/`
- スクリプト → `scripts/`