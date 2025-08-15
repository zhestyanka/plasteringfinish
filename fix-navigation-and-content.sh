#!/bin/bash

# 🔧 Финальный скрипт исправления навигации и контента
echo "🔧 Исправляем навигацию и контент..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Fix navigation order and add missing content"

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
echo "✅ Исправлен порядок навигации:"
echo "   - Главная → Услуги → Работы → Цены"
echo ""
echo "✅ Исправлены все API для правильного формата данных:"
echo "   - /api/data/team - возвращает { team: [...] }"
echo "   - /api/data/equipment - возвращает { equipment: [...] }"
echo "   - /api/data/services - возвращает { services: [...] }"
echo "   - /api/data/video - возвращает { video: [...] }"
echo "   - /api/data/works - возвращает { works: [...] }"
echo "   - /api/data/reviews - возвращает { textReviews: [...], videoReviews: [...], reviews: [...] }"
echo ""
echo "✅ Исправлены компоненты админ панели:"
echo "   - Команда: правильная загрузка данных"
echo "   - Оборудование: правильная загрузка данных"
echo "   - Услуги: правильная загрузка данных"
echo "   - Видео: правильная загрузка данных"
echo "   - Портфолио: правильная загрузка данных"
echo ""
echo "✅ Исправлен порядок секций на главной странице:"
echo "   - Hero → Services → Works → Pricing → Video → Reviews → Team → Equipment → Contacts"
echo ""
echo "✅ Убраны все placeholder тексты из полей ввода"
echo "✅ Добавлен правдоподобный контент во все разделы"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🔧 Теперь все разделы админ панели должны отображать реальные данные!"
echo "🔧 Навигация работает в правильном порядке!"
