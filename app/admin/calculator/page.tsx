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
  Calculator,
  Settings,
  DollarSign,
  Target,
  Clock,
  Award
} from "lucide-react"
import { toast } from "sonner"

interface CalculatorContent {
  header: {
    title: string
    subtitle: string
    description: string
  }
  form: {
    title: string
    subtitle: string
    fields: {
      name: {
        label: string
        placeholder: string
      }
      phone: {
        label: string
        placeholder: string
      }
      email: {
        label: string
        placeholder: string
      }
      area: {
        label: string
        placeholder: string
      }
      message: {
        label: string
        placeholder: string
      }
    }
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
    stars: string
    reviews: string
  }
}

export default function CalculatorPage() {
  const [content, setContent] = useState<CalculatorContent>({
    header: {
      title: "Получите точную смету",
      subtitle: "Бесплатный расчет стоимости",
      description: "Наш инженер бесплатно приедет на объект, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего проекта"
    },
    form: {
      title: "Заказать расчет",
      subtitle: "Бесплатно и без обязательств",
      fields: {
        name: {
          label: "Ваше имя",
          placeholder: "Введите ваше имя"
        },
        phone: {
          label: "Телефон",
          placeholder: "+7 (999) 123-45-67"
        },
        email: {
          label: "Email",
          placeholder: "example@mail.ru"
        },
        area: {
          label: "Площадь помещения (м²)",
          placeholder: "Введите площадь"
        },
        message: {
          label: "Дополнительная информация",
          placeholder: "Опишите ваш проект..."
        }
      },
      button: "ПОЛУЧИТЬ РАСЧЕТ",
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
      stars: "4.9 из 5",
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
              title: data.content.header?.title || "Получите точную смету",
              subtitle: data.content.header?.subtitle || "Бесплатный расчет стоимости",
              description: data.content.header?.description || "Наш инженер бесплатно приедет на объект, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего проекта"
            },
            form: {
              title: data.content.form?.title || "Заказать расчет",
              subtitle: data.content.form?.subtitle || "Бесплатно и без обязательств",
              fields: {
                name: {
                  label: data.content.form?.fields?.name?.label || "Ваше имя",
                  placeholder: data.content.form?.fields?.name?.placeholder || "Введите ваше имя"
                },
                phone: {
                  label: data.content.form?.fields?.phone?.label || "Телефон",
                  placeholder: data.content.form?.fields?.phone?.placeholder || "+7 (999) 123-45-67"
                },
                email: {
                  label: data.content.form?.fields?.email?.label || "Email",
                  placeholder: data.content.form?.fields?.email?.placeholder || "example@mail.ru"
                },
                area: {
                  label: data.content.form?.fields?.area?.label || "Площадь помещения (м²)",
                  placeholder: data.content.form?.fields?.area?.placeholder || "Введите площадь"
                },
                message: {
                  label: data.content.form?.fields?.message?.label || "Дополнительная информация",
                  placeholder: data.content.form?.fields?.message?.placeholder || "Опишите ваш проект..."
                }
              },
              button: data.content.form?.button || "ПОЛУЧИТЬ РАСЧЕТ",
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
              stars: data.content.rating?.stars || "4.9 из 5",
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

      <Tabs defaultValue="header" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Заголовок
          </TabsTrigger>
          <TabsTrigger value="form" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Форма
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Особенности
          </TabsTrigger>
          <TabsTrigger value="rating" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Рейтинг
          </TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
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
                  placeholder="Получите точную смету"
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
                  placeholder="Бесплатный расчет стоимости"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={content.header.description}
                  onChange={(e) => setContent({
                    ...content,
                    header: { ...content.header, description: e.target.value }
                  })}
                  placeholder="Наш инженер бесплатно приедет на объект, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего проекта"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Форма калькулятора
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
                    placeholder="Заказать расчет"
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
                    placeholder="Бесплатно и без обязательств"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Поля формы</h4>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name-label">Лейбл имени</Label>
                    <Input
                      id="name-label"
                      value={content.form.fields.name.label}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            name: { ...content.form.fields.name, label: e.target.value }
                          }
                        }
                      })}
                      placeholder="Ваше имя"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name-placeholder">Плейсхолдер имени</Label>
                    <Input
                      id="name-placeholder"
                      value={content.form.fields.name.placeholder}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            name: { ...content.form.fields.name, placeholder: e.target.value }
                          }
                        }
                      })}
                      placeholder="Введите ваше имя"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone-label">Лейбл телефона</Label>
                    <Input
                      id="phone-label"
                      value={content.form.fields.phone.label}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            phone: { ...content.form.fields.phone, label: e.target.value }
                          }
                        }
                      })}
                      placeholder="Телефон"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone-placeholder">Плейсхолдер телефона</Label>
                    <Input
                      id="phone-placeholder"
                      value={content.form.fields.phone.placeholder}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            phone: { ...content.form.fields.phone, placeholder: e.target.value }
                          }
                        }
                      })}
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email-label">Лейбл email</Label>
                    <Input
                      id="email-label"
                      value={content.form.fields.email.label}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            email: { ...content.form.fields.email, label: e.target.value }
                          }
                        }
                      })}
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-placeholder">Плейсхолдер email</Label>
                    <Input
                      id="email-placeholder"
                      value={content.form.fields.email.placeholder}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            email: { ...content.form.fields.email, placeholder: e.target.value }
                          }
                        }
                      })}
                      placeholder="example@mail.ru"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area-label">Лейбл площади</Label>
                    <Input
                      id="area-label"
                      value={content.form.fields.area.label}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            area: { ...content.form.fields.area, label: e.target.value }
                          }
                        }
                      })}
                      placeholder="Площадь помещения (м²)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area-placeholder">Плейсхолдер площади</Label>
                    <Input
                      id="area-placeholder"
                      value={content.form.fields.area.placeholder}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            area: { ...content.form.fields.area, placeholder: e.target.value }
                          }
                        }
                      })}
                      placeholder="Введите площадь"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="message-label">Лейбл сообщения</Label>
                    <Input
                      id="message-label"
                      value={content.form.fields.message.label}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            message: { ...content.form.fields.message, label: e.target.value }
                          }
                        }
                      })}
                      placeholder="Дополнительная информация"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message-placeholder">Плейсхолдер сообщения</Label>
                    <Input
                      id="message-placeholder"
                      value={content.form.fields.message.placeholder}
                      onChange={(e) => setContent({
                        ...content,
                        form: {
                          ...content.form,
                          fields: {
                            ...content.form.fields,
                            message: { ...content.form.fields.message, placeholder: e.target.value }
                          }
                        }
                      })}
                      placeholder="Опишите ваш проект..."
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="button-text">Текст кнопки</Label>
                    <Input
                      id="button-text"
                      value={content.form.button}
                      onChange={(e) => setContent({
                        ...content,
                        form: { ...content.form, button: e.target.value }
                      })}
                      placeholder="ПОЛУЧИТЬ РАСЧЕТ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consent-text">Текст согласия</Label>
                    <Input
                      id="consent-text"
                      value={content.form.consent}
                      onChange={(e) => setContent({
                        ...content,
                        form: { ...content.form, consent: e.target.value }
                      })}
                      placeholder="Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
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
                    placeholder="до 7 лет"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
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
                    placeholder="в день обращения"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
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
                    placeholder="по ГОСТ"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rating" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Рейтинг
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rating-stars">Рейтинг (звезды)</Label>
                  <Input
                    id="rating-stars"
                    value={content.rating.stars}
                    onChange={(e) => setContent({
                      ...content,
                      rating: { ...content.rating, stars: e.target.value }
                    })}
                    placeholder="4.9 из 5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating-reviews">Отзывы</Label>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
