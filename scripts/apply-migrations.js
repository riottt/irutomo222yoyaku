// Supabaseのマイグレーションを適用するためのスクリプト
import { config } from 'dotenv';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを使用するための設定
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 環境変数を読み込む
config();

// 環境変数からSupabase情報を取得
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_CONNECTION_STRING = process.env.VITE_SUPABASE_CONNECTION_STRING;

// 環境変数が設定されているか確認
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('環境変数が正しく設定されていません。.envファイルを確認してください。');
  process.exit(1);
}

console.log('Supabaseマイグレーションを適用します...');

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
  
  // Supabase CLIがインストールされているか確認
  try {
    execSync('supabase --version', { stdio: 'ignore' });
  } catch (error) {
    console.error('Supabase CLIがインストールされていません。インストールしてください。');
    console.log('インストール方法: npm install -g supabase');
    process.exit(1);
  }
  
  // マイグレーションを適用
  console.log('Supabase CLIを使用してマイグレーションを適用します...');
  
  // ローカル開発環境の場合
  if (SUPABASE_CONNECTION_STRING && (SUPABASE_CONNECTION_STRING.includes('localhost') || SUPABASE_CONNECTION_STRING.includes('127.0.0.1'))) {
    execSync('supabase db reset', { stdio: 'inherit' });
    console.log('ローカルデータベースにマイグレーションを適用しました。');
  } 
  // 本番環境の場合
  else {
    // 本番環境へのマイグレーション適用（要Supabase CLI設定）
    execSync('supabase db push', { stdio: 'inherit' });
    console.log('本番環境データベースにマイグレーションを適用しました。');
  }
  
  console.log('マイグレーションが正常に適用されました。');
} catch (error) {
  console.error('マイグレーション適用中にエラーが発生しました:', error.message);
  process.exit(1);
} 