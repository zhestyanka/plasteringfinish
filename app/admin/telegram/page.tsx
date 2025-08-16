"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from 'sonner'
import { 
  Send, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Bot,
  Key,
  Hash
} from "lucide-react"

export default function TelegramPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isConfigured, setIsConfigured] = useState(false)
  const [testResult, setTestResult] = useState<string>('')
  
  const [config, setConfig] = useState({
    botToken: '',
    chatId: '',
    enabled: true
  })

  useEffect(() => {
    checkTelegramStatus()
  }, [])

  const checkTelegramStatus = async () => {
    try {
      const response = await fetch('/api/telegram/test')
      const data = await response.json()
      setIsConfigured(data.configured)
    } catch (error) {
      console.error('Ошибка проверки статуса Telegram:', error)
    }
  }

  const testTelegram = async () => {
    setIsLoading(true)
    setTestResult('')
    
    try {
      const response = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTestResult('success')
        toast.success('Тестовое сообщение отправлено в Telegram!')
      } else {
        setTestResult('error')
        toast.error(data.error || 'Ошибка отправки тестового сообщения')
      }
    } catch (error) {
      setTestResult('error')
      toast.error('Ошибка тестирования Telegram')
    } finally {
      setIsLoading(false)
    }
  }

  const saveConfig = () => {
    // В реальном проекте здесь будет сохранение в базу данных или файл конфигурации
    toast.success('Настройки сохранены')
    checkTelegramStatus()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки Telegram</h1>
          <p className="text-gray-600 mt-2">Настройка уведомлений о заявках в Telegram</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isConfigured ? "default" : "secondary"}>
            {isConfigured ? "Настроено" : "Не настроено"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основные настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-coffee-600" />
              <span>Основные настройки</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="botToken" className="flex items-center space-x-2">
                <Key className="w-4 h-4" />
                <span>Bot Token</span>
              </Label>
              <Input
                id="botToken"
                type="password"
                placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                value={config.botToken}
                onChange={(e) => setConfig(prev => ({ ...prev, botToken: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                Получите токен у @BotFather в Telegram
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="chatId" className="flex items-center space-x-2">
                <Hash className="w-4 h-4" />
                <span>Chat ID</span>
              </Label>
              <Input
                id="chatId"
                placeholder="123456789 или @channel_name"
                value={config.chatId}
                onChange={(e) => setConfig(prev => ({ ...prev, chatId: e.target.value }))}
              />
              <p className="text-xs text-gray-500">
                ID чата или канала для получения уведомлений
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={config.enabled}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enabled: checked }))}
              />
              <Label>Включить уведомления</Label>
            </div>

            <Button onClick={saveConfig} className="w-full">
              <CheckCircle className="w-4 h-4 mr-2" />
              Сохранить настройки
            </Button>
          </CardContent>
        </Card>

        {/* Тестирование */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-coffee-600" />
              <span>Тестирование</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Отправьте тестовое сообщение для проверки настроек
              </p>
              
              <Button 
                onClick={testTelegram} 
                disabled={isLoading || !isConfigured}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Отправить тестовое сообщение
                  </>
                )}
              </Button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-lg flex items-center space-x-2 ${
                testResult === 'success' 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {testResult === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {testResult === 'success' 
                    ? 'Тестовое сообщение отправлено успешно!' 
                    : 'Ошибка отправки тестового сообщения'
                  }
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Инструкция */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-coffee-600" />
            <span>Инструкция по настройке</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-medium">1. Создание бота</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Откройте Telegram и найдите @BotFather</li>
              <li>Отправьте команду /newbot</li>
              <li>Следуйте инструкциям для создания бота</li>
              <li>Скопируйте полученный токен</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">2. Получение Chat ID</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Добавьте бота в нужный чат/канал</li>
              <li>Отправьте любое сообщение в чат</li>
              <li>Перейдите по ссылке: https://api.telegram.org/bot[YOUR_BOT_TOKEN]/getUpdates</li>
              <li>Найдите "chat":{"id":123456789} - это ваш Chat ID</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">3. Настройка переменных окружения</h4>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm font-mono text-gray-700">
                TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz<br/>
                TELEGRAM_CHAT_ID=123456789
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">4. Тестирование</h4>
            <p className="text-sm text-gray-600">
              После настройки используйте кнопку "Отправить тестовое сообщение" 
              для проверки работы интеграции.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Пример сообщения */}
      <Card>
        <CardHeader>
          <CardTitle>Пример уведомления</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-2 text-sm">
              <p><strong>🔔 Новая заявка с сайта</strong></p>
              <p><strong>📅 Дата:</strong> 15.01.2024, 14:30:25</p>
              <p><strong>👤 Имя:</strong> Иван Петров</p>
              <p><strong>📞 Телефон:</strong> +7 (999) 123-45-67</p>
              <p><strong>📧 Email:</strong> ivan@example.com</p>
              <p><strong>📍 Адрес:</strong> ул. Примерная, д. 123</p>
              <p><strong>📏 Площадь:</strong> 100 м²</p>
              <p><strong>🔨 Тип работ:</strong> Штукатурка стен</p>
              <p><strong>📝 Описание:</strong> Нужна механизированная штукатурка</p>
              <p><strong>🌐 Источник:</strong> Сайт Штукатур СПб</p>
              <p><strong>🔗 Страница:</strong> Главная страница</p>
              <p><strong>⚡ Требует быстрого ответа!</strong></p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
