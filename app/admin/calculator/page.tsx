"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Save, 
  Calculator,
  MessageSquare,
  Shield,
  Clock,
  Award
} from "lucide-react"
import { toast } from "sonner"

interface CalculatorContent {
  header: {
    title: string
    subtitle: string
  }
  form: {
    name: string
    phone: string
    email: string
    area: string
    message: string
    button: string
    consent: string
  }
  features: {
    warranty: {
      title: string
      value: string
    }
    visit: {
      title: string
      value: string
    }
    quality: {
      title: string
      value: string
    }
  }
  rating: {
    value: string
    reviews: string
  }
}

export default function CalculatorPage() {
  const [content, setContent] = useState<CalculatorContent>({
    header: {
      title: "Рассчитайте стоимость штукатурки",
      subtitle: "Получите точную смету за 5 минут"
    },
    form: {
      name: "Ваше имя",
      phone: "Номер телефона",
      email: "Email",
      area: "Площадь помещения (м²)",
      message: "Дополнительная информация",
      button: "РАССЧИТАТЬ СТОИМОСТЬ",
      consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
    },
    features: {
      warranty: {
        title: "Гарантия",
        value: "до 7 лет"
      },
      visit: {
        title: "Выезд",
        value: "в день обращения"
      },
      quality: {
        title: "Качество",
        value: "по ГОСТ"
      }
    },
    rating: {
      value: "4.9 из 5",
      reviews: "157 отзывов на Яндекс.Карты"
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/calculator-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          // Убеждаемся, что все необходимые поля существуют
          const safeContent = {
            header: {
              title: data.content.header?.title || "Рассчитайте стоимость штукатурки",
              subtitle: data.content.header?.subtitle || "Получите точную смету за 5 минут"
            },
            form: {
              name: data.content.form?.name || "Ваше имя",
              phone: data.content.form?.phone || "Номер телефона",
              email: data.content.form?.email || "Email",
              area: data.content.form?.area || "Площадь помещения (м²)",
              message: data.content.form?.message || "Дополнительная информация",
              button: data.content.form?.button || "РАССЧИТАТЬ СТОИМОСТЬ",
              consent: data.content.form?.consent || "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
            },
            features: {
              warranty: {
                title: data.content.features?.warranty?.title || "Гарантия",
                value: data.content.features?.warranty?.value || "до 7 лет"
              },
              visit: {
                title: data.content.features?.visit?.title || "Выезд",
                value: data.content.features?.visit?.value || "в день обращения"
              },
              quality: {
                title: data.content.features?.quality?.title || "Качество",
                value: data.content.features?.quality?.value || "по ГОСТ"
              }
            },
            rating: {
              value: data.content.rating?.value || "4.9 из 5",
              reviews: data.content.rating?.reviews || "157 отзывов на Яндекс.Карты"
            }
          }
          setContent(safeContent)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки контента:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/calculator-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        toast.success('Контент успешно сохранен')
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
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
          <h1 className="text-3xl font-bold text-gray-900">Редактирование калькулятора</h1>
          <p className="text-gray-600 mt-2">Настройка текстового контента калькулятора</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={isSaving}
          className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Заголовок калькулятора
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок</Label>
            <Input
              id="title"
              value={content.header.title}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, title: e.target.value }
              })}
              placeholder="Рассчитайте стоимость штукатурки"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Подзаголовок</Label>
            <Input
              id="subtitle"
              value={content.header.subtitle}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, subtitle: e.target.value }
              })}
              placeholder="Получите точную смету за 5 минут"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Поля формы
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">Поле "Имя"</Label>
              <Input
                id="form-name"
                value={content.form.name}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, name: e.target.value }
                })}
                placeholder="Ваше имя"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-phone">Поле "Телефон"</Label>
              <Input
                id="form-phone"
                value={content.form.phone}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, phone: e.target.value }
                })}
                placeholder="Номер телефона"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-email">Поле "Email"</Label>
              <Input
                id="form-email"
                value={content.form.email}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, email: e.target.value }
                })}
                placeholder="Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-area">Поле "Площадь"</Label>
              <Input
                id="form-area"
                value={content.form.area}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, area: e.target.value }
                })}
                placeholder="Площадь помещения (м²)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-message">Поле "Сообщение"</Label>
              <Input
                id="form-message"
                value={content.form.message}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, message: e.target.value }
                })}
                placeholder="Дополнительная информация"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="form-button">Текст кнопки</Label>
              <Input
                id="form-button"
                value={content.form.button}
                onChange={(e) => setContent({
                  ...content,
                  form: { ...content.form, button: e.target.value }
                })}
                placeholder="РАССЧИТАТЬ СТОИМОСТЬ"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="form-consent">Согласие</Label>
            <Textarea
              id="form-consent"
              value={content.form.consent}
              onChange={(e) => setContent({
                ...content,
                form: { ...content.form, consent: e.target.value }
              })}
              placeholder="Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Особенности
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4" />
                  Гарантия
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warranty-title">Заголовок</Label>
                  <Input
                    id="warranty-title"
                    value={content.features.warranty.title}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        warranty: { ...content.features.warranty, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty-value">Значение</Label>
                  <Input
                    id="warranty-value"
                    value={content.features.warranty.value}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        warranty: { ...content.features.warranty, value: e.target.value }
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  Выезд
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="visit-title">Заголовок</Label>
                  <Input
                    id="visit-title"
                    value={content.features.visit.title}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        visit: { ...content.features.visit, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visit-value">Значение</Label>
                  <Input
                    id="visit-value"
                    value={content.features.visit.value}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        visit: { ...content.features.visit, value: e.target.value }
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Award className="w-4 h-4" />
                  Качество
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quality-title">Заголовок</Label>
                  <Input
                    id="quality-title"
                    value={content.features.quality.title}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        quality: { ...content.features.quality, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality-value">Значение</Label>
                  <Input
                    id="quality-value"
                    value={content.features.quality.value}
                    onChange={(e) => setContent({
                      ...content,
                      features: {
                        ...content.features,
                        quality: { ...content.features.quality, value: e.target.value }
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Рейтинг
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating-value">Значение рейтинга</Label>
              <Input
                id="rating-value"
                value={content.rating.value}
                onChange={(e) => setContent({
                  ...content,
                  rating: { ...content.rating, value: e.target.value }
                })}
                placeholder="4.9 из 5"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating-reviews">Количество отзывов</Label>
              <Input
                id="rating-reviews"
                value={content.rating.reviews}
                onChange={(e) => setContent({
                  ...content,
                  rating: { ...content.rating, reviews: e.target.value }
                })}
                placeholder="157 отзывов на Яндекс.Карты"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
