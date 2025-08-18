"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  DollarSign,
  Eye,
  EyeOff,
  Star,
  X,
  CreditCard,
  Target,
  Shield,
  Award,
  Calculator,
  MessageSquare
} from "lucide-react"
import { toast } from "sonner"
import { Pricing } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

const PRICING_COLORS = [
  { value: "blue", label: "Синий", className: "bg-blue-500" },
  { value: "green", label: "Зеленый", className: "bg-green-500" },
  { value: "purple", label: "Фиолетовый", className: "bg-purple-500" },
  { value: "orange", label: "Оранжевый", className: "bg-orange-500" },
  { value: "red", label: "Красный", className: "bg-red-500" },
  { value: "coffee", label: "Кофейный", className: "bg-coffee-500" }
]

interface PricingContent {
  header: {
    badge: string
    title: string
    subtitle: string
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
}

export default function PricingPage() {
  const [pricingPlans, setPricingPlans] = useState<Pricing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Pricing | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [formData, setFormData] = useState({
    name: "Стандарт",
    price: "450",
    description: "Базовый тариф для механизированной штукатурки стен",
    features: ["Подготовка поверхности", "Штукатурка стен", "Гарантия 2 года"],
    popular: false,
    color: "coffee",
    active: true
  })

  // Состояние для контента
  const [content, setContent] = useState<PricingContent>({
    header: {
      badge: "Прозрачные цены",
      title: "Тарифы на механизированную штукатурку",
      subtitle: "Выберите подходящий тариф для вашего проекта"
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
    }
  })

  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    loadPricing()
    loadContent()
  }, [])

  const loadPricing = async () => {
    try {
      const response = await fetch('/api/data/pricing')
      if (response.ok) {
        const data = await response.json()
        // Преобразуем данные из API в формат админки
        const pricingPlans = data.pricing?.map((plan: any) => ({
          id: plan.id,
          name: plan.name,
          price: parseInt(plan.price),
          description: plan.description,
          features: plan.features || [],
          popular: plan.popular || false,
          color: "coffee", // устанавливаем цвет по умолчанию
          active: plan.active !== false,
          order: plan.order || 0
        })) || []
        setPricingPlans(pricingPlans)
      } else {
        throw new Error('Failed to load pricing')
      }
    } catch (error) {
      console.error('Ошибка загрузки тарифов:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/pricing-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          // Безопасная инициализация с дефолтными значениями
          const safeContent = {
            header: {
              badge: data.content.header?.badge || "Прозрачные цены",
              title: data.content.header?.title || "Тарифы на механизированную штукатурку",
              subtitle: data.content.header?.subtitle || "Выберите подходящий тариф для вашего проекта"
            },
            benefits: {
              warranty: {
                title: data.content.benefits?.warranty?.title || "Гарантия качества",
                description: data.content.benefits?.warranty?.description || "До 5 лет гарантии на все виды работ"
              },
              team: {
                title: data.content.benefits?.team?.title || "Оптимная команда",
                description: data.content.benefits?.team?.description || "Более 8 лет на рынке строительных услуг"
              },
              rating: {
                title: data.content.benefits?.rating?.title || "Высокий рейтинг",
                description: data.content.benefits?.rating?.description || "4.9/5 звоезд по отзывам клиентов"
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

  const savePricing = async () => {
    setIsSaving(true)
    try {
      // Преобразуем данные админки в формат API
      const apiData = {
        pricing: pricingPlans.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: plan.price.toString(),
          unit: "м²",
          description: plan.description,
          features: plan.features,
          popular: plan.popular,
          active: plan.active,
          order: (plan as any).order || 0
        }))
      }

      const response = await fetch('/api/data/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        toast.success('Тарифы успешно сохранены')
      } else {
        throw new Error('Failed to save pricing')
      }
    } catch (error) {
      console.error('Ошибка сохранения тарифов:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddPlan = () => {
    setIsAddingNew(true)
    setEditingPlan(null)
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false,
      color: "coffee",
      active: true
    })
  }

  const handleEditPlan = (plan: Pricing) => {
    setEditingPlan(plan)
    setIsAddingNew(false)
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      features: plan.features,
      popular: plan.popular,
      color: plan.color,
      active: plan.active
    })
  }

  const handleSavePlan = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Заполните обязательные поля')
      return
    }

    let updatedPlans: Pricing[]

    if (editingPlan) {
      // Обновление существующего тарифа
      updatedPlans = pricingPlans.map(plan => 
        plan.id === editingPlan.id 
          ? {
              ...plan,
              name: formData.name,
              price: parseInt(formData.price),
              description: formData.description,
              features: formData.features,
              popular: formData.popular,
              color: formData.color,
              active: formData.active
            }
          : plan
      )
    } else {
      // Добавление нового тарифа
      const newPlan: Pricing = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseInt(formData.price),
        description: formData.description,
        features: formData.features,
        popular: formData.popular,
        color: formData.color,
        active: formData.active
      }
      updatedPlans = [...pricingPlans, newPlan]
    }

    setPricingPlans(updatedPlans)
    setEditingPlan(null)
    setIsAddingNew(false)
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false,
      color: "coffee",
      active: true
    })

    toast.success(editingPlan ? 'Тариф обновлен' : 'Тариф добавлен')
  }

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот тариф?')) return

    const updatedPlans = pricingPlans.filter(plan => plan.id !== id)
    setPricingPlans(updatedPlans)
    toast.success('Тариф удален')
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
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
          <h1 className="text-3xl font-bold text-gray-900">Управление тарифами</h1>
          <p className="text-gray-600 mt-2">Редактирование тарифов и текстового контента</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={saveContent} 
            disabled={isSaving}
            className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить контент'}
          </Button>
          <Button 
            onClick={savePricing} 
            disabled={isSaving}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить тарифы'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Управление тарифами
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Редактирование текста
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Список тарифов</h2>
            <Button onClick={handleAddPlan} className="bg-coffee-600 hover:bg-coffee-700">
              <Plus className="w-4 h-4 mr-2" />
              Добавить тариф
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <div className="relative h-48">
                  <div className={cn(
                    "w-full h-full flex items-center justify-center",
                    plan.color === "coffee" ? "bg-gradient-to-br from-coffee-100 to-coffee-200" :
                    plan.color === "blue" ? "bg-gradient-to-br from-blue-100 to-blue-200" :
                    plan.color === "green" ? "bg-gradient-to-br from-green-100 to-green-200" :
                    plan.color === "purple" ? "bg-gradient-to-br from-purple-100 to-purple-200" :
                    plan.color === "orange" ? "bg-gradient-to-br from-orange-100 to-orange-200" :
                    "bg-gradient-to-br from-red-100 to-red-200"
                  )}>
                    <DollarSign className="w-12 h-12 text-coffee-600" />
                  </div>
                  {plan.popular && (
                    <Badge className="absolute top-2 right-2 bg-coffee-600 text-white">
                      Популярно
                    </Badge>
                  )}
                  <div className="absolute top-2 left-2">
                    <Switch
                      checked={plan.active}
                      onCheckedChange={(checked) => {
                        const updatedPlans = pricingPlans.map(p => 
                          p.id === plan.id ? { ...p, active: checked } : p
                        )
                        setPricingPlans(updatedPlans)
                      }}
                    />
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                    <span className="text-coffee-600 font-bold">{plan.price}₽/м²</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
                  
                  {plan.features && plan.features.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Включено:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
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
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePlan(plan.id)}
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

          {pricingPlans.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Тарифы не найдены</h3>
                <p className="text-gray-600 mb-4">Начните с добавления первого тарифа</p>
                <Button onClick={handleAddPlan}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить тариф
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
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



          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Преимущества
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Гарантия качества</CardTitle>
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
                    <CardTitle className="text-sm">Оптимная команда</CardTitle>
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
                    <CardTitle className="text-sm">Высокий рейтинг</CardTitle>
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
            </CardContent>
          </Card>


        </TabsContent>
      </Tabs>

      {/* Диалог добавления/редактирования тарифа */}
      {(isAddingNew || editingPlan) && (
        <Card className="fixed inset-4 bg-white border-2 border-coffee-200 rounded-lg shadow-2xl z-50 overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingPlan ? 'Редактировать тариф' : 'Добавить новый тариф'}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingPlan(null)
                  setIsAddingNew(false)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="plan-name">Название тарифа</Label>
                <Input
                  id="plan-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="plan-price">Цена (₽/м²)</Label>
                <Input
                  id="plan-price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="plan-description">Описание</Label>
              <Textarea
                id="plan-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                required
              />
            </div>

            <div>
              <Label>Включенные услуги</Label>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features]
                        newFeatures[index] = e.target.value
                        setFormData({ ...formData, features: newFeatures })
                      }}
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
                <div className="flex items-center space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Добавить услугу"
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-active"
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                />
                <Label htmlFor="plan-active">Активен</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="plan-popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                />
                <Label htmlFor="plan-popular">Популярный</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingPlan(null)
                  setIsAddingNew(false)
                }}
              >
                Отмена
              </Button>
              <Button onClick={handleSavePlan} className="bg-coffee-600 hover:bg-coffee-700">
                {editingPlan ? 'Обновить' : 'Добавить'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 