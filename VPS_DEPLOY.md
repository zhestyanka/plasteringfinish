# 🚀 Развертывание сайта plasteringfinish на VPS

## 📋 Быстрый старт

### 1. Подключение к VPS
```bash
ssh root@ВАШ_IP_АДРЕС
```

### 2. Автоматическое развертывание
```bash
# Скачиваем и запускаем скрипт развертывания
curl -o deploy.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/deploy.sh
chmod +x deploy.sh
bash deploy.sh
```

### 3. Проверка
Откройте в браузере: `http://ВАШ_IP:3000`

---

## 🛠 Ручная установка

### Шаг 1: Установка Node.js
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Вариант 1: Через NodeSource (рекомендуется)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Вариант 2: Через snap
sudo snap install node --classic

# Вариант 3: Через стандартный репозиторий
sudo apt install nodejs npm -y
```

### Шаг 2: Установка PM2
```bash
npm install -g pm2
```

### Шаг 3: Клонирование репозитория
```bash
git clone https://github.com/ВАШ_USERNAME/plasteringfinish.git
cd plasteringfinish
```

### Шаг 4: Установка зависимостей
```bash
npm install --force
```

### Шаг 5: Сборка проекта
```bash
npm run build
```

### Шаг 6: Запуск через PM2
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
cd plasteringfinish
git pull origin main          # Скачиваем обновления
npm install --force           # Обновляем зависимости  
npm run build                 # Пересобираем
pm2 restart plasteringfinish  # Перезапускаем
```

---

## 🔒 Настройка Nginx (опционально)

Для использования доменного имени и SSL:

### 1. Установка Nginx
```bash
sudo apt install nginx -y
```

### 2. Создание конфигурации
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

### 3. Активация конфигурации
```bash
sudo ln -s /etc/nginx/sites-available/plasteringfinish /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL сертификат
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d ваш-домен.ru -d www.ваш-домен.ru
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
cd /path/to/plasteringfinish
git pull origin main
npm install --force
npm run build
pm2 restart plasteringfinish
```

Добавьте в crontab для ежедневного обновления:
```bash
crontab -e
# Добавьте строку:
0 3 * * * /path/to/update.sh >> /var/log/plasteringfinish-update.log 2>&1
```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `pm2 logs plasteringfinish`
2. Убедитесь что порт 3000 не занят
3. Проверьте наличие свободной памяти
4. Перезапустите приложение: `pm2 restart plasteringfinish`

**Сайт будет доступен по адресу: `http://ВАШ_IP:3000`** 