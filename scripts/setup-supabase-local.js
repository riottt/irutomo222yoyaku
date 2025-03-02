// Supabaseのローカル開発環境を設定するためのスクリプト
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

console.log('Supabaseのローカル開発環境を設定します...');

try {
  // プロジェクトのルートディレクトリ
  const projectRoot = path.join(__dirname, '..');
  
  // supabaseディレクトリが存在するか確認
  const supabaseDir = path.join(projectRoot, 'supabase');
  if (!fs.existsSync(supabaseDir)) {
    console.log('supabaseディレクトリを作成します...');
    fs.mkdirSync(supabaseDir, { recursive: true });
  }
  
  // docker-compose.ymlファイルを作成
  const dockerComposeFile = path.join(supabaseDir, 'docker-compose.yml');
  console.log('docker-compose.ymlファイルを作成します...');
  
  const dockerComposeContent = `version: '3'
services:
  postgres:
    image: postgres:14
    ports:
      - "54322:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./migrations:/docker-entrypoint-initdb.d

volumes:
  postgres-data:
`;
  
  fs.writeFileSync(dockerComposeFile, dockerComposeContent);
  console.log('docker-compose.ymlファイルを作成しました。');
  
  // マイグレーションディレクトリが存在するか確認
  const migrationsDir = path.join(supabaseDir, 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.log('migrationsディレクトリを作成します...');
    fs.mkdirSync(migrationsDir, { recursive: true });
  }
  
  // package.jsonにスクリプトを追加
  console.log('package.jsonにスクリプトを追加します...');
  const packageJsonPath = path.join(projectRoot, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // スクリプトが既に存在するか確認
  if (!packageJson.scripts['start-supabase']) {
    packageJson.scripts['start-supabase'] = 'cd supabase && docker-compose up -d';
    packageJson.scripts['stop-supabase'] = 'cd supabase && docker-compose down';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('package.jsonにスクリプトを追加しました。');
  } else {
    console.log('スクリプトは既に存在します。');
  }
  
  console.log('Supabaseのローカル開発環境の設定が完了しました。');
  console.log('以下のコマンドでSupabaseを起動できます:');
  console.log('  npm run start-supabase');
  console.log('以下のコマンドでSupabaseを停止できます:');
  console.log('  npm run stop-supabase');
  
} catch (error) {
  console.error('Supabaseのローカル開発環境の設定中にエラーが発生しました:', error.message);
  process.exit(1);
} 