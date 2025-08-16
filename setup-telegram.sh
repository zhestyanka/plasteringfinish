#!/bin/bash

# 🤖 Скрипт настройки Telegram уведомлений
echo "🤖 Настройка Telegram уведомлений для сайта..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Add Telegram notifications for all forms"

# 4. Тянем изменения с merge
echo "⬇️ Тянем изменения с merge..."
git pull origin main --no-rebase

# 5. Создаем файл .env.local если его нет
if [ ! -f .env.local ]; then
    echo "📝 Создаем файл .env.local..."
    cat > .env.local << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
TELEGRAM_CHAT_ID=YOUR_CHAT_ID_HERE

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://45.153.188.66:3000
EOF
    echo "✅ Файл .env.local создан"
    echo ""
    echo "⚠️  ВАЖНО: Отредактируйте файл .env.local и добавьте ваши данные:"
    echo "   - TELEGRAM_BOT_TOKEN=ваш_токен_бота"
    echo "   - TELEGRAM_CHAT_ID=ваш_chat_id"
    echo ""
    echo "📖 Инструкция по получению токена и Chat ID в файле TELEGRAM_SETUP.md"
else
    echo "✅ Файл .env.local уже существует"
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
echo "🎉 Telegram уведомления настроены!"
echo ""
echo "📋 Что добавлено:"
echo "✅ API для отправки в Telegram (/api/telegram)"
echo "✅ Интеграция с контактной формой"
echo "✅ Интеграция с калькулятором"
echo "✅ Красивое форматирование сообщений"
echo "✅ Обработка ошибок"
echo ""
echo "📱 Типы уведомлений:"
echo "🔔 Контактная форма - все данные клиента"
echo "🧮 Калькулятор - расчет стоимости с параметрами"
echo ""
echo "⚙️ Следующие шаги:"
echo "1. Создайте бота через @BotFather"
echo "2. Получите Chat ID через @userinfobot"
echo "3. Отредактируйте .env.local с вашими данными"
echo "4. Перезапустите приложение: pm2 restart plasteringfinish"
echo ""
echo "📖 Подробная инструкция в файле TELEGRAM_SETUP.md"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
