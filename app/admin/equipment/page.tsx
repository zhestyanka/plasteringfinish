"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  Settings,
  Eye,
  EyeOff,
  Wrench,
  Truck,
  Zap,
  Shield
} from "lucide-react"
import { toast } from "sonner"
import { Equipment } from "@/lib/admin/types"
import { cn } from "@/lib/utils"

const EQUIPMENT_ICONS = [
  'Hammer',
  'Wrench', 
  'Settings',
  'Truck',
  'Zap',
  'Shield',
  'Tool',
  'Cog'
]

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [formData, setFormData] = useState({
    icon: "",
    title: "",
    subtitle: "",
    description: "",
    count: "",
    active: true
  })

  useEffect(() => {
    loadEquipment()
  }, [])

  const loadEquipment = async () => {
    try {
      const response = await fetch('/api/data/equipment')
      if (response.ok) {
        const data = await response.json()
        // Преобразуем данные из API в формат админки
        const equipmentItems = data.equipment?.map((item: any) => ({
          id: item.id,
          icon: "Settings", // устанавливаем иконку по умолчанию
          title: item.name,
          subtitle: item.specifications?.power || "",
          description: item.description,
          count: "1 единица",
          active: true
        })) || []
        setEquipment(equipmentItems)
      } else {
        throw new Error('Failed to load equipment')
      }
    } catch (error) {
      console.error('Ошибка загрузки оборудования:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveEquipment = async () => {
    setIsSaving(true)
    try {
      // Преобразуем данные админки в формат API
      const apiData = {
        equipment: equipment.map((item, index) => ({
          id: item.id,
          name: item.title,
          type: item.subtitle || "Оборудование",
          description: item.description,
          specifications: {
            quantity: parseInt(item.count?.match(/\d+/)?.[0] || "1"),
            model: item.subtitle || "",
            power: "N/A",
            productivity: "N/A"
          },
          active: item.active,
          order: index + 1
        }))
      }

      const response = await fetch('/api/data/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        toast.success('Оборудование успешно сохранено')
      } else {
        throw new Error('Failed to save equipment')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (item: Equipment) => {
    setEditingEquipment(item)
    setFormData({
      icon: item.icon,
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description,
      count: item.count || "",
      active: item.active
    })
    setIsAddingNew(false)
  }

  const startAdd = () => {
    setEditingEquipment(null)
    setFormData({
      icon: "",
      title: "",
      subtitle: "",
      description: "",
      count: "",
      active: true
    })
    setIsAddingNew(true)
  }

  const saveForm = () => {
    if (!formData.title.trim()) {
      toast.error('Введите название оборудования')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Введите описание')
      return
    }

    if (editingEquipment) {
      setEquipment(prev => prev.map(item => 
        item.id === editingEquipment.id 
          ? { ...item, ...formData }
          : item
      ))
      toast.success('Оборудование обновлено')
    } else {
      const newEquipment: Equipment = {
        id: Date.now().toString(),
        ...formData
      }
      setEquipment(prev => [...prev, newEquipment])
      toast.success('Оборудование добавлено')
    }

    // Автосохранение
    setTimeout(async () => {
      await saveEquipment()
    }, 100)

    cancelEdit()
  }

  const deleteEquipment = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить это оборудование?')) {
      setEquipment(prev => prev.filter(item => item.id !== id))
      toast.success('Оборудование удалено')

      // Автосохранение
      setTimeout(async () => {
        await saveEquipment()
      }, 100)
    }
  }

  const toggleActive = (id: string) => {
    setEquipment(prev => prev.map(item => 
      item.id === id 
        ? { ...item, active: !item.active }
        : item
    ))

    // Автосохранение
    setTimeout(async () => {
      await saveEquipment()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingEquipment(null)
    setIsAddingNew(false)
    setFormData({
      icon: "",
      title: "",
      subtitle: "",
      description: "",
      count: "",
      active: true
    })
  }

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'Truck': Truck,
      'Wrench': Wrench,
      'Settings': Settings,
      'Zap': Zap,
      'Shield': Shield,
      'Tool': Wrench,
      'Cog': Settings
    }
    
    const IconComponent = iconMap[iconName] || Settings
    return <IconComponent className="w-6 h-6" />
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
          <h1 className="text-3xl font-bold text-gray-900">Оборудование</h1>
          <p className="text-gray-600 mt-2">Управление техническим оснащением</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={startAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить оборудование
          </Button>
          <Button onClick={saveEquipment} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingEquipment) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingEquipment ? 'Редактирование оборудования' : 'Новое оборудование'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Название оборудования</Label>
                <Input
                  id="title"
                  value={formData.title}
                                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Модель/Бренд</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
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
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="count">Количество</Label>
                <Input
                  id="count"
                  value={formData.count}
                                      onChange={(e) => setFormData(prev => ({ ...prev, count: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="icon">Иконка</Label>
                <select
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-coffee-500"
                >
                  <option value="">Выберите иконку</option>
                  {EQUIPMENT_ICONS.map(icon => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label>Активное оборудование</Label>
            </div>

            <div className="flex space-x-3">
              <Button onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingEquipment ? 'Сохранить изменения' : 'Добавить оборудование'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список оборудования */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <Card key={item.id} className={cn("relative", !item.active && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-coffee-100 flex items-center justify-center text-coffee-600">
                    {getIconComponent(item.icon)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.subtitle && (
                      <p className="text-sm text-coffee-600 font-medium">{item.subtitle}</p>
                    )}
                    {item.count && (
                      <p className="text-xs text-gray-500">{item.count}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(item.id)}
                    className={item.active ? "text-green-600" : "text-gray-400"}
                  >
                    {item.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteEquipment(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {item.description}
              </p>
              <div className="flex items-center space-x-2">
                <Badge variant={item.active ? "default" : "secondary"}>
                  {item.active ? "Активно" : "Неактивно"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет оборудования
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте первую единицу оборудования
            </p>
            <Button onClick={startAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить оборудование
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 