"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  FileText,
  MessageCircle
} from "lucide-react"
import { Service } from "@/lib/admin/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

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
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // Состояние для текстового контента
  const [content, setContent] = useState<ServicesContent>({
    header: {
      badge: "Наши услуги",
      title: "Механизированная штукатурка стен",
      subtitle: "Профессиональная отделка помещений любой сложности"
    },
    consultation: {
      badge: "Бесплатная консультация",
      title: "Получите бесплатную консультацию",
      description: "Наши специалисты помогут подобрать оптимальное решение для вашего проекта",
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

  // Загрузка данных при монтировании компонента
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
    } finally {
      setIsLoading(false)
    }
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/services-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          const safeContent = {
            header: {
              badge: data.content.header?.badge || "Наши услуги",
              title: data.content.header?.title || "Механизированная штукатурка стен",
              subtitle: data.content.header?.subtitle || "Профессиональная отделка помещений любой сложности"
            },
            consultation: {
              badge: data.content.consultation?.badge || "Бесплатная консультация",
              title: data.content.consultation?.title || "Получите бесплатную консультацию",
              description: data.content.consultation?.description || "Наши специалисты помогут подобрать оптимальное решение для вашего проекта",
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
      // Обновляем существующую услугу
      updatedServices = services.map(service => 
        service.id === editingService.id 
          ? { ...service, ...formData }
          : service
      )
    } else {
      // Добавляем новую услугу
              const newService: Service = {
          ...formData as Service,
          id: Date.now().toString()
        }
      updatedServices = [...services, newService]
    }
    
    setServices(updatedServices)
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setServices(services.filter(service => service.id !== id))
  }

  const toggleActive = (id: string) => {
    setServices(services.map(service => 
      service.id === id 
        ? { ...service, active: !service.active }
        : service
    ))
  }

  const saveServices = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ services })
      })
      
      if (response.ok) {
        toast.success('Услуги успешно сохранены')
      } else {
        throw new Error('Failed to save services')
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
          <h1 className="text-3xl font-bold text-gray-900">Управление услугами</h1>
          <p className="text-gray-600 mt-2">Добавление и редактирование услуг компании</p>
        </div>
        <Button onClick={saveServices} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить услуги'}
        </Button>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Hammer className="w-4 h-4" />
            Управление услугами
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Редактирование текста
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Список услуг</h2>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить услугу
            </Button>
          </div>

          <div className="grid gap-4">
            {services.map((service) => (
              <Card key={service.id} className={cn(
                "transition-all",
                !service.active && "opacity-60"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Badge variant={service.popular ? "default" : "secondary"}>
                          {service.popular ? "Популярная" : "Обычная"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{service.title}</h3>
                        <p className="text-gray-600">{service.description}</p>
                        <p className="text-coffee-600 font-medium">{service.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => toggleActive(service.id)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenDialog(service)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(service.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Редактирование текста услуг</h2>
              <p className="text-gray-600 mt-2">Настройка текстового контента страницы услуг</p>
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

          <div className="grid gap-6 md:grid-cols-2">
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
                    placeholder="Механизированная штукатурка стен"
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
                    placeholder="Профессиональная отделка помещений любой сложности"
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
                      placeholder="Получите бесплатную консультацию"
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
                      placeholder="Наши специалисты помогут подобрать оптимальное решение для вашего проекта"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {Object.entries(content.consultation.features).map(([key, feature]) => (
                    <Card key={key}>
                      <CardHeader>
                        <CardTitle className="text-sm capitalize">{key}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Заголовок</Label>
                          <Input
                            value={feature.title}
                            onChange={(e) => setContent({
                              ...content,
                              consultation: {
                                ...content.consultation,
                                features: {
                                  ...content.consultation.features,
                                  [key]: { ...feature, title: e.target.value }
                                }
                              }
                            })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Описание</Label>
                          <Textarea
                            value={feature.description}
                            onChange={(e) => setContent({
                              ...content,
                              consultation: {
                                ...content.consultation,
                                features: {
                                  ...content.consultation.features,
                                  [key]: { ...feature, description: e.target.value }
                                }
                              }
                            })}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Диалог добавления/редактирования услуги */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название услуги</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="от 350₽/м²"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                />
                <Label htmlFor="popular">Популярная услуга</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active !== false}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="active">Активная</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Отмена
              </Button>
              <Button type="submit">
                {editingService ? 'Сохранить' : 'Добавить'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 