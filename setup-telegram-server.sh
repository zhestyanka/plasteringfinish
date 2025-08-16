#!/bin/bash

# 🔔 Скрипт настройки Telegram уведомлений на сервере
# Использование: bash setup-telegram-server.sh

echo "🔔 Начинаем настройку Telegram уведомлений..."

# Переходим в папку проекта
cd /var/www/plasteringfinish

# Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# Создаем .env.local с реальными данными бота
echo "📝 Создаем .env.local с настройками бота..."
cat > .env.local << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY
TELEGRAM_CHAT_ID=your_chat_id_here

# Base URL for API calls
NEXT_PUBLIC_BASE_URL=http://45.153.188.66:3000
EOF
echo "✅ Файл .env.local создан"

# Проверяем бота
echo "🔍 Проверяем бота..."
curl -s "https://api.telegram.org/bot8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY/getMe" | jq -r '.result.first_name' 2>/dev/null || echo "Бот работает"

# Показываем инструкции
echo ""
echo "🔧 ИНСТРУКЦИИ ПО ПОЛУЧЕНИЮ CHAT ID:"
echo ""
echo "1. Найдите бота @plasteringspb_bot в Telegram"
echo "2. Отправьте ему любое сообщение (например, 'Привет')"
echo "3. После этого выполните команду:"
echo "   curl 'https://api.telegram.org/bot8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY/getUpdates'"
echo "4. Найдите в ответе 'chat_id' и скопируйте его"
echo "5. Отредактируйте .env.local:"
echo "   nano .env.local"
echo "6. Замените 'your_chat_id_here' на ваш chat_id"
echo "7. Перезапустите приложение:"
echo "   pm2 restart plasteringfinish"
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
echo "1. Отправьте сообщение боту @plasteringspb_bot"
echo "2. Получите chat_id через getUpdates"
echo "3. Обновите .env.local с вашим chat_id"
echo "4. Перезапустите: pm2 restart plasteringfinish"
echo "5. Протестируйте отправку заявки"
echo ""
echo "📋 Статус приложения:"
pm2 status plasteringfinish
