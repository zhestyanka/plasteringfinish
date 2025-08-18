"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface PricingContent {
  header: {
    badge: string
    title: string
    subtitle: string
  }
  paymentMethods: {
    title: string
    description: string
    methods: string[]
  }
  benefits: {
    title: string
    items: {
      title: string
      description: string
    }[]
  }
  calculator: {
    title: string
    subtitle: string
    description: string
  }
  contact: {
    title: string
    subtitle: string
    description: string
  }
}

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

  // Состояние для текстового контента
  const [content, setContent] = useState<PricingContent>({
    header: {
      badge: "Наши тарифы",
      title: "Прозрачные цены на штукатурку",
      subtitle: "Выберите подходящий тариф для вашего проекта"
    },
    paymentMethods: {
      title: "Способы оплаты",
      description: "Удобные варианты оплаты для наших клиентов",
      methods: ["Наличные", "Банковская карта", "Безналичный расчет"]
    },
    benefits: {
      title: "Преимущества работы с нами",
      items: [
        { title: "Гарантия качества", description: "5 лет гарантии на все работы" },
        { title: "Быстрое выполнение", description: "Сроки от 1 дня" },
        { title: "Опытные мастера", description: "Более 8 лет опыта" }
      ]
    },
    calculator: {
      title: "Калькулятор стоимости",
      subtitle: "Рассчитайте стоимость онлайн",
      description: "Быстрый расчет стоимости штукатурных работ"
    },
    contact: {
      title: "Получить консультацию",
      subtitle: "Бесплатная консультация",
      description: "Наш специалист свяжется с вами в течение 15 минут"
    }
  })

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
      const response = await fetch('/api/data/pricing-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          const safeContent = {
            header: {
              badge: data.content.header?.badge || "Наши тарифы",
              title: data.content.header?.title || "Прозрачные цены на штукатурку",
              subtitle: data.content.header?.subtitle || "Выберите подходящий тариф для вашего проекта"
            },
            paymentMethods: {
              title: data.content.paymentMethods?.title || "Способы оплаты",
              description: data.content.paymentMethods?.description || "Удобные варианты оплаты для наших клиентов",
              methods: data.content.paymentMethods?.methods || ["Наличные", "Банковская карта", "Безналичный расчет"]
            },
            benefits: {
              title: data.content.benefits?.title || "Преимущества работы с нами",
              items: data.content.benefits?.items || [
                { title: "Гарантия качества", description: "5 лет гарантии на все работы" },
                { title: "Быстрое выполнение", description: "Сроки от 1 дня" },
                { title: "Опытные мастера", description: "Более 8 лет опыта" }
              ]
            },
            calculator: {
              title: data.content.calculator?.title || "Калькулятор стоимости",
              subtitle: data.content.calculator?.subtitle || "Рассчитайте стоимость онлайн",
              description: data.content.calculator?.description || "Быстрый расчет стоимости штукатурных работ"
            },
            contact: {
              title: data.content.contact?.title || "Получить консультацию",
              subtitle: data.content.contact?.subtitle || "Бесплатная консультация",
              description: data.content.contact?.description || "Наш специалист свяжется с вами в течение 15 минут"
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
      console.error('Ошибка сохранения:', error)
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

  const handleSavePlan = () => {
    if (!formData.name || !formData.price) {
      toast.error('Заполните обязательные поля')
      return
    }

    let updatedPlans: Pricing[]

    if (editingPlan) {
      // Обновляем существующий план
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
      // Добавляем новый план
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
  }

  const handleDeletePlan = (id: string) => {
    setPricingPlans(pricingPlans.filter(plan => plan.id !== id))
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
          <p className="text-gray-600 mt-2">Добавление и редактирование тарифных планов</p>
        </div>
        <Button onClick={savePricing} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить тарифы'}
        </Button>
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Тарифные планы</h2>
            <Button onClick={handleAddPlan}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить тариф
            </Button>
          </div>

          <div className="grid gap-4">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className={cn(
                "transition-all",
                !plan.active && "opacity-60"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Badge variant={plan.popular ? "default" : "secondary"}>
                          {plan.popular ? "Популярный" : "Обычный"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{plan.name}</h3>
                        <p className="text-gray-600">{plan.description}</p>
                        <p className="text-coffee-600 font-medium">{plan.price}₽/м²</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={plan.active}
                        onCheckedChange={() => {
                          setPricingPlans(plans => plans.map(p => 
                            p.id === plan.id ? { ...p, active: !p.active } : p
                          ))
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
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

          {/* Форма добавления/редактирования тарифа */}
          {(isAddingNew || editingPlan) && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {editingPlan ? 'Редактировать тариф' : 'Добавить новый тариф'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Название тарифа</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Стандарт"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Цена (₽/м²)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="450"
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
                    placeholder="Описание тарифного плана"
                  />
                </div>

                <div>
                  <Label>Особенности тарифа</Label>
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
                        placeholder="Добавить особенность"
                        onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                      />
                      <Button type="button" variant="outline" onClick={addFeature}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="popular"
                      checked={formData.popular}
                      onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
                    />
                    <Label htmlFor="popular">Популярный тариф</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                    <Label htmlFor="active">Активный</Label>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingPlan(null)
                      setIsAddingNew(false)
                    }}
                  >
                    Отмена
                  </Button>
                  <Button onClick={handleSavePlan}>
                    {editingPlan ? 'Сохранить' : 'Добавить'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Редактирование текста тарифов</h2>
              <p className="text-gray-600 mt-2">Настройка текстового контента страницы тарифов</p>
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

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
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
                    placeholder="Наши тарифы"
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
                    placeholder="Прозрачные цены на штукатурку"
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
                  <CreditCard className="w-5 h-5" />
                  Способы оплаты
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-title">Заголовок</Label>
                  <Input
                    id="payment-title"
                    value={content.paymentMethods.title}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: { ...content.paymentMethods, title: e.target.value }
                    })}
                    placeholder="Способы оплаты"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-description">Описание</Label>
                  <Textarea
                    id="payment-description"
                    value={content.paymentMethods.description}
                    onChange={(e) => setContent({
                      ...content,
                      paymentMethods: { ...content.paymentMethods, description: e.target.value }
                    })}
                    placeholder="Удобные варианты оплаты для наших клиентов"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Преимущества
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="benefits-title">Заголовок</Label>
                  <Input
                    id="benefits-title"
                    value={content.benefits.title}
                    onChange={(e) => setContent({
                      ...content,
                      benefits: { ...content.benefits, title: e.target.value }
                    })}
                    placeholder="Преимущества работы с нами"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Пункты преимуществ</Label>
                  {content.benefits.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Заголовок {index + 1}</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...content.benefits.items]
                            newItems[index] = { ...item, title: e.target.value }
                            setContent({
                              ...content,
                              benefits: { ...content.benefits, items: newItems }
                            })
                          }}
                        />
                      </div>
                      <div>
                        <Label>Описание {index + 1}</Label>
                        <Input
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...content.benefits.items]
                            newItems[index] = { ...item, description: e.target.value }
                            setContent({
                              ...content,
                              benefits: { ...content.benefits, items: newItems }
                            })
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Контактная форма
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-title">Заголовок</Label>
                  <Input
                    id="contact-title"
                    value={content.contact.title}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, title: e.target.value }
                    })}
                    placeholder="Получить консультацию"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-subtitle">Подзаголовок</Label>
                  <Input
                    id="contact-subtitle"
                    value={content.contact.subtitle}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, subtitle: e.target.value }
                    })}
                    placeholder="Бесплатная консультация"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-description">Описание</Label>
                  <Textarea
                    id="contact-description"
                    value={content.contact.description}
                    onChange={(e) => setContent({
                      ...content,
                      contact: { ...content.contact, description: e.target.value }
                    })}
                    placeholder="Наш специалист свяжется с вами в течение 15 минут"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 