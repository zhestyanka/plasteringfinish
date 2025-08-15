"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Save, 
  Video,
  Plus,
  Trash2
} from "lucide-react"
import { toast } from "sonner"

interface VideoItem {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  active: boolean
}

export default function VideoPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadVideos()
  }, [])

  const loadVideos = async () => {
    try {
      const response = await fetch('/api/data/video')
      if (response.ok) {
        const data = await response.json()
        if (data.video) {
          setVideos(data.video)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки видео:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video: videos
        }),
      })

      if (response.ok) {
        toast.success('Видео успешно обновлены')
      } else {
        throw new Error('Ошибка сохранения')
      }
    } catch (error) {
      console.error('Ошибка сохранения видео:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const addVideo = () => {
    const newVideo: VideoItem = {
      id: Date.now().toString(),
      title: 'Процесс механизированной штукатурки',
      thumbnail: 'https://example.com/thumbnail.jpg',
      videoUrl: 'https://example.com/video.mp4',
      active: true
    }
    setVideos(prev => [...prev, newVideo])
  }

  const removeVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id))
  }

  const updateVideo = (id: string, field: keyof VideoItem, value: string | boolean) => {
    setVideos(prev => prev.map(video => 
      video.id === id ? { ...video, [field]: value } : video
    ))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление видео</h1>
          <p className="text-gray-600 mt-2">Добавляйте и редактируйте видео на сайте</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            onClick={addVideo}
            variant="outline"
            className="border-coffee-600 text-coffee-600 hover:bg-coffee-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Добавить видео
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            className="bg-coffee-600 hover:bg-coffee-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      {/* Videos List */}
      <div className="grid gap-6">
        {videos.map((video, index) => (
          <Card key={video.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-coffee-600" />
                  <span>Видео {index + 1}</span>
                </div>
                <Button
                  onClick={() => removeVideo(video.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor={`title-${video.id}`}>Название видео</Label>
                  <Input
                    id={`title-${video.id}`}
                    value={video.title}
                                         onChange={(e) => updateVideo(video.id, 'title', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`thumbnail-${video.id}`}>URL превью</Label>
                  <Input
                    id={`thumbnail-${video.id}`}
                    value={video.thumbnail}
                                         onChange={(e) => updateVideo(video.id, 'thumbnail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`videoUrl-${video.id}`}>URL видео</Label>
                  <Input
                    id={`videoUrl-${video.id}`}
                    value={video.videoUrl}
                                         onChange={(e) => updateVideo(video.id, 'videoUrl', e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`active-${video.id}`}
                    checked={video.active}
                    onChange={(e) => updateVideo(video.id, 'active', e.target.checked)}
                    className="rounded border-coffee-300 text-coffee-600 focus:ring-coffee-500"
                  />
                  <Label htmlFor={`active-${video.id}`}>Активно</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {videos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Video className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">
              Видео не добавлены. Нажмите "Добавить видео" чтобы создать первое.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Save Button */}
      {videos.length > 0 && (
        <div className="flex justify-end pt-6 border-t">
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
            size="lg"
            className="bg-coffee-600 hover:bg-coffee-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </Button>
        </div>
      )}
    </div>
  )
}
