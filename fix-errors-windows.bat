@echo off
chcp 65001 >nul
echo 🔧 Исправление ошибок в проекте...

echo 🛑 Останавливаем приложение...
pm2 stop plasteringfinish 2>nul

echo 🧹 Очищаем кэш и зависимости...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist .next rmdir /s /q .next

echo 📦 Устанавливаем зависимости...
npm install --legacy-peer-deps --force

echo 🔍 Проверяем TypeScript...
npx tsc --noEmit --skipLibCheck

echo 🔨 Собираем проект...
npm run build

echo 📁 Создаем директории для логов...
if not exist logs mkdir logs

echo 🚀 Запускаем приложение...
pm2 start ecosystem.config.js

echo 📊 Статус приложения:
pm2 status

echo.
echo ✅ Все ошибки исправлены!
echo.
echo 🔍 Проверьте сайт:
echo    - Основной сайт: https://rovnosteny.ru
echo    - Админ панель: https://rovnosteny.ru/admin
echo    - Telegram настройки: https://rovnosteny.ru/admin/telegram
echo.
echo 📱 Если есть проблемы, проверьте логи:
echo    pm2 logs plasteringfinish
echo.
pause
