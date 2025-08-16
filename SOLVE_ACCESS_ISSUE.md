# 🔧 Решение проблемы с доступностью сайта

## 🚨 Проблема
PM2 показывает, что приложение запущено (`online`), но сайт недоступен по адресу `http://45.153.188.66:3000`

## 🔍 Диагностика

### 1. Запустите диагностику
```bash
# Скачайте скрипт диагностики
curl -o troubleshoot.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/troubleshoot.sh
chmod +x troubleshoot.sh
bash troubleshoot.sh
```

### 2. Проверьте логи вручную
```bash
# Логи приложения
pm2 logs plasteringfinish

# Проверьте порт
netstat -tulpn | grep :3000

# Проверьте localhost
curl -I http://localhost:3000
```

## 🔧 Решение

### Вариант 1: Автоматическое исправление
```bash
# Скачайте скрипт исправления
curl -o fix-issues.sh https://raw.githubusercontent.com/ВАШ_USERNAME/plasteringfinish/main/fix-issues.sh
chmod +x fix-issues.sh
bash fix-issues.sh
```

### Вариант 2: Ручное исправление

#### Шаг 1: Остановите приложение
```bash
pm2 stop plasteringfinish
pm2 delete plasteringfinish
```

#### Шаг 2: Перейдите в папку проекта
```bash
cd /var/www/plasteringfinish
```

#### Шаг 3: Пересоберите проект
```bash
npm run build
```

#### Шаг 4: Создайте папку для логов
```bash
mkdir -p logs
```

#### Шаг 5: Запустите приложение
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Шаг 6: Проверьте firewall
```bash
sudo ufw allow 3000
sudo ufw status
```

## 🌐 Альтернативные решения

### Решение 1: Настройка Nginx
```bash
# Установите Nginx
sudo apt install nginx

# Создайте конфигурацию
sudo nano /etc/nginx/sites-available/plasteringfinish
```

Вставьте конфигурацию:
```nginx
server {
    listen 80;
    server_name 45.153.188.66;

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
sudo nginx -t
sudo systemctl restart nginx
```

### Решение 2: Изменение порта
```bash
# Отредактируйте ecosystem.config.js
nano ecosystem.config.js
```

Измените порт на 8080:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 8080,
  HOSTNAME: '0.0.0.0'
}
```

```bash
# Откройте порт 8080
sudo ufw allow 8080

# Перезапустите
pm2 restart plasteringfinish
```

Сайт будет доступен по адресу: `http://45.153.188.66:8080`

## 🔍 Дополнительная диагностика

### Проверьте процессы
```bash
ps aux | grep node
ps aux | grep pm2
```

### Проверьте использование ресурсов
```bash
free -h
df -h
```

### Проверьте сетевые соединения
```bash
ss -tulpn | grep :3000
```

## 📋 Чек-лист

- [ ] Приложение запущено в PM2 (`pm2 status`)
- [ ] Порт 3000 слушается (`netstat -tulpn | grep :3000`)
- [ ] Firewall разрешает порт 3000 (`sudo ufw status`)
- [ ] Localhost доступен (`curl -I http://localhost:3000`)
- [ ] Нет ошибок в логах (`pm2 logs plasteringfinish`)
- [ ] Достаточно памяти (`free -h`)

## 🆘 Если ничего не помогает

1. **Перезагрузите VPS:**
```bash
sudo reboot
```

2. **После перезагрузки:**
```bash
cd /var/www/plasteringfinish
pm2 start ecosystem.config.js
pm2 save
```

3. **Проверьте настройки VPS провайдера:**
   - Убедитесь, что порт 3000 открыт в панели управления
   - Проверьте, что нет блокировки на уровне провайдера

4. **Попробуйте другой порт:**
   - Измените порт на 8080 или 4000
   - Откройте соответствующий порт в firewall

**Сайт должен быть доступен по адресу: `http://45.153.188.66:3000`**

