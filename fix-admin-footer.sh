#!/bin/bash

# 🦶 Скрипт восстановления админ панели футера
echo "🦶 Восстанавливаем админ панель футера..."

# 1. Решаем конфликт Git
echo "🔧 Шаг 1: Решаем конфликт Git..."
if [ -f "setup-rovnosteny.sh" ]; then
    cp setup-rovnosteny.sh setup-rovnosteny.sh.backup
    git rm setup-rovnosteny.sh
    git commit -m "Remove conflicting setup-rovnosteny.sh"
fi

git pull origin main

if [ -f "setup-rovnosteny.sh.backup" ]; then
    cp setup-rovnosteny.sh.backup setup-rovnosteny.sh
fi

# 2. Проверяем и создаем недостающие файлы
echo "📁 Шаг 2: Проверяем файлы..."

# Проверяем типы
if [ ! -f "lib/admin/types.ts" ]; then
    echo "❌ Файл типов не найден!"
    exit 1
fi

# Проверяем API
if [ ! -f "app/api/data/content/route.ts" ]; then
    echo "❌ API файл не найден!"
    exit 1
fi

# Проверяем компонент футера
if [ ! -f "components/Footer.tsx" ]; then
    echo "❌ Компонент футера не найден!"
    exit 1
fi

# Проверяем сайдбар админки
if [ ! -f "components/admin/AdminSidebar.tsx" ]; then
    echo "❌ Сайдбар админки не найден!"
    exit 1
fi

# Проверяем страницу футера
if [ ! -f "app/admin/footer/page.tsx" ]; then
    echo "❌ Страница футера не найдена!"
    exit 1
fi

# 3. Проверяем данные футера в content.json
echo "📄 Шаг 3: Проверяем данные футера..."
if [ -f "data/content.json" ]; then
    if grep -q "footer" data/content.json; then
        echo "✅ Данные футера найдены"
    else
        echo "⚠️ Данные футера не найдены, добавляем..."
        # Добавляем данные футера в content.json
        node -e "
        const fs = require('fs');
        const content = JSON.parse(fs.readFileSync('data/content.json', 'utf8'));
        if (!content.footer) {
            content.footer = {
                copyright: '© 2024 «Штукатур СПб» Все права защищены',
                privacyPolicy: 'Политика конфиденциальности',
                privacyPolicyUrl: '#',
                development: 'Разработка сайта: WebZavod.bz',
                developmentUrl: '#',
                phones: ['8 (812) 986-98-03', '8 (963) 329-65-63'],
                callbackButton: 'Перезвоните мне'
            };
            fs.writeFileSync('data/content.json', JSON.stringify(content, null, 2));
            console.log('Данные футера добавлены');
        }
        "
    fi
else
    echo "❌ Файл content.json не найден!"
    exit 1
fi

# 4. Устанавливаем зависимости
echo "📦 Шаг 4: Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# 5. Собираем проект
echo "🔨 Шаг 5: Собираем проект..."
npm run build

# 6. Перезапускаем приложение
echo "🔄 Шаг 6: Перезапускаем приложение..."
pm2 restart plasteringfinish

# 7. Проверяем статус
echo "✅ Шаг 7: Проверяем статус..."
pm2 status

echo ""
echo "🎉 Админ панель футера восстановлена!"
echo ""
echo "📋 Инструкция по доступу:"
echo "1. Откройте: http://45.153.188.66:3000/admin"
echo "2. Войдите с логином: admin, паролем: admin123"
echo "3. Перейдите в: Контент → Футер"
echo "4. Отредактируйте нужные поля и сохраните"
echo ""
echo "🔍 Проверьте доступность:"
echo "curl -I http://localhost:3000"

