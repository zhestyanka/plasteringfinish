#!/bin/bash

# 🔧 Исправление проблемы с Next.js на сервере
echo "🔧 Исправляем проблему с Next.js на сервере..."

# 1. Останавливаем все процессы
echo "🛑 Останавливаем все процессы..."
pm2 stop all
pm2 delete all

# 2. Переходим в папку проекта
echo "📁 Переходим в папку проекта..."
cd /var/www/plasteringfinish

# 3. Очищаем все кэши и зависимости
echo "🧹 Очищаем все кэши и зависимости..."
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json
rm -rf pnpm-lock.yaml

# 4. Проверяем наличие Node.js и npm
echo "🔍 Проверяем Node.js и npm..."
node --version
npm --version

# 5. Устанавливаем зависимости заново
echo "📦 Устанавливаем зависимости заново..."
npm install --legacy-peer-deps --force

# 6. Проверяем, что Next.js установлен
echo "🔍 Проверяем Next.js..."
ls -la node_modules/.bin/next

# 7. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 8. Проверяем, что сборка прошла успешно
echo "✅ Проверяем сборку..."
ls -la .next

# 9. Запускаем приложение через PM2
echo "🚀 Запускаем приложение через PM2..."
pm2 start ecosystem.config.js
pm2 save

# 10. Проверяем статус
echo "📊 Проверяем статус PM2..."
pm2 status

# 11. Показываем логи
echo "📋 Показываем логи..."
pm2 logs plasteringfinish --lines 10

# 12. Проверяем, что порт 3000 слушается
echo "🔍 Проверяем порт 3000..."
netstat -tlnp | grep :3000

echo ""
echo "🎉 Исправление завершено!"
echo ""
echo "🌐 Сайт должен быть доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "📋 Если сайт все еще недоступен, проверьте:"
echo "1. pm2 status"
echo "2. pm2 logs plasteringfinish"
echo "3. netstat -tlnp | grep :3000"
