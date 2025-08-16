#!/bin/bash

# 🔧 Скрипт исправления ошибок сайта
echo "🔧 Исправляем ошибки сайта..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Fix site errors: Telegram integration and React versions"

# 4. Тянем изменения с merge
echo "⬇️ Тянем изменения с merge..."
git pull origin main --no-rebase

# 5. Удаляем node_modules и package-lock.json
echo "🗑️ Очищаем зависимости..."
rm -rf node_modules package-lock.json

# 6. Устанавливаем зависимости заново
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 7. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 8. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js
pm2 save

# 9. Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

# 10. Проверяем логи
echo "📋 Проверяем логи..."
pm2 logs plasteringfinish --lines 20

echo ""
echo "🎉 Ошибки исправлены!"
echo ""
echo "🔧 Что исправлено:"
echo "✅ Telegram интеграция:"
echo "   - Убраны неправильные токены по умолчанию"
echo "   - Добавлены проверки на наличие настроек"
echo "   - Безопасная инициализация бота"
echo ""
echo "✅ Версии React:"
echo "   - Понижены с React 19 до React 18.3.1"
echo "   - Исправлены типы для совместимости"
echo "   - Устранены конфликты зависимостей"
echo ""
echo "✅ Безопасность:"
echo "   - Telegram функции не ломают сайт при отсутствии настроек"
echo "   - Graceful fallback для всех Telegram операций"
echo ""
echo "🌐 Сайт должен быть доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🤖 Настройки Telegram (после настройки бота):"
echo "http://45.153.188.66:3000/admin/telegram"
