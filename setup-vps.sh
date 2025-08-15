#!/bin/bash

# 🚀 Скрипт первоначальной настройки VPS для plasteringfinish
# IP: 45.153.188.66

echo "🚀 Начинаем настройку VPS для plasteringfinish..."

# Обновляем систему
echo "📦 Обновляем систему..."
sudo apt update && sudo apt upgrade -y

# Устанавливаем необходимые пакеты
echo "📦 Устанавливаем необходимые пакеты..."
sudo apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Устанавливаем Node.js 18.x
echo "📦 Устанавливаем Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Проверяем версии
echo "✅ Проверяем установленные версии..."
node --version
npm --version

# Устанавливаем PM2
echo "📦 Устанавливаем PM2..."
sudo npm install -g pm2

# Устанавливаем Nginx (опционально, для домена)
echo "📦 Устанавливаем Nginx..."
sudo apt install -y nginx

# Настраиваем firewall
echo "🔒 Настраиваем firewall..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# Создаем папку для проекта
echo "📁 Создаем папку для проекта..."
mkdir -p /var/www/plasteringfinish
cd /var/www/plasteringfinish

echo ""
echo "✅ Настройка VPS завершена!"
echo "🌐 IP адрес: 45.153.188.66"
echo "📁 Проект будет размещен в: /var/www/plasteringfinish"
echo ""
echo "📋 Следующие шаги:"
echo "1. Запустите: bash deploy.sh"
echo "2. Сайт будет доступен по адресу: http://45.153.188.66:3000"
echo ""
