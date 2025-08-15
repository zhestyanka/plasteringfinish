#!/bin/bash

# 🔧 Скрипт обновления админ панели
echo "🔧 Обновляем админ панель..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Удаляем лишние папки админки
echo "🗑️ Удаляем лишние папки..."
rm -rf app/admin/benefits
rm -rf app/admin/steps
rm -rf app/admin/warehouse
rm -rf app/admin/promotions
rm -rf app/admin/media

# 3. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 4. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 5. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js
pm2 save

# 6. Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

echo ""
echo "🎉 Админ панель обновлена!"
echo ""
echo "📋 Что изменилось:"
echo "✅ Убраны лишние разделы: benefits, steps, warehouse, promotions, media"
echo "✅ Добавлен раздел 'Видео'"
echo "✅ Убран поиск из админ панели"
echo "✅ Навигация приведена в соответствие с сайтом"
echo "✅ Упорядочены разделы по порядку появления на сайте"
echo ""
echo "🌐 Доступ к админ панели:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
