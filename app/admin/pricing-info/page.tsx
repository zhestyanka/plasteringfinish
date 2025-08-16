"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, FileText, Target, Shield, CheckCircle, Star, Award, Clock } from "lucide-react"
import { toast } from "sonner"

interface PricingInfo {
  subtitle: string
  title: string
  description: string
  estimateTitle: string
  estimateDescription: string
  features: {
    warranty: {
      title: string
      description: string
    }
    visit: {
      title: string
      description: string
    }
    quality: {
      title: string
      description: string
    }
  }
  benefits: {
    guarantee: {
      title: string
      description: string
    }
    team: {
      title: string
      description: string
    }
    rating: {
      title: string
      description: string
    }
  }
  paymentMethods: {
    cash: {
      title: string
      description: string
    }
    card: {
      title: string
      description: string
    }
    transfer: {
      title: string
      description: string
      discount: string
    }
  }
}

export default function PricingInfoPage() {
  const [pricingInfo, setPricingInfo] = useState<PricingInfo>({
    subtitle: "Прозрачные цены",
    title: "Тарифы на механизированную штукатурку",
    description: "Выберите подходящий тариф для вашего проекта",
    estimateTitle: "Получите точную смету",
    estimateDescription: "Наш инженер приедет бесплатно, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего объекта",
    features: {
      warranty: {
        title: "Гарантия",
        description: "до 7 лет"
      },
      visit: {
        title: "Выезд",
        description: "в день обращения"
      },
      quality: {
        title: "Качество",
        description: "по ГОСТ"
      }
    },
    benefits: {
      guarantee: {
        title: "Гарантия качества",
        description: "До 5 лет гарантии на все виды работ"
      },
      team: {
        title: "Опытная команда",
        description: "Более 8 лет на рынке строительных услуг"
      },
      rating: {
        title: "Высокий рейтинг",
        description: "4.9/5 звезд по отзывам клиентов"
      }
    },
    paymentMethods: {
      cash: {
        title: "Наличные",
        description: "Оплата наличными при завершении работ"
      },
      card: {
        title: "Банковская карта",
        description: "Безналичная оплата картой, возможна рассрочка"
      },
      transfer: {
        title: "Банковский перевод",
        description: "Оплата по счету для юридических лиц",
        discount: "Скидка 5%"
      }
    }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadPricingInfo()
  }, [])

  const loadPricingInfo = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.pricingInfo) {
          setPricingInfo(data.pricingInfo)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки информации о тарифах:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const savePricingInfo = async () => {
    setIsSaving(true)
    try {
      console.log('💾 Сохраняем информацию о тарифах:', pricingInfo)
      
      // Сначала загружаем текущие данные
      const currentResponse = await fetch('/api/data/content')
      const currentData = await currentResponse.json()
      
      // Обновляем только информацию о тарифах
      const updatedData = {
        ...currentData,
        pricingInfo: pricingInfo
      }

      console.log('📄 Обновленные данные pricingInfo:', updatedData.pricingInfo)

      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        console.log('✅ Информация о тарифах успешно сохранена')
        toast.success('Информация о тарифах успешно сохранена')
      } else {
        throw new Error('Failed to save pricing info')
      }
    } catch (error) {
      console.error('❌ Ошибка сохранения информации о тарифах:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    savePricingInfo()
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
          <h1 className="text-3xl font-bold text-gray-900">Информация о тарифах</h1>
          <p className="text-gray-600 mt-2">Редактирование информации в разделе "Тарифы"</p>
        </div>
        <Button onClick={savePricingInfo} disabled={isSaving} className="bg-coffee-600 hover:bg-coffee-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Основная информация */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-coffee-600" />
              <span>Основная информация</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subtitle">Подзаголовок раздела</Label>
              <Input
                id="subtitle"
                value={pricingInfo.subtitle}
                onChange={(e) => setPricingInfo(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Заголовок</Label>
              <Input
                id="title"
                value={pricingInfo.title}
                onChange={(e) => setPricingInfo(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={pricingInfo.description}
                onChange={(e) => setPricingInfo(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Блок сметы */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-coffee-600" />
              <span>Блок сметы</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="estimateTitle">Заголовок сметы</Label>
              <Input
                id="estimateTitle"
                value={pricingInfo.estimateTitle}
                onChange={(e) => setPricingInfo(prev => ({ ...prev, estimateTitle: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimateDescription">Описание сметы</Label>
              <Textarea
                id="estimateDescription"
                value={pricingInfo.estimateDescription}
                onChange={(e) => setPricingInfo(prev => ({ ...prev, estimateDescription: e.target.value }))}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Особенности */}
        <Card>
          <CardHeader>
            <CardTitle>Особенности</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Гарантия */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warrantyTitle">Гарантия - Заголовок</Label>
                <Input
                  id="warrantyTitle"
                  value={pricingInfo.features.warranty.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      warranty: { ...prev.features.warranty, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warrantyDescription">Гарантия - Описание</Label>
                <Input
                  id="warrantyDescription"
                  value={pricingInfo.features.warranty.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      warranty: { ...prev.features.warranty, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Выезд */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="visitTitle">Выезд - Заголовок</Label>
                <Input
                  id="visitTitle"
                  value={pricingInfo.features.visit.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      visit: { ...prev.features.visit, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visitDescription">Выезд - Описание</Label>
                <Input
                  id="visitDescription"
                  value={pricingInfo.features.visit.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      visit: { ...prev.features.visit, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Качество */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="qualityTitle">Качество - Заголовок</Label>
                <Input
                  id="qualityTitle"
                  value={pricingInfo.features.quality.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      quality: { ...prev.features.quality, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualityDescription">Качество - Описание</Label>
                <Input
                  id="qualityDescription"
                  value={pricingInfo.features.quality.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    features: {
                      ...prev.features,
                      quality: { ...prev.features.quality, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Преимущества */}
        <Card>
          <CardHeader>
            <CardTitle>Преимущества компании</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Гарантия качества */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="guaranteeTitle">Гарантия качества - Заголовок</Label>
                <Input
                  id="guaranteeTitle"
                  value={pricingInfo.benefits.guarantee.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      guarantee: { ...prev.benefits.guarantee, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guaranteeDescription">Гарантия качества - Описание</Label>
                <Input
                  id="guaranteeDescription"
                  value={pricingInfo.benefits.guarantee.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      guarantee: { ...prev.benefits.guarantee, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Опытная команда */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teamTitle">Опытная команда - Заголовок</Label>
                <Input
                  id="teamTitle"
                  value={pricingInfo.benefits.team.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      team: { ...prev.benefits.team, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teamDescription">Опытная команда - Описание</Label>
                <Input
                  id="teamDescription"
                  value={pricingInfo.benefits.team.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      team: { ...prev.benefits.team, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Высокий рейтинг */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ratingTitle">Высокий рейтинг - Заголовок</Label>
                <Input
                  id="ratingTitle"
                  value={pricingInfo.benefits.rating.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      rating: { ...prev.benefits.rating, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ratingDescription">Высокий рейтинг - Описание</Label>
                <Input
                  id="ratingDescription"
                  value={pricingInfo.benefits.rating.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    benefits: {
                      ...prev.benefits,
                      rating: { ...prev.benefits.rating, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Способы оплаты */}
        <Card>
          <CardHeader>
            <CardTitle>Способы оплаты</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Наличные */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashTitle">Наличные - Заголовок</Label>
                <Input
                  id="cashTitle"
                  value={pricingInfo.paymentMethods.cash.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      cash: { ...prev.paymentMethods.cash, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cashDescription">Наличные - Описание</Label>
                <Input
                  id="cashDescription"
                  value={pricingInfo.paymentMethods.cash.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      cash: { ...prev.paymentMethods.cash, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Банковская карта */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardTitle">Банковская карта - Заголовок</Label>
                <Input
                  id="cardTitle"
                  value={pricingInfo.paymentMethods.card.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      card: { ...prev.paymentMethods.card, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardDescription">Банковская карта - Описание</Label>
                <Input
                  id="cardDescription"
                  value={pricingInfo.paymentMethods.card.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      card: { ...prev.paymentMethods.card, description: e.target.value }
                    }
                  }))}
                />
              </div>
            </div>

            {/* Банковский перевод */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transferTitle">Банковский перевод - Заголовок</Label>
                <Input
                  id="transferTitle"
                  value={pricingInfo.paymentMethods.transfer.title}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      transfer: { ...prev.paymentMethods.transfer, title: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferDescription">Банковский перевод - Описание</Label>
                <Input
                  id="transferDescription"
                  value={pricingInfo.paymentMethods.transfer.description}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      transfer: { ...prev.paymentMethods.transfer, description: e.target.value }
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="transferDiscount">Банковский перевод - Скидка</Label>
                <Input
                  id="transferDiscount"
                  value={pricingInfo.paymentMethods.transfer.discount}
                  onChange={(e) => setPricingInfo(prev => ({
                    ...prev,
                    paymentMethods: {
                      ...prev.paymentMethods,
                      transfer: { ...prev.paymentMethods.transfer, discount: e.target.value }
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
