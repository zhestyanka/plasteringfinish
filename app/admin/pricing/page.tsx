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
  CreditCard
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
    name: "",
    price: "",
    description: "",
    features: [] as string[],
    popular: false,
    color: "blue",
    active: true
  })

  const [newFeature, setNewFeature] = useState("")

  useEffect(() => {
    loadPricing()
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
          order: parseInt(plan.id) || 1
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

  const startEdit = (plan: Pricing) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      description: plan.description,
      features: [...plan.features],
      popular: plan.popular,
      color: plan.color,
      active: plan.active
    })
    setIsAddingNew(false)
  }

  const startAdd = () => {
    setEditingPlan(null)
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false,
      color: "blue",
      active: true
    })
    setIsAddingNew(true)
  }

  const saveForm = () => {
    if (!formData.name.trim()) {
      toast.error('Введите название тарифа')
      return
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Введите корректную цену')
      return
    }

    if (editingPlan) {
      setPricingPlans(prev => prev.map(plan => 
        plan.id === editingPlan.id 
          ? { ...plan, ...formData }
          : plan
      ))
      toast.success('Тариф обновлен')
    } else {
      const newPlan: Pricing = {
        id: Date.now().toString(),
        ...formData
      }
      setPricingPlans(prev => [...prev, newPlan])
      toast.success('Тариф добавлен')
    }

    // Автосохранение
    setTimeout(async () => {
      await savePricing()
    }, 100)

    cancelEdit()
  }

  const deletePlan = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот тариф?')) {
      setPricingPlans(prev => prev.filter(plan => plan.id !== id))
      toast.success('Тариф удален')
      
      // Автосохранение
      setTimeout(async () => {
        await savePricing()
      }, 100)
    }
  }

  const toggleActive = (id: string) => {
    setPricingPlans(prev => prev.map(plan => 
      plan.id === id 
        ? { ...plan, active: !plan.active }
        : plan
    ))

    // Автосохранение
    setTimeout(async () => {
      await savePricing()
    }, 100)
  }

  const togglePopular = (id: string) => {
    setPricingPlans(prev => prev.map(plan => 
      plan.id === id 
        ? { ...plan, popular: !plan.popular }
        : plan
    ))

    // Автосохранение
    setTimeout(async () => {
      await savePricing()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingPlan(null)
    setIsAddingNew(false)
    setFormData({
      name: "",
      price: "",
      description: "",
      features: [],
      popular: false,
      color: "blue",
      active: true
    })
    setNewFeature("")
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

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    
    // Убираем все нецифровые символы кроме точки
    value = value.replace(/[^\d.]/g, '')
    
    // Если поле пустое, устанавливаем пустую строку
    if (value === '') {
      setFormData(prev => ({ ...prev, price: '' }))
      return
    }
    
    // Убираем нули в начале только если после них есть другие цифры
    if (value.startsWith('0') && value.length > 1 && value[1] !== '.') {
      value = value.replace(/^0+/, '')
    }
    
    // Проверяем что это число
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData(prev => ({ ...prev, price: value }))
    }
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "border-blue-500 bg-blue-50",
      green: "border-green-500 bg-green-50",
      purple: "border-purple-500 bg-purple-50",
      orange: "border-orange-500 bg-orange-50",
      red: "border-red-500 bg-red-50",
      coffee: "border-coffee-500 bg-coffee-50"
    }
    return colorMap[color] || colorMap.blue
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
          <h1 className="text-3xl font-bold text-gray-900">Тарифы</h1>
          <p className="text-gray-600 mt-2">Управление ценовыми планами</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={startAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить тариф
          </Button>
          <Button onClick={savePricing} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingPlan) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingPlan ? 'Редактирование тарифа' : 'Новый тариф'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="price">Цена (руб/м²)</Label>
                <Input
                  id="price"
                  type="text"
                  value={formData.price}
                  onChange={handlePriceChange}
                  placeholder="450"
                />
              </div>

              <div>
                <Label htmlFor="color">Цветовая схема</Label>
                <Select 
                  value={formData.color} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRICING_COLORS.map(color => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center space-x-2">
                          <div className={cn("w-4 h-4 rounded", color.className)}></div>
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Краткое описание тарифа..."
                rows={2}
              />
            </div>

            <div>
              <Label>Особенности тарифа</Label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Добавить особенность..."
                    onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  />
                  <Button type="button" onClick={addFeature}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.features.length > 0 && (
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded">
                        <span className="text-sm">{feature}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFeature(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
                <Label>Активный тариф</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.popular}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                />
                <Label>Популярный тариф</Label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingPlan ? 'Сохранить изменения' : 'Добавить тариф'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список тарифов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pricingPlans.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "relative border-2",
              !plan.active && "opacity-60",
              plan.popular && "ring-2 ring-yellow-400 ring-offset-2",
              getColorClass(plan.color)
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    {plan.popular && (
                      <Badge className="bg-yellow-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Популярный
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-1">руб/м²</span>
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(plan.id)}
                    className={plan.active ? "text-green-600" : "text-gray-400"}
                  >
                    {plan.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePlan(plan.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Включено:</h4>
                  <ul className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant={plan.active ? "default" : "secondary"}>
                    {plan.active ? "Активен" : "Неактивен"}
                  </Badge>
                  {plan.popular && (
                    <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                      Популярный
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pricingPlans.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет тарифов
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте первый ценовой план
            </p>
            <Button onClick={startAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить тариф
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 