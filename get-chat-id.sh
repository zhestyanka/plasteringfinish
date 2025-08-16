#!/bin/bash

# 🔍 Скрипт для получения Chat ID Telegram бота
# Использование: bash get-chat-id.sh

echo "🔍 Получаем Chat ID для бота @plasteringspb_bot..."

# Проверяем бота
echo "📋 Информация о боте:"
curl -s "https://api.telegram.org/bot8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY/getMe" | jq '.' 2>/dev/null || curl -s "https://api.telegram.org/bot8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY/getMe"

echo ""
echo "📱 Получаем обновления (сообщения):"
echo ""

# Получаем обновления
UPDATES=$(curl -s "https://api.telegram.org/bot8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY/getUpdates")

# Проверяем, есть ли обновления
if echo "$UPDATES" | grep -q '"ok":true' && echo "$UPDATES" | grep -q '"result":\[\]'; then
    echo "❌ Сообщений нет. Отправьте сообщение боту @plasteringspb_bot и попробуйте снова."
    echo ""
    echo "📋 Инструкции:"
    echo "1. Найдите бота @plasteringspb_bot в Telegram"
    echo "2. Отправьте ему любое сообщение"
    echo "3. Запустите этот скрипт снова: bash get-chat-id.sh"
else
    echo "✅ Найдены сообщения!"
    echo ""
    echo "📋 Chat ID:"
    echo "$UPDATES" | grep -o '"chat_id":[0-9-]*' | head -1 | cut -d':' -f2
    echo ""
    echo "📋 Полная информация о чате:"
    echo "$UPDATES" | grep -A 10 -B 5 '"chat":'
fi

echo ""
echo "🔧 Для настройки на сервере:"
echo "1. Скопируйте Chat ID выше"
echo "2. Отредактируйте .env.local:"
echo "   nano .env.local"
echo "3. Замените 'your_chat_id_here' на ваш Chat ID"
echo "4. Перезапустите приложение:"
echo "   pm2 restart plasteringfinish"
