"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Star,
  Image as ImageIcon,
  Save,
  X,
  Hammer,
  Eye,
  EyeOff,
  Briefcase,
  MessageCircle,
  Clock,
  CheckCircle,
  Calendar,
  Phone
} from "lucide-react"
import { Service } from "@/lib/admin/types"
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState<Partial<Service>>({
    title: "Механизированная штукатурка стен",
    description: "Профессиональная штукатурка стен с использованием современного оборудования. Быстро, качественно, с гарантией.",
    price: "от 350₽/м²",
    features: ["Современное оборудование", "Гарантия 5 лет", "Быстрое выполнение"],
    image: "",
    popular: true,
    active: true,
    icon: "Hammer"
  })

  // Состояние для контента
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

  // Загрузка услуг и контента при монтировании компонента
  useEffect(() => {
    loadServices()
    loadContent()
  }, [])

  const loadServices = async () => {
    try {
      const response = await fetch('/api/data/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data.services || [])
      } else {
        throw new Error('Failed to load services')
      }
    } catch (error) {
      console.error('Ошибка загрузки услуг:', error)
    }
  }

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

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setEditingService(service)
      setFormData(service)
    } else {
      setEditingService(null)
      setFormData({
        title: "",
        description: "",
        price: "",
        features: [],
        image: "",
        popular: false,
        active: true,
        icon: "Hammer"
      })
    }
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingService(null)
    setFormData({
      title: "",
      description: "",
      price: "",
      features: [],
      image: "",
      popular: false,
      active: true,
      icon: "Hammer"
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let updatedServices: Service[]
    
    if (editingService) {
      // Обновление существующей услуги
      updatedServices = services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      )
    } else {
              // Добавление новой услуги
        const newService: Service = {
          ...formData as Service,
          id: Date.now().toString()
        }
      updatedServices = [...services, newService]
    }
    
    try {
      const response = await fetch('/api/data/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: updatedServices })
      })
      
      if (response.ok) {
        setServices(updatedServices)
        handleCloseDialog()
        toast.success(editingService ? 'Услуга обновлена' : 'Услуга добавлена')
      } else {
        throw new Error('Failed to save service')
      }
    } catch (error) {
      console.error('Ошибка сохранения услуги:', error)
      toast.error('Ошибка сохранения')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту услугу?')) return
    
    const updatedServices = services.filter(service => service.id !== id)
    
    try {
      const response = await fetch('/api/data/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services: updatedServices })
      })
      
      if (response.ok) {
        setServices(updatedServices)
        toast.success('Услуга удалена')
      } else {
        throw new Error('Failed to delete service')
      }
    } catch (error) {
      console.error('Ошибка удаления услуги:', error)
      toast.error('Ошибка удаления')
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
          <h1 className="text-3xl font-bold text-gray-900">Управление услугами</h1>
          <p className="text-gray-600 mt-2">Редактирование услуг и текстового контента</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={isSaving}
          className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить контент'}
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Управление услугами
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            Редактирование текста
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Список услуг</h2>
            <Button onClick={() => handleOpenDialog()} className="bg-coffee-600 hover:bg-coffee-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить услугу
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden">
                <div className="relative h-48">
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-coffee-100 to-coffee-200 flex items-center justify-center">
                      <Hammer className="w-12 h-12 text-coffee-600" />
                    </div>
                  )}
                  {service.popular && (
                    <Badge className="absolute top-2 right-2 bg-coffee-600 text-white">
                      Популярно
                    </Badge>
                  )}
                  <div className="absolute top-2 left-2">
                    <Switch
                      checked={service.active}
                      onCheckedChange={(checked) => {
                        const updatedServices = services.map(s => 
                          s.id === service.id ? { ...s, active: checked } : s
                        )
                        setServices(updatedServices)
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{service.title}</h3>
                    <span className="text-coffee-600 font-bold">{service.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Особенности:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1 h-1 bg-coffee-500 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(service)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {services.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Hammer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Услуги не найдены</h3>
                <p className="text-gray-600 mb-4">Начните с добавления первой услуги</p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить услугу
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
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
                        placeholder="Быстро"
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
                        placeholder="Выезд в день обращения"
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
                        placeholder="Бесплатно"
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
                        placeholder="Оценка и консультация"
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
                        placeholder="Удобно"
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
                        placeholder="Работаем в удобное время"
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
                        placeholder="Профессионально"
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
                        placeholder="Опытный инженер"
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

      {/* Диалог добавления/редактирования услуги */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название услуги</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="от 350₽/м²"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="image">URL изображения</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/images/services/service.jpg"
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Активна</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                />
                <Label htmlFor="popular">Популярная</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button type="submit" className="bg-coffee-600 hover:bg-coffee-700">
                {editingService ? 'Обновить' : 'Добавить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 