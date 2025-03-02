#!/usr/bin/env node

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESモジュールで__dirnameを取得
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .envファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// 接続文字列を取得
const connectionString = process.env.VITE_SUPABASE_CONNECTION_STRING;

if (!connectionString) {
  console.error('Error: VITE_SUPABASE_CONNECTION_STRING is not defined in .env file');
  process.exit(1);
}

console.log('Starting Supabase MCP server...');
console.log(`Connection string: ${connectionString}`);

// MCPサーバーを起動
const mcpServer = spawn('npx', [
  '@modelcontextprotocol/server-postgres',
  connectionString
], {
  stdio: 'inherit',
  shell: true
});

mcpServer.on('error', (error) => {
  console.error('Failed to start MCP server:', error);
});

// プロセス終了時にMCPサーバーも終了させる
process.on('SIGINT', () => {
  console.log('Stopping MCP server...');
  mcpServer.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Stopping MCP server...');
  mcpServer.kill();
  process.exit();
});

console.log('MCP server started. Press Ctrl+C to stop.'); 