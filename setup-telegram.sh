#!/bin/bash

# 🔧 Скрипт настройки Telegram интеграции
echo "🔧 Настройка Telegram интеграции..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Add Telegram integration for contact forms"

# 4. Тянем изменения с merge
echo "⬇️ Тянем изменения с merge..."
git pull origin main --no-rebase

# 5. Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 6. Создаем .env.local если не существует
echo "🔐 Настройка переменных окружения..."
if [ ! -f .env.local ]; then
    echo "Создаем .env.local файл..."
    cat > .env.local << EOF
# Telegram Bot Configuration
# Получите токен у @BotFather в Telegram
TELEGRAM_BOT_TOKEN=your_bot_token_here

# Chat ID для получения уведомлений
# Может быть ID чата (123456789) или username канала (@channel_name)
TELEGRAM_CHAT_ID=your_chat_id_here

# Другие переменные окружения
NEXT_PUBLIC_SITE_URL=https://rovnosteny.ru
EOF
    echo "✅ .env.local создан"
else
    echo "📝 .env.local уже существует"
fi

# 7. Показываем инструкцию
echo ""
echo "📋 ИНСТРУКЦИЯ ПО НАСТРОЙКЕ TELEGRAM:"
echo ""
echo "1️⃣ Создайте бота в Telegram:"
echo "   - Найдите @BotFather"
echo "   - Отправьте /newbot"
echo "   - Следуйте инструкциям"
echo "   - Скопируйте полученный токен"
echo ""
echo "2️⃣ Получите Chat ID:"
echo "   - Добавьте бота в нужный чат/канал"
echo "   - Отправьте любое сообщение"
echo "   - Перейдите: https://api.telegram.org/bot[YOUR_TOKEN]/getUpdates"
echo "   - Найдите 'chat':{'id':123456789}"
echo ""
echo "3️⃣ Настройте .env.local:"
echo "   - Замените your_bot_token_here на ваш токен"
echo "   - Замените your_chat_id_here на ваш Chat ID"
echo ""
echo "4️⃣ Соберите и запустите проект:"
echo "   npm run build"
echo "   pm2 start plasteringfinish"
echo ""
echo "5️⃣ Протестируйте в админ панели:"
echo "   - Перейдите в /admin/telegram"
echo "   - Нажмите 'Отправить тестовое сообщение'"
echo ""

# 8. Собираем проект
echo "🔨 Собираем проект..."
npm run build

# 9. Запускаем приложение
echo "🚀 Запускаем приложение..."
pm2 start plasteringfinish

# 10. Показываем статус
echo "📊 Статус приложения:"
pm2 status

echo ""
echo "🎯 Telegram интеграция настроена!"
echo ""
echo "📱 Теперь все заявки с сайта будут отправляться в Telegram"
echo "🔧 Настройте переменные окружения в .env.local"
echo "🧪 Протестируйте в админ панели /admin/telegram"
echo ""
