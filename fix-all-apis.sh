#!/bin/bash

# 🔧 Скрипт исправления всех API и применения изменений
echo "🔧 Исправляем все API и применяем изменения..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Fix all APIs and add realistic content"

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
echo "🎉 Все изменения применены!"
echo ""
echo "📋 Что исправлено:"
echo "✅ Изменено название вкладки: 'Механизированная штукатурка | Штукатур СПб'"
echo "✅ Созданы API для всех разделов:"
echo "   - /api/data/reviews - Отзывы"
echo "   - /api/data/video - Видео"
echo "   - /api/data/equipment - Оборудование"
echo "   - /api/data/services - Услуги"
echo "   - /api/data/benefits - Преимущества"
echo "   - /api/data/steps - Этапы работы"
echo "   - /api/data/promotions - Акции"
echo "   - /api/data/media - Медиа"
echo "   - /api/data/warehouse - Склады"
echo ""
echo "✅ Добавлен правдоподобный контент во все разделы:"
echo "   - 6 отзывов клиентов"
echo "   - 5 видео материалов"
echo "   - 5 единиц оборудования"
echo "   - 6 услуг компании"
echo "   - 6 преимуществ"
echo "   - 5 этапов работы"
echo "   - 4 акции"
echo "   - 5 медиа материалов"
echo "   - 2 склада"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🔧 Теперь все разделы админ панели должны работать корректно!"
