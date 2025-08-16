#!/bin/bash

# 🔧 Скрипт исправления проблемы с постоянными перезапусками
echo "🔧 Исправляем проблему с постоянными перезапусками..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish
pm2 delete plasteringfinish

# 2. Очищаем кэш и node_modules
echo "🧹 Очищаем кэш..."
rm -rf .next
rm -rf node_modules
rm -rf package-lock.json

# 3. Переустанавливаем зависимости
echo "📦 Переустанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 4. Проверяем конфигурацию
echo "⚙️ Проверяем конфигурацию..."
cat next.config.mjs

# 5. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 6. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js
pm2 save

# 7. Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

# 8. Показываем логи
echo "📋 Показываем логи..."
pm2 logs plasteringfinish --lines 20

echo ""
echo "🎉 Исправление завершено!"
echo ""
echo "🌐 Сайт должен быть доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
