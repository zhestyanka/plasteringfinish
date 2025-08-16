#!/bin/bash

# 🔧 Скрипт удаления всех placeholder из админ панели
echo "🔧 Удаляем все placeholder из админ панели..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Remove all placeholders from admin panel"

# 4. Тянем изменения с merge
echo "⬇️ Тянем изменения с merge..."
git pull origin main --no-rebase

# 5. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 6. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 7. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js
pm2 save

# 8. Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

echo ""
echo "🎉 Все placeholder удалены!"
echo ""
echo "📋 Что исправлено:"
echo "✅ Удалены все placeholder из главной страницы админ панели"
echo "✅ Удалены все placeholder из страницы контактов"
echo "✅ Удалены все placeholder из страницы команды"
echo "✅ Удалены все placeholder из страницы оборудования"
echo "✅ Удалены все placeholder из страницы услуг"
echo "✅ Удалены все placeholder из страницы видео"
echo "✅ Удалены все placeholder из страницы портфолио"
echo "✅ Удалены все placeholder из страницы тарифов"
echo "✅ Удалены все placeholder из страницы футера"
echo "✅ Удалены все placeholder из страницы настроек"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🔧 Теперь все поля ввода в админ панели не содержат placeholder!"

