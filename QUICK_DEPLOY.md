# 🚀 Быстрый деплой на VPS (45.153.188.66)

## ⚡ Команды для копирования

### 1. Подключение к VPS
```bash
ssh root@45.153.188.66
```

### 2. Настройка VPS (выполнить один раз)
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем PM2
sudo npm install -g pm2

# Устанавливаем Nginx
sudo apt install -y nginx

# Настраиваем firewall
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable

# Создаем папку для проекта
mkdir -p /var/www/plasteringfinish
cd /var/www/plasteringfinish
```

### 3. Клонирование и запуск
```bash
# Клонируем репозиторий (замените ВАШ_USERNAME)
git clone https://github.com/ВАШ_USERNAME/plasteringfinish.git
cd plasteringfinish

# Устанавливаем зависимости
npm install --force

# Собираем проект
npm run build

# Создаем папку для логов
mkdir -p logs

# Запускаем через PM2
pm2 start ecosystem.config.js

# Сохраняем конфигурацию
pm2 save

# Настраиваем автозапуск
pm2 startup
```

### 4. Настройка Nginx (опционально)
```bash
# Копируем конфигурацию
sudo cp nginx-config /etc/nginx/sites-available/plasteringfinish

# Активируем сайт
sudo ln -s /etc/nginx/sites-available/plasteringfinish /etc/nginx/sites-enabled/

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### 5. Проверка
Откройте в браузере: `http://45.153.188.66:3000`

---

## 🔧 Полезные команды

```bash
# Статус приложения
pm2 status

# Логи приложения
pm2 logs plasteringfinish

# Перезапуск
pm2 restart plasteringfinish

# Остановка
pm2 stop plasteringfinish

# Мониторинг
pm2 monit
```

---

## 🔄 Обновление сайта

```bash
cd /var/www/plasteringfinish
git pull origin main
npm install --force
npm run build
pm2 restart plasteringfinish
```

---

## ⚠️ Важно

1. **Замените `ВАШ_USERNAME`** на ваше имя пользователя GitHub
2. **Убедитесь, что репозиторий публичный** или настройте SSH ключи
3. **Проверьте, что порт 3000 открыт** в настройках VPS провайдера

**Сайт будет доступен по адресу: `http://45.153.188.66:3000`**
