#!/bin/bash

# 🔧 Скрипт исправления проблем с plasteringfinish
# Использование: bash fix-issues.sh

echo "🔧 Начинаем исправление проблем с plasteringfinish..."

# Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish
pm2 delete plasteringfinish

# Переходим в папку проекта
cd /var/www/plasteringfinish

# Проверяем наличие папки .next
if [ ! -d ".next" ]; then
    echo "📦 Папка .next не найдена, пересобираем проект..."
    npm run build
fi

# Проверяем конфигурацию Next.js
echo "🔧 Проверяем конфигурацию Next.js..."
if [ ! -f "next.config.mjs" ]; then
    echo "❌ Файл next.config.mjs не найден, создаем базовую конфигурацию..."
    cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
EOF
fi

# Проверяем и исправляем ecosystem.config.js
echo "🔧 Проверяем ecosystem.config.js..."
if [ ! -f "ecosystem.config.js" ]; then
    echo "❌ Файл ecosystem.config.js не найден, создаем..."
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'plasteringfinish',
      script: 'npm',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
};
EOF
fi

# Создаем папку для логов
mkdir -p logs

# Проверяем firewall
echo "🔒 Проверяем firewall..."
sudo ufw allow 3000

# Запускаем приложение
echo "▶️ Запускаем приложение..."
pm2 start ecosystem.config.js

# Сохраняем конфигурацию
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

# Настраиваем автозапуск
echo "🔄 Настраиваем автозапуск..."
pm2 startup

# Ждем немного и проверяем статус
echo "⏳ Ждем запуска приложения..."
sleep 5

echo ""
echo "📊 Статус приложения:"
pm2 status

echo ""
echo "🌐 Проверяем доступность:"
curl -I http://localhost:3000 2>/dev/null || echo "❌ localhost:3000 все еще недоступен"

echo ""
echo "📋 Логи приложения:"
pm2 logs plasteringfinish --lines 10

echo ""
echo "✅ Исправление завершено!"
echo "🌐 Сайт должен быть доступен по адресу: http://45.153.188.66:3000"
echo ""
echo "📋 Если проблема остается:"
echo "1. Проверьте логи: pm2 logs plasteringfinish"
echo "2. Проверьте порт: netstat -tulpn | grep :3000"
echo "3. Перезапустите: pm2 restart plasteringfinish"

