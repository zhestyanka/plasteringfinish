#!/bin/bash

# 🚀 Скрипт развертывания plasteringfinish на VPS
# Использование: bash deploy.sh

echo "🚀 Начинаем развертывание plasteringfinish..."

# Проверка Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Устанавливаем..."
    
    # Попробуем установить через разные способы
    if command -v snap &> /dev/null; then
        sudo snap install node --classic
    elif command -v apt &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "❌ Не удается установить Node.js автоматически"
        echo "Установите Node.js вручную и запустите скрипт снова"
        exit 1
    fi
fi

# Проверка PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Устанавливаем PM2..."
    npm install -g pm2
fi

# Переходим в папку проекта или клонируем
if [ ! -d "plasteringfinish" ]; then
    echo "📥 Клонируем репозиторий..."
    git clone https://github.com/ЗАМЕНИТЕ_НА_ВАШ_USERNAME/plasteringfinish.git
    cd plasteringfinish
else
    echo "📥 Обновляем существующий репозиторий..."
    cd plasteringfinish
    git pull origin main
fi

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install --force

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Останавливаем предыдущую версию если запущена
echo "🛑 Останавливаем предыдущую версию..."
pm2 stop plasteringfinish || true
pm2 delete plasteringfinish || true

# Запускаем новую версию
echo "▶️ Запускаем приложение..."
pm2 start npm --name "plasteringfinish" -- start

# Сохраняем конфигурацию PM2
echo "💾 Сохраняем конфигурацию PM2..."
pm2 save

# Настраиваем автозапуск
echo "🔄 Настраиваем автозапуск..."
pm2 startup

echo ""
echo "✅ Развертывание завершено!"
echo "🌐 Сайт доступен по адресу: http://ВАШ_IP:3000"
echo ""
echo "📋 Полезные команды:"
echo "  pm2 status          - статус приложений"
echo "  pm2 logs            - логи приложения"  
echo "  pm2 restart plasteringfinish - перезапуск"
echo "  pm2 stop plasteringfinish    - остановка"
echo "" 