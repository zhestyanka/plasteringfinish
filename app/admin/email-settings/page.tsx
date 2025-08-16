"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Mail, Settings, TestTube } from "lucide-react"
import { toast } from "sonner"

interface EmailSettings {
  email: string
  smtpHost: string
  smtpPort: string
  smtpUser: string
  smtpPass: string
  smtpSecure: boolean
}

export default function EmailSettingsPage() {
  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    email: '9110163777@rambler.ru',
    smtpHost: 'smtp.rambler.ru',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    smtpSecure: false
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isTesting, setIsTesting] = useState(false)

  useEffect(() => {
    loadEmailSettings()
  }, [])

  const loadEmailSettings = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.emailSettings) {
          setEmailSettings(data.emailSettings)
        }
        if (data.contacts?.email) {
          setEmailSettings(prev => ({ ...prev, email: data.contacts.email }))
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек email:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveEmailSettings = async () => {
    setIsSaving(true)
    try {
      console.log('💾 Сохраняем настройки email:', emailSettings)
      
      // Сначала загружаем текущие данные
      const currentResponse = await fetch('/api/data/content')
      const currentData = await currentResponse.json()
      
      // Обновляем настройки email и контакты
      const updatedData = {
        ...currentData,
        emailSettings: emailSettings,
        contacts: {
          ...currentData.contacts,
          email: emailSettings.email
        }
      }

      console.log('📄 Обновленные данные:', updatedData)

      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        console.log('✅ Настройки email успешно сохранены')
        toast.success('Настройки email успешно сохранены')
      } else {
        throw new Error('Failed to save email settings')
      }
    } catch (error) {
      console.error('❌ Ошибка сохранения настроек email:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const testEmail = async () => {
    setIsTesting(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailSettings.email,
          subject: 'Тестовое письмо с сайта',
          text: `Это тестовое письмо отправлено ${new Date().toLocaleString('ru-RU')} для проверки настроек email.`
        })
      })

      const result = await response.json()

      if (result.success) {
        toast.success('Тестовое письмо отправлено! Проверьте почту.')
        console.log('✅ Тестовое письмо отправлено:', result)
      } else {
        toast.error('Ошибка отправки тестового письма')
        console.error('❌ Ошибка отправки тестового письма:', result)
      }
    } catch (error) {
      console.error('❌ Ошибка тестирования email:', error)
      toast.error('Ошибка тестирования email')
    } finally {
      setIsTesting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки Email</h1>
          <p className="text-gray-600 mt-2">Настройка отправки email с сайта</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={testEmail} disabled={isTesting} variant="outline">
            <TestTube className="w-4 h-4 mr-2" />
            {isTesting ? 'Тестирование...' : 'Тест'}
          </Button>
          <Button onClick={saveEmailSettings} disabled={isSaving} className="bg-coffee-600 hover:bg-coffee-700">
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Основные настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-coffee-600" />
              <span>Основные настройки</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email получателя</Label>
              <Input
                id="email"
                type="email"
                value={emailSettings.email}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, email: e.target.value }))}
                placeholder="example@rambler.ru"
              />
              <p className="text-sm text-gray-500">Email, на который будут приходить заявки с сайта</p>
            </div>
          </CardContent>
        </Card>

        {/* SMTP настройки */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-coffee-600" />
              <span>SMTP настройки</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP сервер</Label>
                <Input
                  id="smtpHost"
                  value={emailSettings.smtpHost}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpHost: e.target.value }))}
                  placeholder="smtp.rambler.ru"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">Порт</Label>
                <Input
                  id="smtpPort"
                  value={emailSettings.smtpPort}
                  onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPort: e.target.value }))}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpUser">Пользователь SMTP</Label>
              <Input
                id="smtpUser"
                value={emailSettings.smtpUser}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpUser: e.target.value }))}
                placeholder="your-email@rambler.ru"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtpPass">Пароль SMTP</Label>
              <Input
                id="smtpPass"
                type="password"
                value={emailSettings.smtpPass}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, smtpPass: e.target.value }))}
                placeholder="Ваш пароль"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Инструкции */}
      <Card>
        <CardHeader>
          <CardTitle>Инструкция по настройке</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Для Rambler.ru:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• SMTP сервер: smtp.rambler.ru</li>
              <li>• Порт: 587</li>
              <li>• Безопасность: STARTTLS</li>
              <li>• Используйте ваш email и пароль от Rambler</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">Для Gmail:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• SMTP сервер: smtp.gmail.com</li>
              <li>• Порт: 587</li>
              <li>• Безопасность: STARTTLS</li>
              <li>• Включите двухфакторную аутентификацию</li>
              <li>• Создайте пароль приложения</li>
            </ul>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Важно:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• После настройки нажмите "Тест" для проверки</li>
              <li>• Все заявки с сайта будут приходить на указанный email</li>
              <li>• Настройки сохраняются автоматически</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
