# Test Telegram Bot Script
# Usage: .\test-telegram.ps1

Write-Host "Testing Telegram bot..." -ForegroundColor Green

# Bot parameters
$BOT_TOKEN = "8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY"
$CHAT_ID = "6476993703"

# Test message
$message = @{
    chat_id = $CHAT_ID
    text = "Test! Bot is configured and ready to work! All requests from the site will come here."
    parse_mode = "HTML"
} | ConvertTo-Json

# Send message
try {
    $response = Invoke-RestMethod -Uri "https://api.telegram.org/bot$BOT_TOKEN/sendMessage" -Method POST -Body $message -ContentType "application/json"
    
    if ($response.ok) {
        Write-Host "Test message sent successfully!" -ForegroundColor Green
        Write-Host "Check Telegram - you should receive a message" -ForegroundColor Yellow
    } else {
        Write-Host "Error sending: $($response.description)" -ForegroundColor Red
    }
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "For server setup:" -ForegroundColor Cyan
Write-Host "1. Chat ID: $CHAT_ID" -ForegroundColor Yellow
Write-Host "2. Token: $BOT_TOKEN" -ForegroundColor Yellow
Write-Host "3. On server run: bash setup-telegram-server.sh" -ForegroundColor Yellow
Write-Host "4. Update .env.local with Chat ID: $CHAT_ID" -ForegroundColor Yellow
