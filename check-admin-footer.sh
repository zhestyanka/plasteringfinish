#!/bin/bash

# 🔍 Скрипт проверки админ панели футера
# Использование: bash check-admin-footer.sh

echo "🔍 Проверяем админ панель футера..."

# Проверяем наличие файлов
echo "📁 Проверяем файлы..."

if [ -f "app/admin/footer/page.tsx" ]; then
    echo "✅ Страница футера найдена: app/admin/footer/page.tsx"
else
    echo "❌ Страница футера не найдена!"
fi

if [ -f "components/admin/AdminSidebar.tsx" ]; then
    echo "✅ Сайдбар админки найден: components/admin/AdminSidebar.tsx"
else
    echo "❌ Сайдбар админки не найден!"
fi

if [ -f "lib/admin/types.ts" ]; then
    echo "✅ Типы админки найдены: lib/admin/types.ts"
else
    echo "❌ Типы админки не найдены!"
fi

if [ -f "components/Footer.tsx" ]; then
    echo "✅ Компонент футера найден: components/Footer.tsx"
else
    echo "❌ Компонент футера не найден!"
fi

if [ -f "data/content.json" ]; then
    echo "✅ Файл контента найден: data/content.json"
    # Проверяем наличие данных футера
    if grep -q "footer" data/content.json; then
        echo "✅ Данные футера найдены в content.json"
    else
        echo "❌ Данные футера не найдены в content.json"
    fi
else
    echo "❌ Файл контента не найден!"
fi

if [ -f "app/api/data/content/route.ts" ]; then
    echo "✅ API контента найден: app/api/data/content/route.ts"
    # Проверяем наличие PUT метода
    if grep -q "PUT" app/api/data/content/route.ts; then
        echo "✅ PUT метод найден в API"
    else
        echo "❌ PUT метод не найден в API"
    fi
else
    echo "❌ API контента не найден!"
fi

echo ""
echo "🌐 Проверяем доступность сайта..."
curl -I http://localhost:3000 2>/dev/null | head -1 || echo "❌ Сайт недоступен"

echo ""
echo "📋 Инструкция по доступу к админ панели футера:"
echo "1. Откройте: http://45.153.188.66:3000/admin"
echo "2. Войдите с логином: admin, паролем: admin123"
echo "3. Перейдите в: Контент → Футер"
echo "4. Отредактируйте нужные поля и сохраните"
echo ""
echo "🔧 Если футер не отображается в меню:"
echo "1. Проверьте файл: components/admin/AdminSidebar.tsx"
echo "2. Убедитесь, что есть пункт 'Футер' в подменю 'Контент'"
echo "3. Перезапустите приложение: pm2 restart plasteringfinish"

