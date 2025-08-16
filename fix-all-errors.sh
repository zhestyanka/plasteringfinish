#!/bin/bash

# 🔧 Скрипт исправления всех ошибок
echo "🔧 Исправление всех ошибок в проекте..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish 2>/dev/null || true

# 2. Очищаем кэш и node_modules
echo "🧹 Очищаем кэш и зависимости..."
rm -rf node_modules package-lock.json .next
rm -rf .next

# 3. Устанавливаем зависимости заново
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 4. Проверяем TypeScript ошибки
echo "🔍 Проверяем TypeScript..."
npx tsc --noEmit --skipLibCheck

# 5. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 6. Создаем директорию для логов если не существует
echo "📁 Создаем директории для логов..."
mkdir -p logs

# 7. Проверяем права доступа
echo "🔐 Проверяем права доступа..."
chmod +x setup-telegram.sh
chmod +x deploy.sh

# 8. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js

# 9. Показываем статус
echo "📊 Статус приложения:"
pm2 status

# 10. Показываем логи
echo "📋 Последние логи:"
pm2 logs plasteringfinish --lines 10

echo ""
echo "✅ Все ошибки исправлены!"
echo ""
echo "🔍 Проверьте сайт:"
echo "   - Основной сайт: https://rovnosteny.ru"
echo "   - Админ панель: https://rovnosteny.ru/admin"
echo "   - Telegram настройки: https://rovnosteny.ru/admin/telegram"
echo ""
echo "📱 Если есть проблемы, проверьте логи:"
echo "   pm2 logs plasteringfinish"
echo ""
