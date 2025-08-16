#!/bin/bash

# 🔄 Скрипт автоматического обновления plasteringfinish
# Использование: bash update.sh

echo "🔄 Начинаем обновление plasteringfinish..."

# Переходим в папку проекта
cd /var/www/plasteringfinish

# Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# Скачиваем обновления
echo "📥 Скачиваем обновления с GitHub..."
git pull origin main

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --force

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Запускаем приложение
echo "▶️ Запускаем приложение..."
pm2 start plasteringfinish

# Сохраняем конфигурацию PM2
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

echo ""
echo "✅ Обновление завершено!"
echo "🌐 Сайт доступен по адресу: http://45.153.188.66:3000"
echo ""
echo "📋 Статус приложения:"
pm2 status plasteringfinish
echo ""

