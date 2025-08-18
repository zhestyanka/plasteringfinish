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
  FileText,
  MessageCircle
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

  const [newFeature, setNewFeature] = useState("")

  // Состояние для текстового контента
  const [contentData, setContentData] = useState({
    header: {
      badge: "Наши тарифы",
      title: "Прозрачное ценообразование",
      subtitle: "Выберите подходящий тариф для вашего проекта"
    },
    payment: {
      title: "Способы оплаты",
      description: "Удобные способы оплаты для наших клиентов",
      methods: [
        { name: "Наличные", description: "Оплата наличными при выполнении работ" },
        { name: "Банковская карта", description: "Оплата картой через терминал" },
        { name: "Безналичный расчет", description: "Оплата по счету для юридических лиц" }
      ]
    },
    benefits: {
      title: "Преимущества работы с нами",
      description: "Почему клиенты выбирают нашу компанию",
      items: [
        { title: "Гарантия качества", description: "5 лет гарантии на все виды работ" },
        { title: "Опытные мастера", description: "Команда профессионалов с опытом от 5 лет" },
        { title: "Современное оборудование", description: "Используем только качественное оборудование" }
      ]
    }
  })

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
          active: plan.active !== false
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
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.pricing) {
          setContentData(data.pricing)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки контента тарифов:', error)
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
          pricing: contentData
        })
      })

      if (response.ok) {
        toast.success('Контент тарифов успешно сохранен')
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Ошибка сохранения контента:', error)
      toast.error('Ошибка сохранения')
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
          order: 1
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
    setNewFeature("")
  }

  const handleEditPlan = (plan: Pricing) => {
    setIsAddingNew(false)
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      features: plan.features || [],
      popular: plan.popular,
      color: plan.color || "coffee",
      active: plan.active
    })
    setNewFeature("")
  }

  const handleSavePlan = () => {
    if (!formData.name || !formData.price || !formData.description) {
      toast.error('Заполните все обязательные поля')
      return
    }

    const planData = {
      id: editingPlan?.id || Date.now().toString(),
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      features: formData.features,
      popular: formData.popular,
      color: formData.color,
      active: formData.active
    }

    if (editingPlan) {
      // Обновляем существующий план
      setPricingPlans(prev => prev.map(plan => 
        plan.id === editingPlan.id ? planData : plan
      ))
    } else {
      // Добавляем новый план
      setPricingPlans(prev => [...prev, planData])
    }

    // Сбрасываем форму
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false,
      color: "coffee",
      active: true
    })
    setEditingPlan(null)
    setIsAddingNew(false)
    setNewFeature("")
  }

  const handleDeletePlan = (id: string) => {
    setPricingPlans(prev => prev.filter(plan => plan.id !== id))
  }

  const toggleActive = (id: string) => {
    setPricingPlans(prev => prev.map(plan => 
      plan.id === id ? { ...plan, active: !plan.active } : plan
    ))
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
          <p className="text-gray-600 mt-2">Настройка тарифных планов и цен</p>
        </div>
      </div>

      <Tabs defaultValue="pricing" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Управление тарифами
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Редактирование текста
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Тарифные планы</h2>
            <div className="flex gap-2">
              <Button onClick={handleAddPlan} className="bg-coffee-600 hover:bg-coffee-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить тариф
              </Button>
              <Button onClick={savePricing} disabled={isSaving} variant="outline">
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Сохранение...' : 'Сохранить все'}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className={cn("relative", !plan.active && "opacity-60")}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={plan.active}
                        onCheckedChange={() => toggleActive(plan.id)}
                      />
                      <Button
                        onClick={() => handleEditPlan(plan)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeletePlan(plan.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {plan.popular && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500">
                      <Star className="w-3 h-3 mr-1" />
                      Популярный
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-coffee-600 mb-3">
                    {plan.price}₽/м²
                  </div>
                  <p className="text-gray-600 mb-3">{plan.description}</p>
                  <div className="space-y-1">
                    {plan.features?.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Форма добавления/редактирования тарифа */}
          {(isAddingNew || editingPlan) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPlan ? 'Редактировать тариф' : 'Добавить новый тариф'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название тарифа</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Стандарт"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Цена за м²</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="450"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Описание тарифного плана..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Особенности тарифа</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Добавить особенность..."
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature} type="button" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="flex-1">{feature}</span>
                        <Button
                          onClick={() => removeFeature(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                    />
                    <Label htmlFor="popular">Популярный тариф</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Активен</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    onClick={() => {
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
                    }}
                    variant="outline"
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
                  <Label htmlFor="pricing-badge">Бейдж</Label>
                  <Input
                    id="pricing-badge"
                    value={contentData.header.badge}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      header: { ...prev.header, badge: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing-title">Заголовок</Label>
                  <Input
                    id="pricing-title"
                    value={contentData.header.title}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      header: { ...prev.header, title: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pricing-subtitle">Подзаголовок</Label>
                  <Textarea
                    id="pricing-subtitle"
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
                  <CreditCard className="w-5 h-5" />
                  Способы оплаты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-title">Заголовок</Label>
                  <Input
                    id="payment-title"
                    value={contentData.payment.title}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      payment: { ...prev.payment, title: e.target.value }
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-description">Описание</Label>
                  <Textarea
                    id="payment-description"
                    value={contentData.payment.description}
                    onChange={(e) => setContentData(prev => ({
                      ...prev,
                      payment: { ...prev.payment, description: e.target.value }
                    }))}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Методы оплаты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {contentData.payment.methods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Метод {index + 1}</Label>
                    <Input
                      value={method.name}
                      onChange={(e) => {
                        const newMethods = [...contentData.payment.methods]
                        newMethods[index] = { ...method, name: e.target.value }
                        setContentData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, methods: newMethods }
                        }))
                      }}
                    />
                    <Textarea
                      value={method.description}
                      onChange={(e) => {
                        const newMethods = [...contentData.payment.methods]
                        newMethods[index] = { ...method, description: e.target.value }
                        setContentData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, methods: newMethods }
                        }))
                      }}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Преимущества</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {contentData.benefits.items.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Преимущество {index + 1}</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...contentData.benefits.items]
                        newItems[index] = { ...item, title: e.target.value }
                        setContentData(prev => ({
                          ...prev,
                          benefits: { ...prev.benefits, items: newItems }
                        }))
                      }}
                    />
                    <Textarea
                      value={item.description}
                      onChange={(e) => {
                        const newItems = [...contentData.benefits.items]
                        newItems[index] = { ...item, description: e.target.value }
                        setContentData(prev => ({
                          ...prev,
                          benefits: { ...prev.benefits, items: newItems }
                        }))
                      }}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 