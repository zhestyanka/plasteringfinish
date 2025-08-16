"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, FileText, MessageCircle, Clock, CheckCircle, Calendar, Phone } from "lucide-react"
import { toast } from "sonner"

interface ServicesInfo {
  title: string
  subtitle: string
  description: string
  consultationTitle: string
  consultationDescription: string
  benefits: {
    quick: {
      title: string
      description: string
    }
    free: {
      title: string
      description: string
    }
    convenient: {
      title: string
      description: string
    }
    professional: {
      title: string
      description: string
    }
  }
}

export default function ServicesInfoPage() {
  const [servicesInfo, setServicesInfo] = useState<ServicesInfo>({
    title: "Полный комплекс строительных работ",
    subtitle: "Наши услуги",
    description: "От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок",
    consultationTitle: "Не знаете с чего начать?",
    consultationDescription: "Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. Это ни к чему не обязывает.",
    benefits: {
      quick: {
        title: "Быстро",
        description: "Выезд в день обращения"
      },
      free: {
        title: "Бесплатно",
        description: "Оценка и консультация"
      },
      convenient: {
        title: "Удобно",
        description: "В любое время"
      },
      professional: {
        title: "Профессионально",
        description: "Опытный инженер"
      }
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadServicesInfo()
  }, [])

  const loadServicesInfo = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.servicesInfo) {
          setServicesInfo(data.servicesInfo)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки информации об услугах:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveServicesInfo = async () => {
    setIsSaving(true)
    try {
      console.log('💾 Сохраняем информацию об услугах:', servicesInfo)
      
      // Сначала загружаем текущие данные
      const currentResponse = await fetch('/api/data/content')
      const currentData = await currentResponse.json()
      
      // Обновляем только информацию об услугах
      const updatedData = {
        ...currentData,
        servicesInfo: servicesInfo
      }

      console.log('📄 Обновленные данные servicesInfo:', updatedData.servicesInfo)

      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        console.log('✅ Информация об услугах успешно сохранена')
        toast.success('Информация об услугах успешно сохранена')
      } else {
        throw new Error('Failed to save services info')
      }
    } catch (error) {
      console.error('❌ Ошибка сохранения информации об услугах:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveServicesInfo()
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
          <h1 className="text-3xl font-bold text-gray-900">Информация об услугах</h1>
          <p className="text-gray-600 mt-2">Редактирование информации в разделе "Услуги"</p>
        </div>
        <Button onClick={saveServicesInfo} disabled={isSaving} className="bg-coffee-600 hover:bg-coffee-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-coffee-600" />
              <span>Основная информация</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subtitle">Подзаголовок раздела</Label>
              <Input
                id="subtitle"
                value={servicesInfo.subtitle}
                onChange={(e) => setServicesInfo(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={servicesInfo.title}
                onChange={(e) => setServicesInfo(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={servicesInfo.description}
                onChange={(e) => setServicesInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Информация о консультации */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-coffee-600" />
              <span>Блок консультации</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="consultationTitle">Заголовок консультации</Label>
              <Input
                id="consultationTitle"
                value={servicesInfo.consultationTitle}
                onChange={(e) => setServicesInfo(prev => ({ ...prev, consultationTitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consultationDescription">Описание консультации</Label>
              <Textarea
                id="consultationDescription"
                value={servicesInfo.consultationDescription}
                onChange={(e) => setServicesInfo(prev => ({ ...prev, consultationDescription: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Преимущества */}
        <Card>
          <CardHeader>
            <CardTitle>Преимущества</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Быстро */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quickTitle">Быстро - Заголовок</Label>
                <Input
                  id="quickTitle"
                  value={servicesInfo.benefits.quick.title}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      quick: { ...prev.benefits.quick, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quickDescription">Быстро - Описание</Label>
                <Input
                  id="quickDescription"
                  value={servicesInfo.benefits.quick.description}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      quick: { ...prev.benefits.quick, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Бесплатно */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="freeTitle">Бесплатно - Заголовок</Label>
                <Input
                  id="freeTitle"
                  value={servicesInfo.benefits.free.title}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      free: { ...prev.benefits.free, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="freeDescription">Бесплатно - Описание</Label>
                <Input
                  id="freeDescription"
                  value={servicesInfo.benefits.free.description}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      free: { ...prev.benefits.free, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Удобно */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="convenientTitle">Удобно - Заголовок</Label>
                <Input
                  id="convenientTitle"
                  value={servicesInfo.benefits.convenient.title}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      convenient: { ...prev.benefits.convenient, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="convenientDescription">Удобно - Описание</Label>
                <Input
                  id="convenientDescription"
                  value={servicesInfo.benefits.convenient.description}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      convenient: { ...prev.benefits.convenient, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Профессионально */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="professionalTitle">Профессионально - Заголовок</Label>
                <Input
                  id="professionalTitle"
                  value={servicesInfo.benefits.professional.title}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      professional: { ...prev.benefits.professional, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professionalDescription">Профессионально - Описание</Label>
                <Input
                  id="professionalDescription"
                  value={servicesInfo.benefits.professional.description}
                  onChange={(e) => setServicesInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      professional: { ...prev.benefits.professional, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
