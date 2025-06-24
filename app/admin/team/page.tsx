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
  Users,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { TeamMember } from "@/lib/admin/types"
import ImageUpload from "@/components/admin/ImageUpload"
import { cn } from "@/lib/utils"

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    experience: "",
    certificate: "",
    image: "",
    active: true
  })

  useEffect(() => {
    loadTeam()
  }, [])

  const loadTeam = async () => {
    try {
             const response = await fetch('/api/data/team')
       if (response.ok) {
         const data = await response.json()
         setTeamMembers(data.team || [])
      } else {
        throw new Error('Failed to load team')
      }
    } catch (error) {
      console.error('Ошибка загрузки команды:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveTeam = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team: teamMembers
        })
      })
      
      if (response.ok) {
        toast.success('Данные команды успешно сохранены')
      } else {
        throw new Error('Failed to save team')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      name: member.name,
      role: member.role,
      experience: member.experience,
      certificate: member.certificate || "",
      image: member.image || "",
      active: member.active
    })
    setIsAddingNew(false)
  }

  const startAdd = () => {
    setEditingMember(null)
    setFormData({
      name: "",
      role: "",
      experience: "",
      certificate: "",
      image: "",
      active: true
    })
    setIsAddingNew(true)
  }

  const saveForm = async () => {
    if (!formData.name.trim()) {
      toast.error('Введите имя сотрудника')
      return
    }

    if (!formData.role.trim()) {
      toast.error('Введите должность')
      return
    }

    if (editingMember) {
      // Редактирование существующего
      setTeamMembers(prev => prev.map(member => 
        member.id === editingMember.id 
          ? { ...member, ...formData }
          : member
      ))
      toast.success('Сотрудник обновлен')
    } else {
      // Добавление нового
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        experience: formData.experience,
        certificate: formData.certificate,
        image: formData.image,
        active: formData.active
      }
      setTeamMembers(prev => [...prev, newMember])
      toast.success('Сотрудник добавлен')
    }

    setEditingMember(null)
    setIsAddingNew(false)
    setFormData({
      name: "",
      role: "",
      experience: "",
      certificate: "",
      image: "",
      active: true
    })
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveTeam()
    }, 100)
  }

  const deleteMember = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этого сотрудника?')) {
      setTeamMembers(prev => prev.filter(member => member.id !== id))
      toast.success('Сотрудник удален')
      
      // Автоматически сохраняем изменения
      setTimeout(async () => {
        await saveTeam()
      }, 100)
    }
  }

  const toggleActive = async (id: string) => {
    setTeamMembers(prev => prev.map(member => 
      member.id === id 
        ? { ...member, active: !member.active }
        : member
    ))
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveTeam()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingMember(null)
    setIsAddingNew(false)
    setFormData({
      name: "",
      role: "",
      experience: "",
      certificate: "",
      image: "",
      active: true
    })
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
          <h1 className="text-3xl font-bold text-gray-900">Команда</h1>
          <p className="text-gray-600 mt-2">Управление сотрудниками компании</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={startAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить сотрудника
          </Button>
          <Button onClick={saveTeam} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingMember) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingMember ? 'Редактирование сотрудника' : 'Новый сотрудник'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Имя и фамилия</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Алексей Иванов"
                />
              </div>

              <div>
                <Label htmlFor="role">Должность</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="Главный инженер"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="experience">Опыт работы</Label>
              <Input
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="12 лет опыта"
              />
            </div>

            <div>
              <Label htmlFor="certificate">Сертификаты и квалификация</Label>
              <Textarea
                id="certificate"
                value={formData.certificate}
                onChange={(e) => setFormData(prev => ({ ...prev, certificate: e.target.value }))}
                placeholder="Сертификат мастера штукатурных работ"
                rows={3}
              />
            </div>

            <div>
              <Label>Фотография сотрудника</Label>
              <ImageUpload
                value={formData.image}
                onChange={(url: string) => setFormData(prev => ({ ...prev, image: url }))}
                placeholder="Загрузите фотографию сотрудника"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label>Активный сотрудник</Label>
            </div>

            <div className="flex space-x-3">
              <Button onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingMember ? 'Сохранить изменения' : 'Добавить сотрудника'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список сотрудников */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers.map((member) => (
          <Card key={member.id} className={cn("relative", !member.active && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-coffee-100 flex items-center justify-center overflow-hidden">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <Users className="w-6 h-6 text-coffee-600" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-coffee-600 font-medium">{member.role}</p>
                    <p className="text-xs text-gray-500">{member.experience}</p>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(member.id)}
                    className={member.active ? "text-green-600" : "text-gray-400"}
                  >
                    {member.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(member)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteMember(member.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {member.certificate && (
                <div className="mb-3">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.certificate}
                  </p>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Badge variant={member.active ? "default" : "secondary"}>
                  {member.active ? "Активен" : "Неактивен"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет сотрудников
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте первого сотрудника в команду
            </p>
            <Button onClick={startAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить сотрудника
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 