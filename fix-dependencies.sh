#!/bin/bash

# 🔧 Скрипт исправления проблем с зависимостями React
# Использование: bash fix-dependencies.sh

echo "🔧 Исправляем проблемы с зависимостями..."

# Останавливаем приложение если запущено
pm2 stop plasteringfinish 2>/dev/null || true
pm2 delete plasteringfinish 2>/dev/null || true

# Переходим в папку проекта
cd /var/www/plasteringfinish

# Удаляем node_modules и lock файлы
echo "🗑️ Удаляем старые зависимости..."
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml

# Очищаем кэш npm
echo "🧹 Очищаем кэш npm..."
npm cache clean --force

# Обновляем package.json для совместимости
echo "📦 Обновляем package.json..."
cat > package.json << 'EOF'
{
  "name": "my-v0-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.9.1",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "1.2.2",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "1.1.6",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "8.5.1",
    "input-otp": "1.4.1",
    "lucide-react": "^0.454.0",
    "next": "15.2.4",
    "next-themes": "^0.4.4",
    "react": "^18.3.1",
    "react-day-picker": "^8.10.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.54.1",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.0",
    "sonner": "^1.7.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.6",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8.5",
    "tailwindcss": "^3.4.17",
    "typescript": "^5"
  }
}
EOF

# Устанавливаем зависимости с принудительным разрешением
echo "📦 Устанавливаем зависимости..."
npm install --legacy-peer-deps --force

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Создаем папку для логов
mkdir -p logs

# Запускаем приложение
echo "▶️ Запускаем приложение..."
pm2 start ecosystem.config.js

# Сохраняем конфигурацию
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

# Настраиваем автозапуск
echo "🔄 Настраиваем автозапуск..."
pm2 startup

# Ждем запуска
echo "⏳ Ждем запуска приложения..."
sleep 5

echo ""
echo "📊 Статус приложения:"
pm2 status

echo ""
echo "🌐 Проверяем доступность:"
curl -I http://localhost:3000 2>/dev/null || echo "❌ localhost:3000 недоступен"

echo ""
echo "✅ Исправление зависимостей завершено!"
echo "🌐 Сайт должен быть доступен по адресу: http://45.153.188.66:3000"

