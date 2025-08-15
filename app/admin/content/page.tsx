"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Save, 
  FileText,
  Home,
  Phone,
  Building2,
  Menu
} from "lucide-react"
import { toast } from "sonner"
import { HeroContent, Contact, Company } from "@/lib/admin/types"

export default function ContentPage() {
  const [heroContent, setHeroContent] = useState<HeroContent>({
    title: "Механизированная штукатурка стен",
    subtitle: "в Санкт-Петербурге",
    description: "Профессиональная механизированная штукатурка стен и потолков с использованием современного оборудования. Быстро, качественно, с гарантией 5 лет. Работаем по всему Санкт-Петербургу и Ленинградской области.",
    stats: [
      { icon: "Ruble", label: "Стоимость", value: "от 350₽" },
      { icon: "Clock", label: "Скорость работы", value: "100 м²/день" },
      { icon: "Shield", label: "Гарантия", value: "5 лет" }
    ],
    calculator: { mixTypes: [] }
  })
  
  const [contact, setContact] = useState<Contact>({
    phone: "+7 (812) 986-98-03",
    email: "9110163777@rambler.ru",
    address: "Санкт-Петербург, ул. Примерная, д. 123",
    workingHours: "Пн-Вс: 8:00-20:00"
  })
  
  const [headerData, setHeaderData] = useState({
    companyName: "Штукатур СПб",
    companySubtitle: "Механизированная отделка",
    phone: "+7 (812) 986-98-03",
    rating: 4.9,
    reviewsCount: 157,
    warrantyYears: 5,
    city: "Санкт-Петербург",
    menuItems: [
      { name: "Главная", href: "#hero" },
      { name: "Услуги", href: "#services" },
      { name: "Работы", href: "#works" },
      { name: "Цены", href: "#pricing" }
    ]
  })
  
  const [company, setCompany] = useState<Company>({
    name: "Штукатур СПб",
    subtitle: "Профессиональная механизированная штукатурка",
    rating: 4.9,
    reviewsCount: 157,
    clientsCount: 1250,
    experienceYears: 8,
    warrantyYears: 5
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        setHeroContent(data.hero || {})
        setContact(data.contacts || {})
        setHeaderData(data.header || {})
        setCompany(data.company || {})
      } else {
        throw new Error('Failed to load content')
      }
    } catch (error) {
      console.error('Ошибка загрузки контента:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hero: heroContent,
          header: headerData,
          contacts: contact,
          company: company
        })
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
          <h1 className="text-3xl font-bold text-gray-900">Управление контентом</h1>
          <p className="text-gray-600 mt-2">Редактирование основной информации на сайте</p>
        </div>
        <Button onClick={saveContent} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить все'}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="hero" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Главная страница</span>
          </TabsTrigger>
          <TabsTrigger value="header" className="flex items-center space-x-2">
            <Menu className="w-4 h-4" />
            <span>Хедер</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>Контакты</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>О компании</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Главная секция (Hero)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="hero-title">Заголовок</Label>
                <Input
                  id="hero-title"
                  value={heroContent.title}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="hero-subtitle">Подзаголовок</Label>
                <Input
                  id="hero-subtitle"
                  value={heroContent.subtitle}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="hero-description">Описание</Label>
                <Textarea
                  id="hero-description"
                  value={heroContent.description}
                  onChange={(e) => setHeroContent(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {heroContent.stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <Label>Статистика {index + 1}</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const newStats = [...heroContent.stats]
                          newStats[index] = { ...stat, label: e.target.value }
                          setHeroContent(prev => ({ ...prev, stats: newStats }))
                        }}
                      />
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...heroContent.stats]
                          newStats[index] = { ...stat, value: e.target.value }
                          setHeroContent(prev => ({ ...prev, stats: newStats }))
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="header" className="space-y-6">
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
                  />
                </div>

                <div>
                  <Label htmlFor="company-subtitle">Подзаголовок</Label>
                  <Input
                    id="company-subtitle"
                    value={headerData.companySubtitle || ''}
                    onChange={(e) => setHeaderData(prev => ({ ...prev, companySubtitle: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="header-phone">Телефон в хедере</Label>
                  <Input
                    id="header-phone"
                    value={headerData.phone || ''}
                    onChange={(e) => setHeaderData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="header-city">Город</Label>
                  <Input
                    id="header-city"
                    value={headerData.city || ''}
                    onChange={(e) => setHeaderData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  />
                </div>

                <div>
                  <Label htmlFor="header-reviews">Количество отзывов</Label>
                  <Input
                    id="header-reviews"
                    type="number"
                    value={headerData.reviewsCount || 0}
                    onChange={(e) => setHeaderData(prev => ({ ...prev, reviewsCount: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="header-warranty">Гарантия (лет)</Label>
                  <Input
                    id="header-warranty"
                    type="number"
                    value={headerData.warrantyYears || 5}
                    onChange={(e) => setHeaderData(prev => ({ ...prev, warrantyYears: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Меню навигации</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {headerData.menuItems?.map((item, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Название пункта меню {index + 1}</Label>
                    <Input
                      value={item.name || ''}
                      onChange={(e) => {
                        const newMenuItems = [...(headerData.menuItems || [])]
                        newMenuItems[index] = { ...item, name: e.target.value }
                        setHeaderData(prev => ({ ...prev, menuItems: newMenuItems }))
                      }}
                      placeholder="Главная"
                    />
                  </div>
                  <div>
                    <Label>Ссылка (якорь)</Label>
                    <Input
                      value={item.href || ''}
                      onChange={(e) => {
                        const newMenuItems = [...(headerData.menuItems || [])]
                        newMenuItems[index] = { ...item, href: e.target.value }
                        setHeaderData(prev => ({ ...prev, menuItems: newMenuItems }))
                      }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="contact-address">Адрес</Label>
                <Input
                  id="contact-address"
                  value={contact.address}
                  onChange={(e) => setContact(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="contact-hours">Часы работы</Label>
                <Input
                  id="contact-hours"
                  value={contact.workingHours}
                  onChange={(e) => setContact(prev => ({ ...prev, workingHours: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="contact-phone">Телефон</Label>
                <Input
                  id="contact-phone"
                  value={contact.phone || ''}
                  onChange={(e) => setContact(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Информация о компании</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company-name">Название компании</Label>
                  <Input
                    id="company-name"
                    value={company.name}
                    onChange={(e) => setCompany(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company-subtitle">Слоган</Label>
                  <Input
                    id="company-subtitle"
                    value={company.subtitle}
                    onChange={(e) => setCompany(prev => ({ ...prev, subtitle: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="company-rating">Рейтинг</Label>
                  <Input
                    id="company-rating"
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={company.rating}
                    onChange={(e) => setCompany(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company-reviews">Отзывов</Label>
                  <Input
                    id="company-reviews"
                    type="number"
                    value={company.reviewsCount}
                    onChange={(e) => setCompany(prev => ({ ...prev, reviewsCount: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company-clients">Клиентов</Label>
                  <Input
                    id="company-clients"
                    type="number"
                    value={company.clientsCount}
                    onChange={(e) => setCompany(prev => ({ ...prev, clientsCount: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company-experience">Лет опыта</Label>
                  <Input
                    id="company-experience"
                    type="number"
                    value={company.experienceYears}
                    onChange={(e) => setCompany(prev => ({ ...prev, experienceYears: Number(e.target.value) }))}
                  />
                </div>

                <div>
                  <Label htmlFor="company-warranty">Гарантия (лет)</Label>
                  <Input
                    id="company-warranty"
                    type="number"
                    value={company.warrantyYears}
                    onChange={(e) => setCompany(prev => ({ ...prev, warrantyYears: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 