"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle,
  Check,
  Link as LinkIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  className?: string
  multiple?: boolean
  accept?: string
  maxSize?: number // в байтах
  placeholder?: string
}

export default function ImageUpload({
  value,
  onChange,
  className,
  multiple = false,
  accept = "image/*",
  maxSize = 5 * 1024 * 1024, // 5MB
  placeholder = "Выберите изображение или введите URL"
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [urlInput, setUrlInput] = useState(value || "")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const file = files[0]
    
    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError("Пожалуйста, выберите изображение")
      return
    }

    // Проверка размера файла
    if (file.size > maxSize) {
      setError(`Размер файла не должен превышать ${Math.round(maxSize / 1024 / 1024)}MB`)
      return
    }

    setError("")
    setUploading(true)
    setProgress(0)

    try {
      // Имитация загрузки файла
      const formData = new FormData()
      formData.append('file', file)

      // Симуляция прогресса загрузки
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      // В реальном приложении здесь был бы запрос к API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Создаем локальный URL для предварительного просмотра
      const localUrl = URL.createObjectURL(file)
      
      clearInterval(interval)
      setProgress(100)
      
      setTimeout(() => {
        onChange(localUrl)
        setUploading(false)
        setProgress(0)
      }, 500)

    } catch (err) {
      setError("Ошибка загрузки файла")
      setUploading(false)
      setProgress(0)
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setError("")
    }
  }

  const handleRemove = () => {
    onChange("")
    setUrlInput("")
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* URL Input */}
      <div className="space-y-2">
        <Label>URL изображения</Label>
        <div className="flex space-x-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleUrlSubmit}
            disabled={!urlInput.trim()}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Применить
          </Button>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">или</div>

      {/* Upload Area */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive 
            ? "border-coffee-500 bg-coffee-50" 
            : "border-gray-300 hover:border-gray-400",
          "cursor-pointer"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {uploading ? (
          <div className="text-center">
            <div className="w-12 h-12 bg-coffee-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-coffee-600 animate-pulse" />
            </div>
            <p className="text-sm text-gray-600 mb-2">Загрузка файла...</p>
            <Progress value={progress} className="w-full max-w-xs mx-auto" />
            <p className="text-xs text-gray-500 mt-2">{progress}%</p>
          </div>
        ) : value ? (
          <div className="text-center">
            <div className="relative inline-block">
              <img
                src={value}
                alt="Загруженное изображение"
                className="max-w-full max-h-32 rounded-lg object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                className="absolute -top-2 -right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Нажмите для изменения</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">{placeholder}</p>
            <p className="text-xs text-gray-500">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Поддерживаются: JPG, PNG, GIF (макс. {Math.round(maxSize / 1024 / 1024)}MB)
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
} 