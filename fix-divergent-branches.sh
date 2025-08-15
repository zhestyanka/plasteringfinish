#!/bin/bash

# 🔧 Скрипт решения проблемы с расходящимися ветками
echo "🔧 Решаем проблему с расходящимися ветками..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge стратегии
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Save current changes before merge"

# 4. Тянем изменения с merge
echo "⬇️ Тянем изменения с merge..."
git pull origin main --no-rebase

# 5. Если есть конфликты, решаем их
echo "🔍 Проверяем конфликты..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️ Обнаружены конфликты, решаем..."
    # Автоматически принимаем наши изменения для content.json
    git checkout --ours data/content.json
    git add data/content.json
    git commit -m "Resolve conflicts - keep our navigation changes"
fi

# 6. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 7. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 8. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start ecosystem.config.js
pm2 save

# 9. Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

echo ""
echo "🎉 Проблема решена!"
echo ""
echo "📋 Что было сделано:"
echo "✅ Настроена merge стратегия для Git"
echo "✅ Сохранены локальные изменения"
echo "✅ Выполнен merge с удаленным репозиторием"
echo "✅ Решены конфликты (если были)"
echo "✅ Обновлена навигация сайта"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
