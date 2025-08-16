#!/bin/bash

# 🔧 Полное восстановление сайта
echo "🔧 Полное восстановление сайта..."

# 1. Останавливаем все процессы
echo "🛑 Останавливаем все процессы..."
pm2 stop all
pm2 delete all

# 2. Переходим в папку проекта
echo "📁 Переходим в папку проекта..."
cd /var/www/plasteringfinish

# 3. Настраиваем Git
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 4. Обновляем код
echo "⬇️ Обновляем код..."
git pull origin main --no-rebase

# 5. Создаем папку для логов
echo "📁 Создаем папку для логов..."
mkdir -p logs
chmod 755 logs
touch logs/err.log logs/out.log logs/combined.log
chmod 644 logs/*.log

# 6. Очищаем все кэши и зависимости
echo "🧹 Очищаем все кэши и зависимости..."
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json
rm -rf pnpm-lock.yaml

# 7. Проверяем Node.js и npm
echo "🔍 Проверяем Node.js и npm..."
node --version
npm --version

# 8. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 9. Проверяем Next.js
echo "🔍 Проверяем Next.js..."
if [ -f "node_modules/.bin/next" ]; then
    echo "✅ Next.js найден"
    ls -la node_modules/.bin/next
else
    echo "❌ Next.js не найден, устанавливаем глобально..."
    npm install -g next
fi

# 10. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 11. Проверяем сборку
echo "✅ Проверяем сборку..."
if [ -d ".next" ]; then
    echo "✅ Сборка успешна"
    ls -la .next
else
    echo "❌ Сборка не удалась"
    exit 1
fi

# 12. Запускаем через PM2
echo "🚀 Запускаем через PM2..."
pm2 start ecosystem.config.js
pm2 save

# 13. Проверяем статус
echo "📊 Проверяем статус PM2..."
pm2 status

# 14. Ждем немного и проверяем логи
echo "⏳ Ждем 5 секунд..."
sleep 5

echo "📋 Показываем логи..."
pm2 logs plasteringfinish --lines 10

# 15. Проверяем порт
echo "🔍 Проверяем порт 3000..."
netstat -tlnp | grep :3000

# 16. Тестируем доступность
echo "🌐 Тестируем доступность..."
curl -I http://localhost:3000

echo ""
echo "🎉 Полное восстановление завершено!"
echo ""
echo "🌐 Сайт должен быть доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "📋 Команды для проверки:"
echo "pm2 status"
echo "pm2 logs plasteringfinish"
echo "netstat -tlnp | grep :3000"
