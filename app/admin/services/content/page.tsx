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
  Hammer,
  MessageCircle,
  Clock,
  CheckCircle,
  Calendar,
  Phone,
  Star
} from "lucide-react"
import { toast } from "sonner"

interface ServicesContent {
  header: {
    badge: string
    title: string
    subtitle: string
  }
  consultation: {
    badge: string
    title: string
    description: string
    features: {
      fast: {
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
}

export default function ServicesContentPage() {
  const [content, setContent] = useState<ServicesContent>({
    header: {
      badge: "Наши услуги",
      title: "Полный комплекс строительных работ",
      subtitle: "От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок"
    },
    consultation: {
      badge: "Бесплатная консультация",
      title: "Не знаете с чего начать?",
      description: "Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. Это ни к чему не обязывает.",
      features: {
        fast: {
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
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/services-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          // Убеждаемся, что все необходимые поля существуют
          const safeContent = {
            header: {
              badge: data.content.header?.badge || "Наши услуги",
              title: data.content.header?.title || "Полный комплекс строительных работ",
              subtitle: data.content.header?.subtitle || "От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок"
            },
            consultation: {
              badge: data.content.consultation?.badge || "Бесплатная консультация",
              title: data.content.consultation?.title || "Не знаете с чего начать?",
              description: data.content.consultation?.description || "Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. Это ни к чему не обязывает.",
              features: {
                fast: {
                  title: data.content.consultation?.features?.fast?.title || "Быстро",
                  description: data.content.consultation?.features?.fast?.description || "Выезд в день обращения"
                },
                free: {
                  title: data.content.consultation?.features?.free?.title || "Бесплатно",
                  description: data.content.consultation?.features?.free?.description || "Оценка и консультация"
                },
                convenient: {
                  title: data.content.consultation?.features?.convenient?.title || "Удобно",
                  description: data.content.consultation?.features?.convenient?.description || "В любое время"
                },
                professional: {
                  title: data.content.consultation?.features?.professional?.title || "Профессионально",
                  description: data.content.consultation?.features?.professional?.description || "Опытный инженер"
                }
              }
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
      const response = await fetch('/api/data/services-content', {
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
          <h1 className="text-3xl font-bold text-gray-900">Редактирование текста услуг</h1>
          <p className="text-gray-600 mt-2">Настройка текстового контента страницы услуг</p>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="header" className="flex items-center gap-2">
            <Hammer className="w-4 h-4" />
            Заголовок
          </TabsTrigger>
          <TabsTrigger value="consultation" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Консультация
          </TabsTrigger>
        </TabsList>

        <TabsContent value="header" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hammer className="w-5 h-5" />
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
                  placeholder="Наши услуги"
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
                  placeholder="Полный комплекс строительных работ"
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
                  placeholder="От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Секция консультации
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultation-badge">Бейдж</Label>
                  <Input
                    id="consultation-badge"
                    value={content.consultation.badge}
                    onChange={(e) => setContent({
                      ...content,
                      consultation: { ...content.consultation, badge: e.target.value }
                    })}
                    placeholder="Бесплатная консультация"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-title">Заголовок</Label>
                  <Input
                    id="consultation-title"
                    value={content.consultation.title}
                    onChange={(e) => setContent({
                      ...content,
                      consultation: { ...content.consultation, title: e.target.value }
                    })}
                    placeholder="Не знаете с чего начать?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-description">Описание</Label>
                  <Textarea
                    id="consultation-description"
                    value={content.consultation.description}
                    onChange={(e) => setContent({
                      ...content,
                      consultation: { ...content.consultation, description: e.target.value }
                    })}
                    placeholder="Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. Это ни к чему не обязывает."
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Быстро
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fast-title">Заголовок</Label>
                      <Input
                        id="fast-title"
                        value={content.consultation.features.fast.title}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              fast: { ...content.consultation.features.fast, title: e.target.value }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fast-desc">Описание</Label>
                      <Textarea
                        id="fast-desc"
                        value={content.consultation.features.fast.description}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              fast: { ...content.consultation.features.fast, description: e.target.value }
                            }
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
                      <CheckCircle className="w-5 h-5" />
                      Бесплатно
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="free-title">Заголовок</Label>
                      <Input
                        id="free-title"
                        value={content.consultation.features.free.title}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              free: { ...content.consultation.features.free, title: e.target.value }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="free-desc">Описание</Label>
                      <Textarea
                        id="free-desc"
                        value={content.consultation.features.free.description}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              free: { ...content.consultation.features.free, description: e.target.value }
                            }
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
                      <Calendar className="w-5 h-5" />
                      Удобно
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="convenient-title">Заголовок</Label>
                      <Input
                        id="convenient-title"
                        value={content.consultation.features.convenient.title}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              convenient: { ...content.consultation.features.convenient, title: e.target.value }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="convenient-desc">Описание</Label>
                      <Textarea
                        id="convenient-desc"
                        value={content.consultation.features.convenient.description}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              convenient: { ...content.consultation.features.convenient, description: e.target.value }
                            }
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
                      Профессионально
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="professional-title">Заголовок</Label>
                      <Input
                        id="professional-title"
                        value={content.consultation.features.professional.title}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              professional: { ...content.consultation.features.professional, title: e.target.value }
                            }
                          }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professional-desc">Описание</Label>
                      <Textarea
                        id="professional-desc"
                        value={content.consultation.features.professional.description}
                        onChange={(e) => setContent({
                          ...content,
                          consultation: {
                            ...content.consultation,
                            features: {
                              ...content.consultation.features,
                              professional: { ...content.consultation.features.professional, description: e.target.value }
                            }
                          }
                        })}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
