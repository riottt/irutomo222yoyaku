// 本番環境のデータベースにSQLファイルを適用するスクリプト
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数を読み込む
dotenv.config({ path: path.join(__dirname, '..', '.env.production') });

console.log('本番環境のデータベースにSQLファイルを適用します...');

// 接続文字列を取得（トランザクションプーラーを優先的に使用）
const connectionString = process.env.VITE_SUPABASE_TRANSACTION_POOLER || process.env.VITE_SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  console.error('エラー: 環境変数 VITE_SUPABASE_TRANSACTION_POOLER または VITE_SUPABASE_CONNECTION_STRING が設定されていません。');
  process.exit(1);
}

// パスワードを隠した接続文字列をログに出力
const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ':****@');
console.log(`接続文字列: ${maskedConnectionString}`);

// 適用するマイグレーションファイル
const targetMigrations = [
  '20250228080000_add_price_plans.sql',
  '20250301000000_paypal_db_design_production.sql',
  '20250302000000_fix_price_plans.sql'
];

// マイグレーションディレクトリのパス
const migrationsDir = path.join(__dirname, '../supabase/migrations');

// マイグレーションディレクトリが存在するか確認
if (!fs.existsSync(migrationsDir)) {
  console.error(`エラー: マイグレーションディレクトリが見つかりません: ${migrationsDir}`);
  process.exit(1);
}

// マイグレーションファイルが存在するか確認
const migrationFiles = [];
for (const migrationFile of targetMigrations) {
  const filePath = path.join(migrationsDir, migrationFile);
  if (!fs.existsSync(filePath)) {
    console.error(`エラー: マイグレーションファイルが見つかりません: ${filePath}`);
    process.exit(1);
  }
  migrationFiles.push({ name: migrationFile, path: filePath });
}

console.log(`${migrationFiles.length}個のマイグレーションファイルを適用します...`);

// PostgreSQLクライアントを作成
const client = new pg.Client({
  connectionString,
  // プーラー接続のためのオプション
  application_name: 'irutomo-migration',
  statement_timeout: 60000, // 60秒
});

// データベースに接続
client.connect()
  .then(async () => {
    console.log('データベースに接続しました。');

    // migrationsテーブルが存在するか確認し、なければ作成
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
    } catch (err) {
      console.error('migrationsテーブルの作成に失敗しました:', err);
      throw err;
    }

    // 既に適用されたマイグレーションを取得
    const { rows: appliedMigrations } = await client.query(
      'SELECT name FROM migrations ORDER BY id'
    );
    const appliedMigrationNames = appliedMigrations.map(m => m.name);

    // 適用するマイグレーションをフィルタリング
    const migrationsToApply = migrationFiles.filter(
      m => !appliedMigrationNames.includes(m.name)
    );

    if (migrationsToApply.length === 0) {
      console.log('適用するマイグレーションはありません。');
      return;
    }

    console.log(`${migrationsToApply.length}個のマイグレーションを適用します...`);

    // トランザクションを開始
    await client.query('BEGIN');

    try {
      // マイグレーションを順番に適用
      for (const migration of migrationsToApply) {
        console.log(`マイグレーションを適用中: ${migration.name}`);
        const sql = fs.readFileSync(migration.path, 'utf8');
        
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migration.name]
          );
          console.log(`マイグレーションを適用しました: ${migration.name}`);
        } catch (err) {
          console.error(`マイグレーションの適用に失敗しました: ${migration.name}`, err);
          throw err;
        }
      }

      // トランザクションをコミット
      await client.query('COMMIT');
      console.log('すべてのマイグレーションが正常に適用されました。');
    } catch (err) {
      // エラーが発生した場合はロールバック
      await client.query('ROLLBACK');
      console.error('マイグレーションの適用中にエラーが発生したため、ロールバックしました。', err);
      throw err;
    }
  })
  .catch(err => {
    console.error('データベース接続エラー:', err);
  })
  .finally(() => {
    // 接続を閉じる
    client.end().catch(err => {
      console.error('接続を閉じる際にエラーが発生しました:', err);
    });
  }); 