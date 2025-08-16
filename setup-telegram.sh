#!/bin/bash

# 🔧 Скрипт настройки Telegram интеграции
echo "🔧 Настраиваем интеграцию с Telegram..."

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
echo "🎉 Telegram интеграция настроена!"
echo ""
echo "📋 Что добавлено:"
echo "✅ Telegram утилита (lib/telegram.ts):"
echo "   - Отправка заявок в Telegram"
echo "   - Отправка данных калькулятора"
echo "   - Форматирование сообщений"
echo "   - Тестирование подключения"
echo ""
echo "✅ API для заявок (/api/contact/route.ts):"
echo "   - Интеграция с Telegram"
echo "   - Отправка уведомлений"
echo "   - Логирование результатов"
echo ""
echo "✅ API для калькулятора (/api/calculator/route.ts):"
echo "   - Отправка расчетов в Telegram"
echo "   - Валидация данных"
echo "   - Расчет стоимости"
echo ""
echo "✅ API для тестирования (/api/telegram/test/route.ts):"
echo "   - Проверка подключения к боту"
echo "   - Отправка тестовых сообщений"
echo "   - Диагностика ошибок"
echo ""
echo "✅ Страница настройки (/admin/telegram):"
echo "   - Настройка токена бота"
echo "   - Настройка Chat ID"
echo "   - Тестирование подключения"
echo "   - Инструкции по настройке"
echo "   - Примеры сообщений"
echo ""
echo "✅ Обновленный HeroSection:"
echo "   - Отправка данных калькулятора"
echo "   - Интеграция с Telegram API"
echo ""
echo "🔧 Для настройки Telegram:"
echo "1. Создайте бота через @BotFather"
echo "2. Получите токен бота"
echo "3. Добавьте бота в чат/канал"
echo "4. Получите Chat ID"
echo "5. Настройте в админ панели: /admin/telegram"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🤖 Настройки Telegram:"
echo "http://45.153.188.66:3000/admin/telegram"
echo ""
echo "🔧 Теперь все заявки с сайта отправляются в Telegram!"
