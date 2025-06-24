"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Save, Home } from "lucide-react"
import { toast } from "sonner"
import ImageUpload from "@/components/admin/ImageUpload"

export default function HeroPage() {
  const [heroData, setHeroData] = useState({
    title: "Механизированная штукатурка в СПб",
    subtitle: "Профессиональная штукатурка стен",
    description: "Качественные штукатурные работы с использованием современного оборудования",
    backgroundImage: "",
    buttonText: "Получить консультацию"
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const saveHero = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Главная секция успешно сохранена')
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Главная страница</h1>
          <p className="text-gray-600 mt-2">Настройка главной секции сайта</p>
        </div>
        <Button onClick={saveHero} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Home className="w-5 h-5 text-coffee-600" />
            <span>Hero секция</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Основной заголовок</Label>
            <Input
              id="title"
              value={heroData.title}
              onChange={(e) => setHeroData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Механизированная штукатурка в СПб"
            />
          </div>

          <div>
            <Label htmlFor="subtitle">Подзаголовок</Label>
            <Input
              id="subtitle"
              value={heroData.subtitle}
              onChange={(e) => setHeroData(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Профессиональная штукатурка стен"
            />
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={heroData.description}
              onChange={(e) => setHeroData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Качественные штукатурные работы..."
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="button-text">Текст кнопки</Label>
            <Input
              id="button-text"
              value={heroData.buttonText}
              onChange={(e) => setHeroData(prev => ({ ...prev, buttonText: e.target.value }))}
              placeholder="Получить консультацию"
            />
          </div>

          <div>
            <Label>Фоновое изображение</Label>
            <ImageUpload
              value={heroData.backgroundImage}
              onChange={(url: string) => setHeroData(prev => ({ ...prev, backgroundImage: url }))}
              placeholder="Загрузите фоновое изображение для главной секции"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 