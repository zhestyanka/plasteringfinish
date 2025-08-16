#!/bin/bash

# 🔍 Скрипт диагностики проблем с plasteringfinish
# Использование: bash troubleshoot.sh

echo "🔍 Начинаем диагностику plasteringfinish..."

# Проверяем статус PM2
echo "📊 Статус PM2:"
pm2 status

echo ""
echo "📋 Логи приложения (последние 20 строк):"
pm2 logs plasteringfinish --lines 20

echo ""
echo "🌐 Проверяем порты:"
netstat -tulpn | grep :3000

echo ""
echo "🔒 Проверяем firewall:"
sudo ufw status

echo ""
echo "📁 Проверяем папку проекта:"
ls -la /var/www/plasteringfinish/

echo ""
echo "🔧 Проверяем конфигурацию Next.js:"
if [ -f "/var/www/plasteringfinish/next.config.mjs" ]; then
    cat /var/www/plasteringfinish/next.config.mjs
else
    echo "❌ Файл next.config.mjs не найден"
fi

echo ""
echo "📦 Проверяем package.json:"
if [ -f "/var/www/plasteringfinish/package.json" ]; then
    grep -A 5 -B 5 "scripts" /var/www/plasteringfinish/package.json
else
    echo "❌ Файл package.json не найден"
fi

echo ""
echo "🌍 Проверяем доступность localhost:3000:"
curl -I http://localhost:3000 2>/dev/null || echo "❌ localhost:3000 недоступен"

echo ""
echo "💾 Проверяем использование памяти:"
free -h

echo ""
echo "🔍 Проверяем процессы Node.js:"
ps aux | grep node

echo ""
echo "✅ Диагностика завершена!"
echo ""
echo "📋 Возможные решения:"
echo "1. Если localhost:3000 недоступен: pm2 restart plasteringfinish"
echo "2. Если порт 3000 не слушается: проверьте конфигурацию"
echo "3. Если проблемы с памятью: увеличьте swap"
echo "4. Если проблемы с firewall: sudo ufw allow 3000"

