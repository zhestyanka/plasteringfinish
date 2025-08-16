#!/bin/bash

echo "🦶 Создаем админ панель футера..."

# Создаем директории если их нет
mkdir -p app/admin/footer
mkdir -p lib/admin
mkdir -p components/admin

# Создаем типы
cat > lib/admin/types.ts << 'EOF'
export interface Footer {
  copyright: string
  privacyPolicy: string
  privacyPolicyUrl: string
  development: string
  developmentUrl: string
  phones: string[]
  callbackButton: string
}
EOF

# Создаем страницу футера
cat > app/admin/footer/page.tsx << 'EOF'
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Save, 
  FileText,
  Phone,
  Link,
  Plus,
  Trash2
} from "lucide-react"
import { toast } from "sonner"
import { Footer } from "@/lib/admin/types"

export default function FooterPage() {
  const [footerData, setFooterData] = useState<Footer>({
    copyright: "© 2024 «Штукатур СПб» Все права защищены",
    privacyPolicy: "Политика конфиденциальности",
    privacyPolicyUrl: "#",
    development: "Разработка сайта: WebZavod.bz",
    developmentUrl: "#",
    phones: ["8 (812) 986-98-03", "8 (963) 329-65-63"],
    callbackButton: "Перезвоните мне"
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadFooterData()
  }, [])

  const loadFooterData = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.footer) {
          setFooterData(data.footer)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки данных футера:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          footer: footerData
        }),
      })

      if (response.ok) {
        toast.success('Футер успешно обновлен')
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      console.error('Ошибка сохранения футера:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const addPhone = () => {
    setFooterData(prev => ({
      ...prev,
      phones: [...prev.phones, '']
    }))
  }

  const removePhone = (index: number) => {
    setFooterData(prev => ({
      ...prev,
      phones: prev.phones.filter((_, i) => i !== index)
    }))
  }

  const updatePhone = (index: number, value: string) => {
    setFooterData(prev => ({
      ...prev,
      phones: prev.phones.map((phone, i) => i === index ? value : phone)
    }))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Редактирование футера</h1>
          <p className="text-gray-600 mt-2">Настройте содержимое футера сайта</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-coffee-600 hover:bg-coffee-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-coffee-600" />
              <span>Копирайт</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="copyright">Текст копирайта</Label>
                <Input
                  id="copyright"
                  value={footerData.copyright}
                  onChange={(e) => setFooterData(prev => ({ ...prev, copyright: e.target.value }))}
                  placeholder="© 2024 «Штукатур СПб» Все права защищены"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Link className="w-5 h-5 text-coffee-600" />
              <span>Политика конфиденциальности</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="privacyPolicy">Текст ссылки</Label>
                <Input
                  id="privacyPolicy"
                  value={footerData.privacyPolicy}
                  onChange={(e) => setFooterData(prev => ({ ...prev, privacyPolicy: e.target.value }))}
                  placeholder="Политика конфиденциальности"
                />
              </div>
              <div>
                <Label htmlFor="privacyPolicyUrl">URL ссылки</Label>
                <Input
                  id="privacyPolicyUrl"
                  value={footerData.privacyPolicyUrl}
                  onChange={(e) => setFooterData(prev => ({ ...prev, privacyPolicyUrl: e.target.value }))}
                  placeholder="#"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-coffee-600" />
              <span>Разработка сайта</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="development">Текст (включая "Разработка сайта:")</Label>
                <Input
                  id="development"
                  value={footerData.development}
                  onChange={(e) => setFooterData(prev => ({ ...prev, development: e.target.value }))}
                  placeholder="Разработка сайта: WebZavod.bz"
                />
              </div>
              <div>
                <Label htmlFor="developmentUrl">URL ссылки</Label>
                <Input
                  id="developmentUrl"
                  value={footerData.developmentUrl}
                  onChange={(e) => setFooterData(prev => ({ ...prev, developmentUrl: e.target.value }))}
                  placeholder="#"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-coffee-600" />
              <span>Телефоны</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Список телефонов</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPhone}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить телефон
                </Button>
              </div>
              
              <div className="space-y-3">
                {footerData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={phone}
                      onChange={(e) => updatePhone(index, e.target.value)}
                      placeholder="8 (812) 123-45-67"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePhone(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-600">
                Первый телефон будет отображаться крупнее и жирнее
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-coffee-600" />
              <span>Кнопка обратного звонка</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="callbackButton">Текст кнопки</Label>
                <Input
                  id="callbackButton"
                  value={footerData.callbackButton}
                  onChange={(e) => setFooterData(prev => ({ ...prev, callbackButton: e.target.value }))}
                  placeholder="Перезвоните мне"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="lg"
          className="bg-coffee-600 hover:bg-coffee-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </div>
  )
}
EOF

echo "✅ Файлы созданы!"
echo "📋 Теперь выполните:"
echo "1. npm install --legacy-peer-deps --force"
echo "2. npm run build"
echo "3. pm2 restart plasteringfinish"

