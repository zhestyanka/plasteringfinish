"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { toast } from "sonner"

export default function HeaderPage() {
  const [headerData, setHeaderData] = useState({
    companyName: "Штукатур СПб",
    companySubtitle: "Механизированная отделка",
    phone: "+7 (812) 986-98-03",
    rating: 4.9,
    reviewsCount: 157,
    warrantyYears: 5,
    city: "Санкт-Петербург",
    warrantyText: "5 лет"
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadHeaderData()
  }, [])

  const loadHeaderData = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.header) {
          // Убираем menuItems из данных, так как они больше не редактируются
          const { menuItems, ...headerDataWithoutMenu } = data.header
          setHeaderData(headerDataWithoutMenu)
        }
      } else {
        throw new Error('Failed to load header data')
      }
    } catch (error) {
      console.error('Ошибка загрузки данных хедера:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveHeaderData = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          header: headerData
        })
      })
      
      if (response.ok) {
        toast.success('Данные хедера успешно сохранены')
      } else {
        throw new Error('Failed to save header data')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Управление хедером</h1>
          <p className="text-gray-600 mt-2">Редактирование информации в хедере сайта</p>
        </div>
        <Button onClick={saveHeaderData} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Настройки хедера</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company-name">Название компании</Label>
              <Input
                id="company-name"
                value={headerData.companyName || ''}
                onChange={(e) => setHeaderData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Название компании"
              />
            </div>

            <div>
              <Label htmlFor="company-subtitle">Подзаголовок</Label>
              <Input
                id="company-subtitle"
                value={headerData.companySubtitle || ''}
                onChange={(e) => setHeaderData(prev => ({ ...prev, companySubtitle: e.target.value }))}
                placeholder="Подзаголовок компании"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="header-rating">Рейтинг</Label>
              <Input
                id="header-rating"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={headerData.rating || 4.9}
                onChange={(e) => setHeaderData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                placeholder="4.9"
              />
            </div>

            <div>
              <Label htmlFor="header-warranty">Гарантия</Label>
              <Input
                id="header-warranty"
                value={headerData.warrantyText || '5 лет'}
                onChange={(e) => setHeaderData(prev => ({ ...prev, warrantyText: e.target.value }))}
                placeholder="5 лет"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
