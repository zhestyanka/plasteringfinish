#!/bin/bash

# 🔒 Скрипт настройки SSL сертификата для rovnosteny.ru
# Использование: bash setup-ssl-rovnosteny.sh

echo "🔒 Настраиваем SSL сертификат для: rovnosteny.ru"

# Устанавливаем Certbot
echo "📦 Устанавливаем Certbot..."
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Проверяем что домен доступен
echo "🌐 Проверяем доступность домена..."
if curl -s -I "http://rovnosteny.ru" | grep -q "HTTP"; then
    echo "✅ Домен доступен"
else
    echo "❌ Домен недоступен. Проверьте DNS настройки!"
    echo "Подождите 10-30 минут и попробуйте снова."
    exit 1
fi

# Получаем SSL сертификат
echo "🔐 Получаем SSL сертификат..."
sudo certbot --nginx -d rovnosteny.ru -d www.rovnosteny.ru --non-interactive --agree-tos --email admin@rovnosteny.ru

# Проверяем автообновление
echo "🔄 Настраиваем автообновление сертификата..."
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Проверяем статус
echo "📊 Проверяем статус сертификата..."
sudo certbot certificates

echo ""
echo "✅ SSL сертификат настроен!"
echo "🌐 Сайт доступен по адресу: https://rovnosteny.ru"
echo ""
echo "📋 Информация:"
echo "- Сертификат будет автоматически обновляться"
echo "- Проверить статус: sudo certbot certificates"
echo "- Обновить вручную: sudo certbot renew"
