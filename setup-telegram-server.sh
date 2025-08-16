#!/bin/bash

# 🔔 Скрипт настройки Telegram уведомлений на сервере
# Использование: bash setup-telegram-server.sh

echo "🔔 Начинаем настройку Telegram уведомлений..."

# Переходим в папку проекта
cd /var/www/plasteringfinish

# Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# Создаем .env.local если не существует
if [ ! -f ".env.local" ]; then
    echo "📝 Создаем .env.local..."
    cat > .env.local << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://45.153.188.66:3000
EOF
    echo "✅ Файл .env.local создан"
else
    echo "📝 Файл .env.local уже существует"
fi

# Показываем инструкции
echo ""
echo "🔧 ИНСТРУКЦИИ ПО НАСТРОЙКЕ TELEGRAM:"
echo ""
echo "1. Создайте бота в Telegram:"
echo "   • Откройте @BotFather в Telegram"
echo "   • Отправьте команду: /newbot"
echo "   • Следуйте инструкциям и получите токен"
echo ""
echo "2. Получите Chat ID:"
echo "   • Добавьте бота в чат/группу"
echo "   • Отправьте сообщение в чат"
echo "   • Откройте: https://api.telegram.org/botYOUR_TOKEN/getUpdates"
echo "   • Найдите 'chat_id' в ответе"
echo ""
echo "3. Обновите .env.local:"
echo "   • Замените 'your_bot_token_here' на ваш токен"
echo "   • Замените 'your_chat_id_here' на ваш chat_id"
echo ""
echo "4. Перезапустите приложение:"
echo "   pm2 restart plasteringfinish"
echo ""
echo "5. Протестируйте отправку заявки с сайта"
echo ""

# Пересобираем проект
echo "🔨 Пересобираем проект..."
npm run build

# Запускаем приложение
echo "▶️ Запускаем приложение..."
pm2 start plasteringfinish

# Сохраняем конфигурацию PM2
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

echo ""
echo "✅ Настройка завершена!"
echo "🌐 Сайт доступен по адресу: http://45.153.188.66:3000"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте Telegram бота (см. инструкции выше)"
echo "2. Обновите .env.local с вашими данными"
echo "3. Перезапустите: pm2 restart plasteringfinish"
echo "4. Протестируйте отправку заявки"
echo ""
echo "📋 Статус приложения:"
pm2 status plasteringfinish
