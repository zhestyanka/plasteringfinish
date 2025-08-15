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
  EyeOff
} from "lucide-react"
import { Service } from "@/lib/admin/types"

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

  // Загрузка услуг при монтировании компонента
  useEffect(() => {
    loadServices()
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
      setServices(updatedServices)
    } else {
      // Создание новой услуги
      const newService: Service = {
        id: Date.now().toString(),
        icon: formData.icon || "Hammer",
        title: formData.title || "",
        description: formData.description || "",
        price: formData.price || "",
        features: formData.features || [],
        image: formData.image || "",
        popular: formData.popular || false,
        active: formData.active !== false
      }
      updatedServices = [...services, newService]
      setServices(updatedServices)
    }
    
    handleCloseDialog()
    
    // Сохраняем обновленные данные
    try {
      const response = await fetch('/api/data/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: updatedServices
        })
      })
      
      if (response.ok) {
        console.log('Услуги сохранены')
      } else {
        throw new Error('Failed to save services')
      }
    } catch (error) {
      console.error('Ошибка сохранения услуг:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить эту услугу?')) {
      const updatedServices = services.filter(service => service.id !== id)
      setServices(updatedServices)
      
      // Сохраняем обновленные данные
      try {
        const response = await fetch('/api/data/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            services: updatedServices
          })
        })
        
        if (response.ok) {
          console.log('Услуги сохранены')
        } else {
          throw new Error('Failed to save services')
        }
      } catch (error) {
        console.error('Ошибка сохранения услуг:', error)
      }
    }
  }

  const toggleActive = async (id: string) => {
    const updatedServices = services.map(service => 
      service.id === id 
        ? { ...service, active: !service.active }
        : service
    )
    setServices(updatedServices)
    
    // Сохраняем обновленные данные
    try {
      const response = await fetch('/api/data/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: updatedServices
        })
      })
      
      if (response.ok) {
        console.log('Услуги сохранены')
      } else {
        throw new Error('Failed to save services')
      }
    } catch (error) {
      console.error('Ошибка сохранения услуг:', error)
    }
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), ""]
    }))
  }

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }))
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Управление услугами</h1>
          <p className="text-gray-600 mt-1">Добавляйте, редактируйте и управляйте услугами компании</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="bg-coffee-600 hover:bg-coffee-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить услугу
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Редактировать услугу' : 'Добавить новую услугу'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название услуги</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Цена</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL изображения</Label>
                <Input
                  id="image"
                  value={formData.image}
                                      onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <Label>Особенности услуги</Label>
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить особенность
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={formData.popular}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                  />
                  <Label htmlFor="popular">Популярная услуга</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Активна</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Отмена
                </Button>
                <Button type="submit" className="bg-coffee-600 hover:bg-coffee-700">
                  <Save className="w-4 h-4 mr-2" />
                  {editingService ? 'Сохранить' : 'Создать'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className={`relative ${!service.active ? 'opacity-60' : ''}`}>
            {service.popular && (
              <Badge className="absolute top-3 right-3 bg-yellow-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Популярно
              </Badge>
            )}
            
            <div className="aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(service.id)}
                  >
                    {service.active ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-coffee-600 font-semibold">{service.price}</p>
            </CardHeader>
            
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{service.description}</p>
              
              {service.features && service.features.length > 0 && (
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Особенности:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {service.features.map((feature, index) => (
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
            <Button onClick={() => handleOpenDialog()} className="bg-coffee-600 hover:bg-coffee-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить услугу
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 