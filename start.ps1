# CareerOS One-Click Unified Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "         Launching CareerOS Agentic Platform              " -ForegroundColor White
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Start Backend in new process
Write-Host "[1/2] Starting CareerOS FastAPI Backend on port 8000..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "python" -ArgumentList "-m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload" -WorkingDirectory "$PSScriptRoot\backend" -PassThru

Start-Sleep -Seconds 3

# 2. Start Frontend in new process
Write-Host "[2/2] Starting CareerOS React 18 Dashboard on port 5173..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot\frontend" -PassThru

Write-Host ""
Write-Host "CareerOS is now running!" -ForegroundColor Cyan
Write-Host "Dashboard: http://localhost:5173" -ForegroundColor White
Write-Host "API Gateway: http://localhost:8000/docs" -ForegroundColor White
Write-Host "Press Ctrl+C or close terminal to stop." -ForegroundColor Gray

# Wait for exit
try {
    Wait-Process -Id $backendProcess.Id
} finally {
    Stop-Process -Id $backendProcess.Id -ErrorAction SilentlyContinue
    Stop-Process -Id $frontendProcess.Id -ErrorAction SilentlyContinue
}
