#!/usr/bin/env node

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env.productionファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env.production') });

// 接続文字列を取得（トランザクションプーラーを優先的に使用）
const connectionString = process.env.VITE_SUPABASE_TRANSACTION_POOLER || process.env.VITE_SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  console.error('エラー: 環境変数 VITE_SUPABASE_TRANSACTION_POOLER または VITE_SUPABASE_CONNECTION_STRING が設定されていません。');
  process.exit(1);
}

// パスワードを隠した接続文字列をログに出力
const maskedConnectionString = connectionString.replace(/:[^:@]+@/, ':****@');
console.log('本番環境のSupabase MCPサーバーを起動します...');
console.log(`接続文字列: ${maskedConnectionString}`);

// MCPサーバーを起動
const mcpServer = spawn('npx', [
  '@modelcontextprotocol/server-postgres',
  connectionString
], {
  stdio: 'inherit',
  shell: true
});

mcpServer.on('error', (error) => {
  console.error('MCPサーバーの起動に失敗しました:', error);
});

// プロセス終了時にMCPサーバーも終了させる
process.on('SIGINT', () => {
  console.log('MCPサーバーを停止しています...');
  mcpServer.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('MCPサーバーを停止しています...');
  mcpServer.kill();
  process.exit();
});

console.log('MCPサーバーが起動しました。停止するには Ctrl+C を押してください。'); 