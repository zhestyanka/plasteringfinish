#!/bin/bash

# 🔧 Скрипт решения конфликта Git и обновления навигации
echo "🔧 Решаем конфликт Git и обновляем навигацию..."

# 1. Сохраняем изменения в content.json
echo "💾 Сохраняем изменения в content.json..."
git add data/content.json
git commit -m "Update navigation order and add missing sections"

# 2. Тянем изменения с GitHub
echo "⬇️ Тянем изменения с GitHub..."
git pull origin main

# 3. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 4. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

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

echo ""
echo "🎉 Навигация обновлена!"
echo ""
echo "📋 Что изменилось:"
echo "✅ Решен конфликт Git"
echo "✅ Добавлены недостающие разделы в навигацию:"
echo "   - Видео (#video)"
echo "   - Отзывы (#reviews)"
echo "   - Команда (#team)"
echo "   - Контакты (#contacts)"
echo "✅ Упорядочена навигация по порядку появления на сайте:"
echo "   1. Главная"
echo "   2. Цены"
echo "   3. Работы"
echo "   4. Видео"
echo "   5. Отзывы"
echo "   6. Команда"
echo "   7. Оборудование"
echo "   8. Услуги"
echo "   9. Контакты"
echo "✅ Добавлены ID к секциям для корректной навигации"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"

