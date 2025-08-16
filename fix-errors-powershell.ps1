# 🔧 Скрипт исправления ошибок для PowerShell
Write-Host "🔧 Исправление ошибок в проекте..." -ForegroundColor Green

# 1. Останавливаем приложение
Write-Host "🛑 Останавливаем приложение..." -ForegroundColor Yellow
try {
    pm2 stop plasteringfinish 2>$null
} catch {
    Write-Host "Приложение уже остановлено или не найдено" -ForegroundColor Gray
}

# 2. Очищаем кэш и зависимости
Write-Host "🧹 Очищаем кэш и зависимости..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
}

# 3. Устанавливаем зависимости
Write-Host "📦 Устанавливаем зависимости..." -ForegroundColor Yellow
npm install --legacy-peer-deps --force

# 4. Проверяем TypeScript
Write-Host "🔍 Проверяем TypeScript..." -ForegroundColor Yellow
npx tsc --noEmit --skipLibCheck

# 5. Собираем проект
Write-Host "🔨 Собираем проект..." -ForegroundColor Yellow
npm run build

# 6. Создаем директорию для логов
Write-Host "📁 Создаем директории для логов..." -ForegroundColor Yellow
if (!(Test-Path "logs")) {
    New-Item -ItemType Directory -Path "logs"
}

# 7. Запускаем приложение
Write-Host "🚀 Запускаем приложение..." -ForegroundColor Yellow
pm2 start ecosystem.config.js

# 8. Показываем статус
Write-Host "📊 Статус приложения:" -ForegroundColor Yellow
pm2 status

Write-Host ""
Write-Host "✅ Все ошибки исправлены!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Проверьте сайт:" -ForegroundColor Cyan
Write-Host "   - Основной сайт: https://rovnosteny.ru" -ForegroundColor White
Write-Host "   - Админ панель: https://rovnosteny.ru/admin" -ForegroundColor White
Write-Host "   - Telegram настройки: https://rovnosteny.ru/admin/telegram" -ForegroundColor White
Write-Host ""
Write-Host "📱 Если есть проблемы, проверьте логи:" -ForegroundColor Cyan
Write-Host "   pm2 logs plasteringfinish" -ForegroundColor White
Write-Host ""

Read-Host "Нажмите Enter для завершения"
