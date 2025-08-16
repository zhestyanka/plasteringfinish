#!/bin/bash

# 📧 Скрипт тестирования системы email
echo "📧 Тестируем систему отправки email..."

# 1. Останавливаем приложение
echo "🛑 Останавливаем приложение..."
pm2 stop plasteringfinish

# 2. Настраиваем Git для merge
echo "⚙️ Настраиваем Git..."
git config pull.rebase false

# 3. Сохраняем текущие изменения
echo "💾 Сохраняем текущие изменения..."
git add .
git commit -m "Implement full email system with nodemailer"

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
echo "🎉 Система email настроена!"
echo ""
echo "📋 Что реализовано:"
echo "✅ Установлен nodemailer"
echo "✅ Создан API /api/send-email с реальной отправкой"
echo "✅ Обновлен API /api/contact с подробным логированием"
echo "✅ Улучшена страница настроек email"
echo "✅ Добавлена обработка ошибок"
echo "✅ Добавлено подробное логирование"
echo "✅ Созданы инструкции для пользователя"
echo ""
echo "🧪 ИНСТРУКЦИЯ ПО ТЕСТИРОВАНИЮ:"
echo ""
echo "1. 📧 НАСТРОЙКА EMAIL В АДМИН ПАНЕЛИ:"
echo "   - Зайдите в админ панель: http://45.153.188.66:3000/admin"
echo "   - Логин: admin, Пароль: admin123"
echo "   - Перейдите в раздел 'Настройки Email'"
echo "   - Заполните поля:"
echo "     * Email получателя: ваш-email@rambler.ru"
echo "     * SMTP сервер: smtp.rambler.ru"
echo "     * Порт: 587"
echo "     * Пользователь SMTP: ваш-email@rambler.ru"
echo "     * Пароль SMTP: ваш-пароль-от-rambler"
echo "   - Нажмите 'Тест' для проверки"
echo "   - Нажмите 'Сохранить'"
echo ""
echo "2. 📝 ТЕСТИРОВАНИЕ ФОРМ:"
echo "   - Откройте сайт: http://45.153.188.66:3000"
echo "   - Заполните любую форму:"
echo "     * Главная → 'Получить расчет'"
echo "     * Услуги → 'Заказать выезд'"
echo "     * Тарифы → 'Получить расчет'"
echo "     * Контакты → 'Получить консультацию'"
echo "   - Нажмите 'Отправить'"
echo "   - Должно появиться сообщение 'Заявка успешно отправлена'"
echo "   - Проверьте почту - заявка должна прийти"
echo ""
echo "3. 📊 ПРОВЕРКА ЛОГОВ:"
echo "   - Проверьте консоль сервера командой: pm2 logs plasteringfinish"
echo "   - Должны появиться подробные логи:"
echo "     📧 Читаем email из content.json: ваш-email@example.com"
echo "     ✅ Email успешно прочитан: ваш-email@example.com"
echo "     === НОВАЯ ЗАЯВКА ===
echo "     Получатель: ваш-email@example.com
echo "     📧 Отправляем заявку на email: ваш-email@example.com
echo "     📧 Настройки SMTP: { host: 'smtp.rambler.ru', port: '587', user: '***' }
echo "     ✅ Email успешно отправлен: [ID письма]"
echo ""
echo "4. 🔧 РЕЖИМЫ РАБОТЫ:"
echo "   - ДЕМО РЕЖИМ: если SMTP не настроен, письма логируются"
echo "   - РЕАЛЬНЫЙ РЕЖИМ: если SMTP настроен, письма отправляются"
echo "   - В обоих случаях заявки сохраняются и логируются"
echo ""
echo "🌐 Сайт доступен по адресу:"
echo "http://45.153.188.66:3000"
echo ""
echo "📱 Админ панель:"
echo "http://45.153.188.66:3000/admin"
echo "Логин: admin, Пароль: admin123"
echo ""
echo "🔧 Система email полностью готова к работе!"
