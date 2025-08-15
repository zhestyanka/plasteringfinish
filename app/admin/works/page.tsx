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
  Image as ImageIcon,
  Eye,
  EyeOff,
  Calendar,
  MapPin,
  Building
} from "lucide-react"
import { toast } from "sonner"
import { Project } from "@/lib/admin/types"
import ImageUpload from "@/components/admin/ImageUpload"
import { cn } from "@/lib/utils"

const PROJECT_CATEGORIES = [
  'Квартиры',
  'Офисы',
  'Загородные дома',
  'Коммерческие помещения',
  'Новостройки',
  'Рестораны и кафе'
]

export default function WorksPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    area: "",
    completionDate: "",
    mainImage: "",
    images: [] as string[],
    active: true,
    featured: false
  })

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      const response = await fetch('/api/data/works')
      if (response.ok) {
        const data = await response.json()
        // Преобразуем данные из API в формат админки
        const projectsData = data.works?.map((work: any) => ({
          id: work.id,
          title: work.title,
          description: work.description,
          category: work.category,
          location: work.area || "Не указано",
          area: work.area || "Не указано",
          completionDate: work.duration || "Не указано",
          mainImage: work.images?.[0] || "/placeholder.jpg",
          images: work.images || ["/placeholder.jpg"],
          active: work.active !== false,
          featured: work.featured || false
        })) || []
        setProjects(projectsData)
      } else {
        throw new Error('Failed to load projects')
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveProjects = async () => {
    setIsSaving(true)
    try {
      // Преобразуем данные админки в формат API
      const apiData = {
        works: projects.map((project, index) => ({
          id: project.id,
          title: project.title,
          category: project.category,
          area: project.area,
          duration: project.completionDate,
          description: project.description,
          images: project.images,
          location: project.location,
          active: project.active,
          featured: project.featured,
          order: index + 1
        }))
      }

      const response = await fetch('/api/data/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      })

      if (response.ok) {
        toast.success('Портфолио успешно сохранено')
      } else {
        throw new Error('Failed to save projects')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      location: project.location,
      area: project.area,
      completionDate: project.completionDate,
      mainImage: project.mainImage,
      images: project.images,
      active: project.active,
      featured: project.featured
    })
    setIsAddingNew(false)
  }

  const startAdd = () => {
    setEditingProject(null)
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      area: "",
      completionDate: "",
      mainImage: "",
      images: [],
      active: true,
      featured: false
    })
    setIsAddingNew(true)
  }

  const saveForm = () => {
    if (!formData.title.trim()) {
      toast.error('Введите название проекта')
      return
    }

    if (!formData.category) {
      toast.error('Выберите категорию')
      return
    }

    if (editingProject) {
      setProjects(prev => prev.map(project => 
        project.id === editingProject.id 
          ? { ...project, ...formData }
          : project
      ))
      toast.success('Проект обновлен')
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData
      }
      setProjects(prev => [...prev, newProject])
      toast.success('Проект добавлен')
    }

    // Автосохранение
    setTimeout(async () => {
      await saveProjects()
    }, 100)

    cancelEdit()
  }

  const deleteProject = (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот проект?')) {
      setProjects(prev => prev.filter(project => project.id !== id))
      toast.success('Проект удален')

      // Автосохранение
      setTimeout(async () => {
        await saveProjects()
      }, 100)
    }
  }

  const toggleActive = (id: string) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, active: !project.active }
        : project
    ))

    // Автосохранение
    setTimeout(async () => {
      await saveProjects()
    }, 100)
  }

  const toggleFeatured = (id: string) => {
    setProjects(prev => prev.map(project => 
      project.id === id 
        ? { ...project, featured: !project.featured }
        : project
    ))

    // Автосохранение
    setTimeout(async () => {
      await saveProjects()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingProject(null)
    setIsAddingNew(false)
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      area: "",
      completionDate: "",
      mainImage: "",
      images: [],
      active: true,
      featured: false
    })
  }

  const addImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory)

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
          <h1 className="text-3xl font-bold text-gray-900">Портфолио</h1>
          <p className="text-gray-600 mt-2">Управление выполненными работами</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={startAdd} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Добавить проект
          </Button>
          <Button onClick={saveProjects} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      {/* Фильтр по категориям */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Label>Фильтр по категории:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {PROJECT_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-500">
              Показано: {filteredProjects.length} из {projects.length}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingProject) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProject ? 'Редактирование проекта' : 'Новый проект'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Название проекта</Label>
              <Input
                id="title"
                value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROJECT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="area">Площадь</Label>
                <Input
                  id="area"
                  value={formData.area}
                                      onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="completionDate">Дата завершения</Label>
                <Input
                  id="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="location">Местоположение</Label>
              <Input
                id="location"
                value={formData.location}
                                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>

            <div>
              <Label>Главное изображение</Label>
              <ImageUpload
                value={formData.mainImage}
                onChange={(url: string) => setFormData(prev => ({ ...prev, mainImage: url }))}
                placeholder="Загрузите главное фото проекта"
              />
            </div>

            <div>
              <Label>Дополнительные изображения</Label>
              <div className="space-y-2">
                <ImageUpload
                  value=""
                  onChange={addImage}
                  placeholder="Добавить изображение в галерею"
                />
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={image} 
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="w-3 h-3" />
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
                <Label>Активный проект</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label>Рекомендуемый</Label>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button onClick={saveForm}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {editingProject ? 'Сохранить изменения' : 'Добавить проект'}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Список проектов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className={cn("relative", !project.active && "opacity-60")}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg pr-2">{project.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{project.category}</Badge>
                    {project.featured && (
                      <Badge variant="default" className="bg-yellow-500">
                        Рекомендуемый
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleActive(project.id)}
                    className={project.active ? "text-green-600" : "text-gray-400"}
                  >
                    {project.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(project)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteProject(project.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Главное изображение */}
              <div className="relative aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {project.mainImage ? (
                  <img 
                    src={project.mainImage} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                {project.images.length > 0 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                    +{project.images.length} фото
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                {project.description}
              </p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="w-4 h-4 mr-2" />
                  {project.area}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(project.completionDate).toLocaleDateString('ru-RU')}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && !isAddingNew && (
        <Card>
          <CardContent className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'Нет проектов' : `Нет проектов в категории "${selectedCategory}"`}
            </h3>
            <p className="text-gray-600 mb-4">
              Добавьте первый проект в портфолио
            </p>
            <Button onClick={startAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить проект
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 