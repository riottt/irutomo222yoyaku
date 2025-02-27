@echo off
echo 既存のNodeプロセスを終了しています...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
  echo 既存のNodeプロセスを終了しました。
) else (
  echo 実行中のNodeプロセスはありませんでした。
)

echo 開発サーバーを起動しています...
cd ..
npm run dev 