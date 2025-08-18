"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, 
  FileText,
  DollarSign,
  Target,
  CreditCard,
  Shield,
  Star,
  Clock,
  Award,
  MapPin,
  Mail,
  Phone
} from "lucide-react"
import { toast } from "sonner"

interface PricingContent {
  header: {
    badge: string
    title: string
    subtitle: string
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
    bank: {
      title: string
      description: string
      discount: string
    }
  }
  benefits: {
    warranty: {
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
  calculator: {
    title: string
    description: string
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
      stars: string
      reviews: string
    }
  }
  form: {
    title: string
    subtitle: string
    contact: {
      phone: string
      email: string
      address: string
      hours: string
    }
  }
}

export default function PricingContentPage() {
  const [content, setContent] = useState<PricingContent>({
    header: {
      badge: "Прозрачные цены",
      title: "Тарифы на механизированную штукатурку",
      subtitle: "Выберите подходящий тариф для вашего проекта"
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
      bank: {
        title: "Банковский перевод",
        description: "Оплата по счету для юридических лиц",
        discount: "Скидка 5%"
      }
    },
    benefits: {
      warranty: {
        title: "Гарантия качества",
        description: "До 5 лет гарантии на все виды работ"
      },
      team: {
        title: "Оптимная команда",
        description: "Более 8 лет на рынке строительных услуг"
      },
      rating: {
        title: "Высокий рейтинг",
        description: "4.9/5 звоезд по отзывам клиентов"
      }
    },
    calculator: {
      title: "Получите точную смету",
      description: "Наш инженер предложит бесплатно, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего объекта",
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
        stars: "4.9 из 5",
        reviews: "157 отзывов на Яндекс.Карты"
      }
    },
    form: {
      title: "Заказать расчет",
      subtitle: "Бесплатно и без обязательств",
      contact: {
        phone: "+7 (812) 123-45-67",
        email: "info@shtukaturka-spb.ru",
        address: "Санкт-Петербург",
        hours: "Ежедневно 9:00-21:00"
      }
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/pricing-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          setContent(data.content)
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
      const response = await fetch('/api/data/pricing-content', {
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
          <h1 className="text-3xl font-bold text-gray-900">Редактирование текста тарифов</h1>
          <p className="text-gray-600 mt-2">Настройка текстового контента страницы тарифов</p>
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

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Заголовок
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Способы оплаты
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Преимущества
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Калькулятор
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Форма
          </TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Заголовок страницы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badge">Бейдж</Label>
                <Input
                  id="badge"
                  value={content.header.badge}
                  onChange={(e) => setContent({
                    ...content,
                    header: { ...content.header, badge: e.target.value }
                  })}
                  placeholder="Прозрачные цены"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Заголовок</Label>
                <Input
                  id="title"
                  value={content.header.title}
                  onChange={(e) => setContent({
                    ...content,
                    header: { ...content.header, title: e.target.value }
                  })}
                  placeholder="Тарифы на механизированную штукатурку"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subtitle">Подзаголовок</Label>
                <Textarea
                  id="subtitle"
                  value={content.header.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    header: { ...content.header, subtitle: e.target.value }
                  })}
                  placeholder="Выберите подходящий тариф для вашего проекта"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Наличные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cash-title">Заголовок</Label>
                  <Input
                    id="cash-title"
                    value={content.paymentMethods.cash.title}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        cash: { ...content.paymentMethods.cash, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash-desc">Описание</Label>
                  <Textarea
                    id="cash-desc"
                    value={content.paymentMethods.cash.description}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        cash: { ...content.paymentMethods.cash, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Банковская карта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="card-title">Заголовок</Label>
                  <Input
                    id="card-title"
                    value={content.paymentMethods.card.title}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        card: { ...content.paymentMethods.card, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-desc">Описание</Label>
                  <Textarea
                    id="card-desc"
                    value={content.paymentMethods.card.description}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        card: { ...content.paymentMethods.card, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Банковский перевод
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bank-title">Заголовок</Label>
                  <Input
                    id="bank-title"
                    value={content.paymentMethods.bank.title}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        bank: { ...content.paymentMethods.bank, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-desc">Описание</Label>
                  <Textarea
                    id="bank-desc"
                    value={content.paymentMethods.bank.description}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        bank: { ...content.paymentMethods.bank, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bank-discount">Скидка</Label>
                  <Input
                    id="bank-discount"
                    value={content.paymentMethods.bank.discount}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: {
                        ...content.paymentMethods,
                        bank: { ...content.paymentMethods.bank, discount: e.target.value }
                      }
                    })}
                    placeholder="Скидка 5%"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Гарантия качества
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="warranty-title">Заголовок</Label>
                  <Input
                    id="warranty-title"
                    value={content.benefits.warranty.title}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        warranty: { ...content.benefits.warranty, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warranty-desc">Описание</Label>
                  <Textarea
                    id="warranty-desc"
                    value={content.benefits.warranty.description}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        warranty: { ...content.benefits.warranty, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Оптимальная команда
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-title">Заголовок</Label>
                  <Input
                    id="team-title"
                    value={content.benefits.team.title}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        team: { ...content.benefits.team, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-desc">Описание</Label>
                  <Textarea
                    id="team-desc"
                    value={content.benefits.team.description}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        team: { ...content.benefits.team, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Высокий рейтинг
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rating-title">Заголовок</Label>
                  <Input
                    id="rating-title"
                    value={content.benefits.rating.title}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        rating: { ...content.benefits.rating, title: e.target.value }
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating-desc">Описание</Label>
                  <Textarea
                    id="rating-desc"
                    value={content.benefits.rating.description}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: {
                        ...content.benefits,
                        rating: { ...content.benefits.rating, description: e.target.value }
                      }
                    })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Секция калькулятора
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calc-title">Заголовок</Label>
                  <Input
                    id="calc-title"
                    value={content.calculator.title}
                    onChange={(e) => setContent({
                      ...content,
                      calculator: { ...content.calculator, title: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calc-desc">Описание</Label>
                  <Textarea
                    id="calc-desc"
                    value={content.calculator.description}
                    onChange={(e) => setContent({
                      ...content,
                      calculator: { ...content.calculator, description: e.target.value }
                    })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Гарантия
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="warranty-feature-title">Заголовок</Label>
                    <Input
                      id="warranty-feature-title"
                      value={content.calculator.features.warranty.title}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            warranty: { ...content.calculator.features.warranty, title: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warranty-feature-value">Значение</Label>
                    <Input
                      id="warranty-feature-value"
                      value={content.calculator.features.warranty.value}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            warranty: { ...content.calculator.features.warranty, value: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Выезд
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="visit-feature-title">Заголовок</Label>
                    <Input
                      id="visit-feature-title"
                      value={content.calculator.features.visit.title}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            visit: { ...content.calculator.features.visit, title: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visit-feature-value">Значение</Label>
                    <Input
                      id="visit-feature-value"
                      value={content.calculator.features.visit.value}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            visit: { ...content.calculator.features.visit, value: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Качество
                  </h4>
                  <div className="space-y-2">
                    <Label htmlFor="quality-feature-title">Заголовок</Label>
                    <Input
                      id="quality-feature-title"
                      value={content.calculator.features.quality.title}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            quality: { ...content.calculator.features.quality, title: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quality-feature-value">Значение</Label>
                    <Input
                      id="quality-feature-value"
                      value={content.calculator.features.quality.value}
                      onChange={(e) => setContent({
                        ...content,
                        calculator: {
                          ...content.calculator,
                          features: {
                            ...content.calculator.features,
                            quality: { ...content.calculator.features.quality, value: e.target.value }
                          }
                        }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating-stars">Рейтинг (звезды)</Label>
                  <Input
                    id="rating-stars"
                    value={content.calculator.rating.stars}
                    onChange={(e) => setContent({
                      ...content,
                      calculator: {
                        ...content.calculator,
                        rating: { ...content.calculator.rating, stars: e.target.value }
                      }
                    })}
                    placeholder="4.9 из 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating-reviews">Отзывы</Label>
                  <Input
                    id="rating-reviews"
                    value={content.calculator.rating.reviews}
                    onChange={(e) => setContent({
                      ...content,
                      calculator: {
                        ...content.calculator,
                        rating: { ...content.calculator.rating, reviews: e.target.value }
                      }
                    })}
                    placeholder="157 отзывов на Яндекс.Карты"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Форма заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="form-title">Заголовок формы</Label>
                  <Input
                    id="form-title"
                    value={content.form.title}
                    onChange={(e) => setContent({
                      ...content,
                      form: { ...content.form, title: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form-subtitle">Подзаголовок формы</Label>
                  <Input
                    id="form-subtitle"
                    value={content.form.subtitle}
                    onChange={(e) => setContent({
                      ...content,
                      form: { ...content.form, subtitle: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Телефон</Label>
                  <Input
                    id="contact-phone"
                    value={content.form.contact.phone}
                    onChange={(e) => setContent({
                      ...content,
                      form: {
                        ...content.form,
                        contact: { ...content.form.contact, phone: e.target.value }
                      }
                    })}
                    placeholder="+7 (812) 123-45-67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    value={content.form.contact.email}
                    onChange={(e) => setContent({
                      ...content,
                      form: {
                        ...content.form,
                        contact: { ...content.form.contact, email: e.target.value }
                      }
                    })}
                    placeholder="info@shtukaturka-spb.ru"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-address">Адрес</Label>
                  <Input
                    id="contact-address"
                    value={content.form.contact.address}
                    onChange={(e) => setContent({
                      ...content,
                      form: {
                        ...content.form,
                        contact: { ...content.form.contact, address: e.target.value }
                      }
                    })}
                    placeholder="Санкт-Петербург"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-hours">Часы работы</Label>
                  <Input
                    id="contact-hours"
                    value={content.form.contact.hours}
                    onChange={(e) => setContent({
                      ...content,
                      form: {
                        ...content.form,
                        contact: { ...content.form.contact, hours: e.target.value }
                      }
                    })}
                    placeholder="Ежедневно 9:00-21:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
