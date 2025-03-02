// SQLファイルを直接PostgreSQLに適用するためのスクリプト
import { config } from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pg from 'pg';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数を読み込む
config();

// 接続文字列を取得
const connectionString = process.env.VITE_SUPABASE_CONNECTION_STRING || 'postgresql://postgres:postgres@localhost:54322/postgres';

console.log('SQLファイルを適用します...');
console.log('接続文字列:', connectionString);

async function applyMigrations() {
  try {
    // マイグレーションディレクトリのパス
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    
    // マイグレーションディレクトリが存在するか確認
    if (!fs.existsSync(migrationsDir)) {
      console.error('マイグレーションディレクトリが見つかりません:', migrationsDir);
      process.exit(1);
    }
    
    // マイグレーションファイルの一覧を取得
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // ファイル名でソート
    
    if (migrationFiles.length === 0) {
      console.log('適用するマイグレーションファイルがありません。');
      process.exit(0);
    }
    
    console.log(`${migrationFiles.length}個のマイグレーションファイルを適用します...`);
    
    // PostgreSQLクライアントを作成
    const client = new pg.Client({
      connectionString: connectionString
    });
    
    // データベースに接続
    try {
      await client.connect();
      console.log('データベースに接続しました。');
    } catch (error) {
      console.error('データベース接続エラー:', error.message);
      console.error('詳細:', error);
      process.exit(1);
    }
    
    // マイグレーションテーブルが存在するか確認
    try {
      const checkTableResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'migrations'
        );
      `);
      
      // マイグレーションテーブルが存在しない場合は作成
      if (!checkTableResult.rows[0].exists) {
        console.log('migrationsテーブルを作成します...');
        await client.query(`
          CREATE TABLE migrations (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
        `);
      }
    } catch (error) {
      console.error('マイグレーションテーブル確認エラー:', error.message);
      console.error('詳細:', error);
      await client.end();
      process.exit(1);
    }
    
    // 適用済みのマイグレーションを取得
    let appliedMigrations = [];
    try {
      const appliedMigrationsResult = await client.query('SELECT name FROM migrations');
      appliedMigrations = appliedMigrationsResult.rows.map(row => row.name);
    } catch (error) {
      console.error('適用済みマイグレーション取得エラー:', error.message);
      console.error('詳細:', error);
      await client.end();
      process.exit(1);
    }
    
    // トランザクションを開始
    try {
      await client.query('BEGIN');
    } catch (error) {
      console.error('トランザクション開始エラー:', error.message);
      console.error('詳細:', error);
      await client.end();
      process.exit(1);
    }
    
    try {
      // 各マイグレーションファイルを適用
      for (const file of migrationFiles) {
        // 既に適用済みの場合はスキップ
        if (appliedMigrations.includes(file)) {
          console.log(`マイグレーション ${file} は既に適用済みです。スキップします。`);
          continue;
        }
        
        console.log(`マイグレーション ${file} を適用しています...`);
        
        // SQLファイルの内容を読み込む
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        // SQLを実行
        try {
          await client.query(sql);
        } catch (error) {
          console.error(`マイグレーション ${file} の実行中にエラーが発生しました:`, error.message);
          console.error('詳細:', error);
          throw error; // エラーを再スローしてトランザクションをロールバック
        }
        
        // マイグレーションテーブルに記録
        try {
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
        } catch (error) {
          console.error(`マイグレーション ${file} の記録中にエラーが発生しました:`, error.message);
          console.error('詳細:', error);
          throw error; // エラーを再スローしてトランザクションをロールバック
        }
        
        console.log(`マイグレーション ${file} を適用しました。`);
      }
      
      // トランザクションをコミット
      await client.query('COMMIT');
      console.log('すべてのマイグレーションが正常に適用されました。');
    } catch (error) {
      // エラーが発生した場合はロールバック
      try {
        await client.query('ROLLBACK');
        console.log('トランザクションをロールバックしました。');
      } catch (rollbackError) {
        console.error('ロールバック中にエラーが発生しました:', rollbackError.message);
      }
      throw error; // エラーを再スロー
    } finally {
      // データベース接続を閉じる
      try {
        await client.end();
        console.log('データベース接続を閉じました。');
      } catch (error) {
        console.error('データベース接続を閉じる際にエラーが発生しました:', error.message);
      }
    }
  } catch (error) {
    console.error('マイグレーション適用中にエラーが発生しました:', error.message);
    if (error.stack) {
      console.error('スタックトレース:', error.stack);
    }
    process.exit(1);
  }
}

// マイグレーションを実行
applyMigrations(); 