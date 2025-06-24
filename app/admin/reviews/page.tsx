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
import { 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle,
  MessageSquare,
  Eye,
  EyeOff,
  Star,
  Play,
  Video
} from "lucide-react"
import { toast } from "sonner"
import { TextReview, VideoReview } from "@/lib/admin/types"
import ImageUpload from "@/components/admin/ImageUpload"
import { cn } from "@/lib/utils"

export default function ReviewsPage() {
  const [textReviews, setTextReviews] = useState<TextReview[]>([])
  const [videoReviews, setVideoReviews] = useState<VideoReview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingReview, setEditingReview] = useState<TextReview | VideoReview | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [reviewType, setReviewType] = useState<'text' | 'video'>('text')

  const [textFormData, setTextFormData] = useState({
    name: "",
    role: "",
    title: "",
    text: "",
    rating: 5,
    active: true,
    featured: false
  })

  const [videoFormData, setVideoFormData] = useState({
    title: "",
    thumbnail: "",
    videoUrl: "",
    active: true
  })

  useEffect(() => {
    loadReviews()
  }, [])

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/data/reviews')
      if (response.ok) {
        const data = await response.json()
        setTextReviews(data.textReviews || [])
        setVideoReviews(data.videoReviews || [])
      } else {
        throw new Error('Failed to load reviews')
      }
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveReviews = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textReviews,
          videoReviews
        })
      })
      
      if (response.ok) {
        toast.success('Отзывы успешно сохранены')
      } else {
        throw new Error('Failed to save reviews')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const startEdit = (review: TextReview | VideoReview, type: 'text' | 'video') => {
    setEditingReview(review)
    setReviewType(type)
    
    if (type === 'text') {
      const textReview = review as TextReview
      setTextFormData({
        name: textReview.name,
        role: textReview.role,
        title: textReview.title,
        text: textReview.text,
        rating: textReview.rating,
        active: textReview.active,
        featured: textReview.featured
      })
    } else {
      const videoReview = review as VideoReview
      setVideoFormData({
        title: videoReview.title,
        thumbnail: videoReview.thumbnail,
        videoUrl: videoReview.videoUrl,
        active: videoReview.active
      })
    }
    setIsAddingNew(false)
  }

  const startAdd = (type: 'text' | 'video') => {
    setEditingReview(null)
    setReviewType(type)
    
    if (type === 'text') {
      setTextFormData({
        name: "",
        role: "",
        title: "",
        text: "",
        rating: 5,
        active: true,
        featured: false
      })
    } else {
      setVideoFormData({
        title: "",
        thumbnail: "",
        videoUrl: "",
        active: true
      })
    }
    setIsAddingNew(true)
  }

  const saveForm = async () => {
    if (reviewType === 'text') {
      if (!textFormData.name.trim() || !textFormData.text.trim()) {
        toast.error('Заполните имя и текст отзыва')
        return
      }

      if (editingReview) {
        setTextReviews(prev => prev.map(review => 
          review.id === editingReview.id 
            ? { ...review, ...textFormData }
            : review
        ))
        toast.success('Отзыв обновлен')
      } else {
        const newReview: TextReview = {
          id: Date.now().toString(),
          ...textFormData
        }
        setTextReviews(prev => [...prev, newReview])
        toast.success('Отзыв добавлен')
      }
    } else {
      if (!videoFormData.title.trim() || !videoFormData.videoUrl.trim()) {
        toast.error('Заполните название и ссылку на видео')
        return
      }

      if (editingReview) {
        setVideoReviews(prev => prev.map(review => 
          review.id === editingReview.id 
            ? { ...review, ...videoFormData }
            : review
        ))
        toast.success('Видео отзыв обновлен')
      } else {
        const newReview: VideoReview = {
          id: Date.now().toString(),
          ...videoFormData
        }
        setVideoReviews(prev => [...prev, newReview])
        toast.success('Видео отзыв добавлен')
      }
    }

    cancelEdit()
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveReviews()
    }, 100)
  }

  const deleteReview = async (id: string, type: 'text' | 'video') => {
    if (confirm('Вы уверены, что хотите удалить этот отзыв?')) {
      if (type === 'text') {
        setTextReviews(prev => prev.filter(review => review.id !== id))
      } else {
        setVideoReviews(prev => prev.filter(review => review.id !== id))
      }
      toast.success('Отзыв удален')
      
      // Автоматически сохраняем изменения
      setTimeout(async () => {
        await saveReviews()
      }, 100)
    }
  }

  const toggleActive = async (id: string, type: 'text' | 'video') => {
    if (type === 'text') {
      setTextReviews(prev => prev.map(review => 
        review.id === id 
          ? { ...review, active: !review.active }
          : review
      ))
    } else {
      setVideoReviews(prev => prev.map(review => 
        review.id === id 
          ? { ...review, active: !review.active }
          : review
      ))
    }
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveReviews()
    }, 100)
  }

  const toggleFeatured = async (id: string) => {
    setTextReviews(prev => prev.map(review => 
      review.id === id 
        ? { ...review, featured: !review.featured }
        : review
    ))
    
    // Автоматически сохраняем изменения
    setTimeout(async () => {
      await saveReviews()
    }, 100)
  }

  const cancelEdit = () => {
    setEditingReview(null)
    setIsAddingNew(false)
    setTextFormData({
      name: "",
      role: "",
      title: "",
      text: "",
      rating: 5,
      active: true,
      featured: false
    })
    setVideoFormData({
      title: "",
      thumbnail: "",
      videoUrl: "",
      active: true
    })
  }

  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "w-4 h-4",
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300",
              interactive && "cursor-pointer hover:text-yellow-400"
            )}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Отзывы</h1>
          <p className="text-gray-600 mt-2">Управление отзывами клиентов</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={saveReviews} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить все'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="text" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Текстовые отзывы ({textReviews.length})</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="flex items-center space-x-2">
            <Video className="w-4 h-4" />
            <span>Видео отзывы ({videoReviews.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => startAdd('text')} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Добавить текстовый отзыв
            </Button>
          </div>

          {/* Форма для текстовых отзывов */}
          {isAddingNew && reviewType === 'text' && (
            <Card>
              <CardHeader>
                <CardTitle>Новый текстовый отзыв</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Имя клиента</Label>
                    <Input
                      id="name"
                      value={textFormData.name}
                      onChange={(e) => setTextFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Мария Власова"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Должность/Роль</Label>
                    <Input
                      id="role"
                      value={textFormData.role}
                      onChange={(e) => setTextFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Владелица квартиры"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Заголовок отзыва</Label>
                  <Input
                    id="title"
                    value={textFormData.title}
                    onChange={(e) => setTextFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Отличная работа!"
                  />
                </div>

                <div>
                  <Label htmlFor="text">Текст отзыва</Label>
                  <Textarea
                    id="text"
                    value={textFormData.text}
                    onChange={(e) => setTextFormData(prev => ({ ...prev, text: e.target.value }))}
                    placeholder="Подробный отзыв о работе..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Рейтинг</Label>
                  {renderStars(textFormData.rating, true, (rating) => 
                    setTextFormData(prev => ({ ...prev, rating }))
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={textFormData.active}
                      onCheckedChange={(checked) => setTextFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label>Активный</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={textFormData.featured}
                      onCheckedChange={(checked) => setTextFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <Label>Рекомендуемый</Label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={saveForm}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Добавить отзыв
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Список текстовых отзывов */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {textReviews.map((review) => (
              <Card key={review.id} className={cn("relative", !review.active && "opacity-60")}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{review.title}</CardTitle>
                      <p className="text-sm text-coffee-600 font-medium">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.role}</p>
                      {renderStars(review.rating)}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActive(review.id, 'text')}
                        className={review.active ? "text-green-600" : "text-gray-400"}
                      >
                        {review.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(review, 'text')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReview(review.id, 'text')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed mb-3">
                    {review.text}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.active ? "default" : "secondary"}>
                      {review.active ? "Активен" : "Скрыт"}
                    </Badge>
                    {review.featured && (
                      <Badge variant="outline" className="border-yellow-400 text-yellow-600">
                        Рекомендуемый
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {textReviews.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет текстовых отзывов
                </h3>
                <p className="text-gray-600 mb-4">
                  Добавьте первый отзыв клиента
                </p>
                <Button onClick={() => startAdd('text')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить отзыв
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="video" className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => startAdd('video')} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Добавить видео отзыв
            </Button>
          </div>

          {/* Форма для видео отзывов */}
          {isAddingNew && reviewType === 'video' && (
            <Card>
              <CardHeader>
                <CardTitle>Новый видео отзыв</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="video-title">Название видео</Label>
                  <Input
                    id="video-title"
                    value={videoFormData.title}
                    onChange={(e) => setVideoFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Отзыв о штукатурке офиса в БЦ"
                  />
                </div>

                <div>
                  <Label htmlFor="video-url">Ссылка на видео</Label>
                  <Input
                    id="video-url"
                    value={videoFormData.videoUrl}
                    onChange={(e) => setVideoFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <Label>Превью видео</Label>
                  <ImageUpload
                    value={videoFormData.thumbnail}
                    onChange={(url: string) => setVideoFormData(prev => ({ ...prev, thumbnail: url }))}
                    placeholder="Загрузите превью для видео"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={videoFormData.active}
                    onCheckedChange={(checked) => setVideoFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label>Активное видео</Label>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={saveForm}>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Добавить видео
                  </Button>
                  <Button variant="outline" onClick={cancelEdit}>
                    Отмена
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Список видео отзывов */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videoReviews.map((review) => (
              <Card key={review.id} className={cn("relative", !review.active && "opacity-60")}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg pr-2">{review.title}</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleActive(review.id, 'video')}
                        className={review.active ? "text-green-600" : "text-gray-400"}
                      >
                        {review.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEdit(review, 'video')}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReview(review.id, 'video')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="relative aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {review.thumbnail ? (
                      <img 
                        src={review.thumbnail} 
                        alt={review.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <Video className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.active ? "default" : "secondary"}>
                      {review.active ? "Активен" : "Скрыт"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {videoReviews.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Video className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет видео отзывов
                </h3>
                <p className="text-gray-600 mb-4">
                  Добавьте первый видео отзыв
                </p>
                <Button onClick={() => startAdd('video')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить видео
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
} 