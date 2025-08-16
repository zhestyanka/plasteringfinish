#!/bin/bash

# 🔧 Скрипт решения конфликта Git
echo "🔧 Решаем конфликт Git..."

# Сохраняем локальный файл
echo "💾 Сохраняем локальный файл setup-rovnosteny.sh..."
cp setup-rovnosteny.sh setup-rovnosteny.sh.backup

# Удаляем файл из Git
echo "🗑️ Удаляем файл из Git..."
git rm setup-rovnosteny.sh

# Делаем коммит
echo "📝 Делаем коммит..."
git commit -m "Remove conflicting setup-rovnosteny.sh"

# Тянем изменения
echo "⬇️ Тянем изменения с GitHub..."
git pull origin main

# Восстанавливаем файл
echo "🔄 Восстанавливаем файл..."
cp setup-rovnosteny.sh.backup setup-rovnosteny.sh

echo "✅ Конфликт решен!"
echo "📋 Теперь можно продолжить работу"

