Write-Host "既存のNodeプロセスを終了しています..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name "node" -Force
    Write-Host "既存のNodeプロセスを終了しました。" -ForegroundColor Green
} else {
    Write-Host "実行中のNodeプロセスはありませんでした。" -ForegroundColor Cyan
}

Write-Host "開発サーバーを起動しています..." -ForegroundColor Yellow
Set-Location -Path (Split-Path -Parent $PSScriptRoot)
npm run dev 