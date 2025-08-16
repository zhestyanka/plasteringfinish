#!/bin/bash

# 📁 Создание папки для логов
echo "📁 Создаем папку для логов..."

# 1. Создаем папку logs
echo "📁 Создаем папку logs..."
mkdir -p logs

# 2. Устанавливаем права
echo "🔐 Устанавливаем права..."
chmod 755 logs

# 3. Создаем пустые файлы логов
echo "📄 Создаем файлы логов..."
touch logs/err.log
touch logs/out.log
touch logs/combined.log

# 4. Устанавливаем права на файлы
echo "🔐 Устанавливаем права на файлы..."
chmod 644 logs/*.log

echo "✅ Папка logs создана и настроена!"
