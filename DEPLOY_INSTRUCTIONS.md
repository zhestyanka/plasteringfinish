# 🚀 Развертывание plasteringfinish на VPS (45.153.188.66)

## 📋 Быстрый старт

### 1. Подключение к VPS
```bash
ssh root@45.153.188.66
```

### 2. Первоначальная настройка VPS
```bash
# Скачиваем скрипт настройки
curl -o setup-vps.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/setup-vps.sh
chmod +x setup-vps.sh
bash setup-vps.sh
```

### 3. Развертывание приложения
```bash
# Переходим в папку проекта
cd /var/www/plasteringfinish

# Скачиваем скрипт деплоя
curl -o deploy.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/deploy.sh
chmod +x deploy.sh
bash deploy.sh
```

### 4. Проверка
Откройте в браузере: `http://45.153.188.66:3000`

---

## 🛠 Ручная установка

### Шаг 1: Подключение и обновление системы
```bash
ssh root@45.153.188.66
sudo apt update && sudo apt upgrade -y
```

### Шаг 2: Установка Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Должно показать v18.x.x
```

### Шаг 3: Установка PM2
```bash
sudo npm install -g pm2
```

### Шаг 4: Клонирование репозитория
```bash
cd /var/www
git clone https://github.com/ВАШ_USERNAME/plasteringfinish.git
cd plasteringfinish
```

### Шаг 5: Установка зависимостей
```bash
npm install --force
```

### Шаг 6: Сборка проекта
```bash
npm run build
```

### Шаг 7: Запуск через PM2
```bash
# Создаем папку для логов
mkdir -p logs

# Запускаем приложение
pm2 start ecosystem.config.js

# Сохраняем конфигурацию
pm2 save

# Настраиваем автозапуск
pm2 startup
```

---

## 🔧 Управление приложением

### Основные команды PM2
```bash
pm2 status                    # Статус всех приложений
pm2 logs plasteringfinish     # Просмотр логов
pm2 restart plasteringfinish  # Перезапуск
pm2 stop plasteringfinish     # Остановка
pm2 delete plasteringfinish   # Удаление процесса
pm2 monit                     # Мониторинг в реальном времени
```

### Обновление сайта
```bash
cd /var/www/plasteringfinish
git pull origin main          # Скачиваем обновления
npm install --force           # Обновляем зависимости  
npm run build                 # Пересобираем
pm2 restart plasteringfinish  # Перезапускаем
```

---

## 🌐 Настройка домена (опционально)

Если у вас есть домен, который указывает на 45.153.188.66:

### 1. Настройка Nginx
```bash
sudo nano /etc/nginx/sites-available/plasteringfinish
```

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

### 2. Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/plasteringfinish /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL сертификат
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
```

---

## 🔒 Настройка безопасности

### Firewall
```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable
```

### Обновление системы
```bash
# Автоматические обновления безопасности
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 🔧 Решение проблем

### Приложение не запускается
```bash
# Проверяем логи
pm2 logs plasteringfinish

# Проверяем порт
netstat -tulpn | grep :3000

# Перезапускаем
pm2 restart plasteringfinish
```

### Не хватает памяти
```bash
# Проверяем использование памяти
free -h
pm2 monit

# Увеличиваем swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Проблемы с зависимостями
```bash
# Чистим кэш и переустанавливаем
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --force
```

---

## 📊 Мониторинг

### Просмотр логов в реальном времени
```bash
pm2 logs plasteringfinish --lines 50
```

### Мониторинг ресурсов
```bash
pm2 monit
```

### Статистика
```bash
pm2 show plasteringfinish
```

---

## 🔄 Автоматические обновления

Создайте скрипт `update.sh`:
```bash
#!/bin/bash
cd /var/www/plasteringfinish
git pull origin main
npm install --force
npm run build
pm2 restart plasteringfinish
```

Добавьте в crontab для ежедневного обновления:
```bash
crontab -e
# Добавьте строку:
0 3 * * * /var/www/plasteringfinish/update.sh >> /var/log/plasteringfinish-update.log 2>&1
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs plasteringfinish`
2. Убедитесь что порт 3000 не занят
3. Проверьте наличие свободной памяти
4. Перезапустите приложение: `pm2 restart plasteringfinish`

**Сайт будет доступен по адресу: `http://45.153.188.66:3000`**

---

## ⚠️ Важные замечания

1. **Замените `ВАШ_USERNAME`** на ваше реальное имя пользователя GitHub
2. **Убедитесь, что репозиторий публичный** или настройте SSH ключи для приватного репозитория
3. **Проверьте, что порт 3000 открыт** в настройках VPS провайдера
4. **Регулярно обновляйте систему** для безопасности

