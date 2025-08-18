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
  FileText,
  MessageCircle
} from "lucide-react"
import { Service } from "@/lib/admin/types"
import { toast } from "sonner"

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

  // Состояние для текстового контента
  const [contentData, setContentData] = useState({
    header: {
      badge: "Наши услуги",
      title: "Механизированная штукатурка стен",
      subtitle: "Профессиональная отделка помещений любой сложности"
    },
    consultation: {
      title: "Получите бесплатную консультацию",
      description: "Наши специалисты помогут подобрать оптимальное решение для вашего проекта",
      features: {
        fast: { title: "Быстро", description: "Выезд в день обращения" },
        free: { title: "Бесплатно", description: "Оценка и консультация" },
        convenient: { title: "Удобно", description: "В любое время" },
        professional: { title: "Профессионально", description: "Опытный инженер" }
      }
    }
  })

  // Загрузка услуг при монтировании компонента
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
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.services) {
          setContentData(data.services)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки контента услуг:', error)
    }
  }

  const saveContent = async () => {
    try {
      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: contentData
        })
      })

      if (response.ok) {
        toast.success('Контент услуг успешно сохранен')
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Ошибка сохранения контента:', error)
      toast.error('Ошибка сохранения')
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

  const handleSaveServices = async () => {
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
      console.error('Ошибка сохранения услуг:', error)
      toast.error('Ошибка сохранения')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление услугами</h1>
          <p className="text-gray-600 mt-2">Добавление и редактирование услуг компании</p>
        </div>
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Список услуг</h2>
            <div className="flex gap-2">
                             <Button onClick={() => handleOpenDialog()} className="bg-coffee-600 hover:bg-coffee-700">
                 <Plus className="w-4 h-4 mr-2" />
                 Добавить услугу
               </Button>
              <Button onClick={handleSaveServices} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                Сохранить все
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={service.active}
                        onCheckedChange={() => toggleActive(service.id)}
                      />
                      <Button
                        onClick={() => handleOpenDialog(service)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(service.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {service.popular && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      <Star className="w-3 h-3 mr-1" />
                      Популярная
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-3">{service.description}</p>
                  <div className="text-lg font-bold text-coffee-600 mb-3">
                    {service.price}
                  </div>
                  <div className="space-y-1">
                    {service.features?.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1 h-1 bg-coffee-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Текстовый контент</h2>
            <Button onClick={saveContent} className="bg-coffee-600 hover:bg-coffee-700">
              <Save className="w-4 h-4 mr-2" />
              Сохранить контент
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Заголовок секции
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services-badge">Бейдж</Label>
                  <Input
                    id="services-badge"
                    value={contentData.header.badge}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      header: { ...prev.header, badge: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services-title">Заголовок</Label>
                  <Input
                    id="services-title"
                    value={contentData.header.title}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      header: { ...prev.header, title: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="services-subtitle">Подзаголовок</Label>
                  <Textarea
                    id="services-subtitle"
                    value={contentData.header.subtitle}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      header: { ...prev.header, subtitle: e.target.value }
                    }))}
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
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="consultation-title">Заголовок</Label>
                  <Input
                    id="consultation-title"
                    value={contentData.consultation.title}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      consultation: { ...prev.consultation, title: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="consultation-description">Описание</Label>
                  <Textarea
                    id="consultation-description"
                    value={contentData.consultation.description}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      consultation: { ...prev.consultation, description: e.target.value }
                    }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Особенности консультации</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(contentData.consultation.features).map(([key, feature]) => (
                  <div key={key} className="space-y-2">
                    <Label>{feature.title}</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => setContentData(prev => ({
                        ...prev,
                        consultation: {
                          ...prev.consultation,
                          features: {
                            ...prev.consultation.features,
                            [key]: { ...feature, title: e.target.value }
                          }
                        }
                      }))}
                    />
                    <Textarea
                      value={feature.description}
                      onChange={(e) => setContentData(prev => ({
                        ...prev,
                        consultation: {
                          ...prev.consultation,
                          features: {
                            ...prev.consultation.features,
                            [key]: { ...feature, description: e.target.value }
                          }
                        }
                      }))}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название услуги</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Цена</Label>
                <Input
                  id="price"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="от 350₽/м²"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Активна</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="popular"
                  checked={formData.popular || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
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