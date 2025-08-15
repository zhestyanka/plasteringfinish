#!/bin/bash

# 🌐 Скрипт настройки домена rovnosteny.ru для plasteringfinish
# Использование: bash setup-rovnosteny.sh

echo "🌐 Настраиваем домен: rovnosteny.ru"

# Устанавливаем Nginx если не установлен
if ! command -v nginx &> /dev/null; then
    echo "📦 Устанавливаем Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Создаем конфигурацию Nginx
echo "🔧 Создаем конфигурацию Nginx..."
sudo tee /etc/nginx/sites-available/rovnosteny << 'EOF'
server {
    listen 80;
    server_name rovnosteny.ru www.rovnosteny.ru;

    # Логи
    access_log /var/log/nginx/rovnosteny_access.log;
    error_log /var/log/nginx/rovnosteny_error.log;

    # Основное приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Статические файлы
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
}
EOF

# Активируем сайт
echo "🔗 Активируем сайт..."
sudo ln -sf /etc/nginx/sites-available/rovnosteny /etc/nginx/sites-enabled/

# Удаляем дефолтную конфигурацию
sudo rm -f /etc/nginx/sites-enabled/default

# Открываем порт 80
sudo ufw allow 80

# Проверяем конфигурацию
echo "✅ Проверяем конфигурацию Nginx..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Перезапускаем Nginx
    echo "🔄 Перезапускаем Nginx..."
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo ""
    echo "✅ Домен rovnosteny.ru настроен!"
    echo "🌐 Сайт будет доступен по адресу: http://rovnosteny.ru"
    echo ""
    echo "📋 Следующие шаги:"
    echo "1. Подождите 10-30 минут для обновления DNS"
    echo "2. Проверьте доступность: http://rovnosteny.ru"
    echo "3. Для SSL сертификата выполните: sudo certbot --nginx -d rovnosteny.ru -d www.rovnosteny.ru"
else
    echo "❌ Ошибка в конфигурации Nginx!"
    exit 1
fi
