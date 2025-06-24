"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  Star
} from "lucide-react"
import { toast } from "sonner"
import { Benefit } from "@/lib/admin/types"
import ImageUpload from "@/components/admin/ImageUpload"

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
    order: 0
  })

  useEffect(() => {
    loadBenefits()
  }, [])

  const loadBenefits = async () => {
    try {
      const response = await fetch('/api/data/benefits')
      if (response.ok) {
        const data = await response.json()
        setBenefits(data.benefits || [])
      }
    } catch (error) {
      console.error('Ошибка загрузки преимуществ:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveBenefits = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/benefits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          benefits: benefits
        })
      })
      
      if (response.ok) {
        toast.success('Преимущества успешно сохранены')
      } else {
        throw new Error('Failed to save benefits')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (benefit: Benefit) => {
    setEditingBenefit(benefit)
    setFormData({
      title: benefit.title,
      description: benefit.description,
      icon: benefit.icon || "",
      order: benefit.order || 0
    })
    setIsAddingNew(false)
  }

  const startAdd = () => {
    setEditingBenefit(null)
    setFormData({
      title: "",
      description: "",
      icon: "",
      order: benefits.length + 1
    })
    setIsAddingNew(true)
  }

  const saveForm = async () => {
    if (!formData.title.trim()) {
      toast.error('Введите название преимущества')
      return
    }

    if (editingBenefit) {
      // Редактирование существующего
      setBenefits(prev => prev.map(benefit => 
        benefit.id === editingBenefit.id 
          ? { ...benefit, ...formData }
          : benefit
      ))
      toast.success('Преимущество обновлено')
    } else {
      // Добавление нового
      const newBenefit: Benefit = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        image: formData.icon, // используем icon как image
        order: formData.order,
        active: true
      }
      setBenefits(prev => [...prev, newBenefit])
      toast.success('Преимущество добавлено')
    }

    setEditingBenefit(null)
    setIsAddingNew(false)
    setFormData({ title: "", description: "", icon: "", order: 0 })
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveBenefits()
    }, 100)
  }

  const deleteBenefit = async (id: string) => {
    setBenefits(prev => prev.filter(benefit => benefit.id !== id))
    toast.success('Преимущество удалено')
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveBenefits()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingBenefit(null)
    setIsAddingNew(false)
    setFormData({ title: "", description: "", icon: "", order: 0 })
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
          <h1 className="text-3xl font-bold text-gray-900">Преимущества</h1>
          <p className="text-gray-600 mt-2">Управление преимуществами компании</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={startAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить преимущество
          </Button>
          <Button onClick={saveBenefits} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingBenefit) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingBenefit ? 'Редактирование преимущества' : 'Новое преимущество'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Название</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Быстрые сроки выполнения"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Подробное описание преимущества"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="order">Порядок отображения</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                placeholder="1"
              />
            </div>

            <div>
              <Label>Иконка преимущества</Label>
              <ImageUpload
                value={formData.icon}
                onChange={(url: string) => setFormData(prev => ({ ...prev, icon: url }))}
                placeholder="Загрузите иконку или изображение"
              />
            </div>

            <div className="flex space-x-3">
              <Button onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingBenefit ? 'Сохранить изменения' : 'Добавить преимущество'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список преимуществ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {benefits.map((benefit) => (
          <Card key={benefit.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {benefit.icon && (
                    <div className="w-10 h-10 rounded-lg bg-coffee-100 flex items-center justify-center overflow-hidden">
                      <img 
                        src={benefit.icon} 
                        alt="" 
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    {benefit.order && (
                      <Badge variant="secondary" className="mt-1">
                        #{benefit.order}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(benefit)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteBenefit(benefit.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {benefits.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет преимуществ
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте первое преимущество компании
            </p>
            <Button onClick={startAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить преимущество
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 