#!/bin/bash

# 🚀 Быстрое исправление проблемы с React версиями
echo "🚀 Быстрое исправление проблемы с React версиями..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем изменения
echo "💾 Сохраняем изменения..."
git add .
git commit -m "Fix React versions to 18.3.1 to prevent crash loop"

# 4. Тянем изменения
echo "⬇️ Тянем изменения..."
git pull origin main --no-rebase

# 5. Удаляем node_modules и package-lock.json
echo "🧹 Очищаем зависимости..."
rm -rf node_modules
rm -rf package-lock.json

# 6. Переустанавливаем зависимости
echo "📦 Переустанавливаем зависимости..."
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

echo ""
echo "🎉 Быстрое исправление завершено!"
echo ""
echo "🌐 Сайт должен быть доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
