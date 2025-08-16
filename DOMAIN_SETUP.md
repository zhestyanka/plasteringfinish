# 🌐 Настройка домена в Beget для VPS

## 📋 Пошаговая инструкция

### Шаг 1: Настройка DNS в Beget

1. **Войдите в панель управления Beget**
   - Перейдите на https://cp.beget.com
   - Войдите в свой аккаунт

2. **Перейдите в раздел "Домены"**
   - Найдите ваш домен в списке
   - Нажмите кнопку "Управление"

3. **Настройте DNS-записи**
   - Перейдите в раздел "DNS-записи"
   - Удалите все существующие A-записи (если есть)

4. **Добавьте A-запись для основного домена**
   ```
   Тип: A
   Имя: @ (или оставьте пустым)
   Значение: 45.153.188.66
   TTL: 3600
   ```

5. **Добавьте A-запись для www-поддомена**
   ```
   Тип: A
   Имя: www
   Значение: 45.153.188.66
   TTL: 3600
   ```

6. **Сохраните изменения**

### Шаг 2: Настройка Nginx на VPS

Выполните эти команды на вашем VPS:

```bash
# Подключитесь к VPS
ssh root@45.153.188.66

# Скачайте скрипт настройки домена
curl -o setup-domain.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/setup-domain.sh
chmod +x setup-domain.sh

# Запустите настройку (замените на ваш домен)
bash setup-domain.sh ваш-домен.ru
```

### Шаг 3: Проверка DNS

После настройки DNS подождите 10-30 минут и проверьте:

```bash
# Проверьте DNS записи
nslookup ваш-домен.ru
dig ваш-домен.ru

# Проверьте доступность
curl -I http://ваш-домен.ru
```

### Шаг 4: Настройка SSL сертификата (опционально)

```bash
# Скачайте скрипт настройки SSL
curl -o setup-ssl.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/setup-ssl.sh
chmod +x setup-ssl.sh

# Запустите настройку SSL
bash setup-ssl.sh ваш-домен.ru
```

## 🔧 Ручная настройка Nginx

Если скрипт не работает, выполните вручную:

```bash
# Установите Nginx
sudo apt update
sudo apt install -y nginx

# Создайте конфигурацию
sudo nano /etc/nginx/sites-available/plasteringfinish
```

Вставьте конфигурацию:
```nginx
server {
    listen 80;
    server_name ваш-домен.ru www.ваш-домен.ru;

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
    }
}
```

```bash
# Активируйте сайт
sudo ln -s /etc/nginx/sites-available/plasteringfinish /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Проверьте конфигурацию
sudo nginx -t

# Перезапустите Nginx
sudo systemctl restart nginx
```

## 🔒 Ручная настройка SSL

```bash
# Установите Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru

# Настройте автообновление
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## 🔍 Проверка настройки

### Проверьте DNS записи:
```bash
nslookup ваш-домен.ru
dig ваш-домен.ru
```

### Проверьте доступность:
```bash
curl -I http://ваш-домен.ru
curl -I https://ваш-домен.ru
```

### Проверьте логи Nginx:
```bash
sudo tail -f /var/log/nginx/plasteringfinish_access.log
sudo tail -f /var/log/nginx/plasteringfinish_error.log
```

## ⚠️ Важные моменты

1. **Замените `ваш-домен.ru`** на ваш реальный домен
2. **Замените `ВАШ_USERNAME`** на ваше имя пользователя GitHub
3. **Подождите 10-30 минут** после изменения DNS
4. **Убедитесь, что порт 80 открыт** в firewall
5. **Проверьте, что приложение запущено** на порту 3000

## 🔧 Устранение проблем

### Домен не доступен:
```bash
# Проверьте DNS
nslookup ваш-домен.ru

# Проверьте firewall
sudo ufw status

# Проверьте Nginx
sudo systemctl status nginx
```

### SSL не работает:
```bash
# Проверьте сертификат
sudo certbot certificates

# Обновите сертификат
sudo certbot renew
```

### Приложение не отвечает:
```bash
# Проверьте статус PM2
pm2 status

# Проверьте логи
pm2 logs plasteringfinish

# Перезапустите приложение
pm2 restart plasteringfinish
```

## 📞 Результат

После успешной настройки ваш сайт будет доступен по адресам:
- **HTTP:** `http://ваш-домен.ru`
- **HTTPS:** `https://ваш-домен.ru`
- **WWW:** `http://www.ваш-домен.ru` и `https://www.ваш-домен.ru`

