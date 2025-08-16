"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { 
  Save, 
  TestTube,
  Bot,
  MessageCircle,
  Settings,
  CheckCircle,
  XCircle
} from "lucide-react"

export default function TelegramPage() {
  const [telegramConfig, setTelegramConfig] = useState({
    botToken: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || '',
    enabled: true
  })
  
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelegramConfig({
      ...telegramConfig,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      // В реальном проекте здесь будет сохранение в базу данных
      toast.success('Настройки Telegram сохранены')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения настроек')
    }
  }

  const handleTest = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/telegram/test')
      const result = await response.json()
      
      setTestResult(result)
      
      if (result.success) {
        toast.success('Telegram подключен и работает!')
      } else {
        toast.error(`Ошибка: ${result.error || result.message}`)
      }
    } catch (error) {
      console.error('Ошибка тестирования:', error)
      setTestResult({
        success: false,
        message: 'Ошибка подключения к серверу',
        error: error instanceof Error ? error.message : 'Неизвестная ошибка'
      })
      toast.error('Ошибка тестирования Telegram')
    } finally {
      setIsTesting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки Telegram</h1>
          <p className="text-gray-600 mt-2">Настройка отправки заявок в Telegram</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={handleTest} 
            disabled={isTesting}
            variant="outline"
            className="border-coffee-600 text-coffee-600 hover:bg-coffee-50"
          >
            <TestTube className="w-4 h-4 mr-2" />
            {isTesting ? 'Тестирование...' : 'Тест подключения'}
          </Button>
          <Button onClick={handleSave} className="bg-coffee-600 hover:bg-coffee-700">
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>
      </div>

      {/* Основные настройки */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-coffee-600" />
            <span>Настройки бота</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="botToken" className="flex items-center space-x-2">
              <Bot className="w-4 h-4" />
              <span>Токен бота</span>
            </Label>
            <Input
              id="botToken"
              name="botToken"
              type="password"
              value={telegramConfig.botToken}
              onChange={handleInputChange}
              placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
            />
            <p className="text-sm text-gray-500">
              Получите токен у @BotFather в Telegram
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatId" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat ID</span>
            </Label>
            <Input
              id="chatId"
              name="chatId"
              value={telegramConfig.chatId}
              onChange={handleInputChange}
              placeholder="123456789 или @channel_name"
            />
            <p className="text-sm text-gray-500">
              ID чата или канала для получения заявок
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Результат тестирования */}
      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span>Результат тестирования</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`p-4 rounded-lg ${
              testResult.success 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </p>
              {testResult.error && (
                <p className="text-sm text-red-600 mt-2">
                  {testResult.error}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Инструкции */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-coffee-600" />
            <span>Инструкция по настройке</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">1. Создание бота</h4>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Найдите @BotFather в Telegram</li>
                <li>Отправьте команду /newbot</li>
                <li>Следуйте инструкциям для создания бота</li>
                <li>Скопируйте полученный токен</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">2. Получение Chat ID</h4>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Добавьте бота в нужный чат/канал</li>
                <li>Отправьте сообщение в чат</li>
                <li>Перейдите по ссылке: https://api.telegram.org/bot[TOKEN]/getUpdates</li>
                <li>Найдите "chat":{"id":123456789} - это ваш Chat ID</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">3. Настройка прав</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Бот должен иметь права на отправку сообщений</li>
                <li>В каналах бот должен быть администратором</li>
                <li>Проверьте настройки приватности чата</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Примеры сообщений */}
      <Card>
        <CardHeader>
          <CardTitle>Примеры сообщений</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Заявка с сайта:</h4>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <pre className="whitespace-pre-wrap">
{`🔔 НОВАЯ ЗАЯВКА С САЙТА

📅 Дата: 16.08.2024, 16:30
👤 Имя: Иван Иванов
📞 Телефон: +7 (999) 123-45-67
📧 Email: ivan@example.com
📏 Площадь: 100 м²
📍 Адрес: Санкт-Петербург, ул. Примерная, 1
💬 Сообщение: Нужна штукатурка стен

⚡️ Требует быстрого ответа!`}
                </pre>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Расчет стоимости:</h4>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <pre className="whitespace-pre-wrap">
{`🧮 РАСЧЕТ СТОИМОСТИ

📅 Дата: 16.08.2024, 16:30
👤 Имя: Петр Петров
📞 Телефон: +7 (999) 987-65-43

📊 Параметры расчета:
• Цена за м²: 450 ₽
• Площадь: 120 м²
• Толщина слоя: 20 мм
• Площадь за смену: 80 м²
• Цена мешка: 350 ₽
• Вес мешка: 30 кг

💰 Примерная стоимость: 54 000 ₽

⚡️ Клиент заинтересован в расчете!`}
                </pre>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
