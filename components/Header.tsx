"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X, Star, Shield, MapPin } from "lucide-react"

interface HeaderData {
  companyName: string
  companySubtitle: string
  phone: string
  rating: number
  reviewsCount: number
  warrantyYears: number
  city: string
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [headerData, setHeaderData] = useState<HeaderData>({
    companyName: "СПБ Штукатурка",
    companySubtitle: "Механизированная отделка",
    phone: "+7 (812) 123-45-67",
    rating: 4.9,
    reviewsCount: 157,
    warrantyYears: 5,
    city: "Санкт-Петербург"
  })
  const [isLoading, setIsLoading] = useState(true)

  // Фиксированное меню навигации согласно требованиям
  const menuItems = [
    { name: "Главная", href: "#hero" },
    { name: "Услуги", href: "#services" },
    { name: "Работы", href: "#works" },
    { name: "Цены", href: "#pricing" },
    { name: "Видео", href: "#video" },
    { name: "Отзывы", href: "#reviews" },
    { name: "Команда", href: "#team" },
    { name: "Оборудование", href: "#equipment" },
    { name: "Контакты", href: "#contacts" }
  ]

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const response = await fetch('/api/data/content')
        if (response.ok) {
          const data = await response.json()
          if (data.header) {
            // Безопасная инициализация с дефолтными значениями
            const safeHeaderData = {
              companyName: data.header.companyName || "СПБ Штукатурка",
              companySubtitle: data.header.companySubtitle || "Механизированная отделка",
              phone: data.header.phone || "+7 (812) 123-45-67",
              rating: data.header.rating || 4.9,
              reviewsCount: data.header.reviewsCount || 157,
              warrantyYears: data.header.warrantyYears || 5,
              city: data.header.city || "Санкт-Петербург"
            }
            setHeaderData(safeHeaderData)
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных хедера:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadHeaderData()
  }, [])

  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b border-gray-200/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16 md:h-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-coffee-600"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-lg border-b border-gray-200/50`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded-sm"></div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-gray-800">{headerData.companyName}</div>
              <div className="text-xs text-gray-700 hidden md:block">{headerData.companySubtitle}</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.href)}
                className="text-gray-700 hover:text-coffee-600 font-medium transition-colors duration-300 relative group text-sm"
              >
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-coffee-500 to-coffee-600 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </nav>

          {/* Desktop Contact Info */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-3 h-3 text-coffee-500 fill-current" />
                ))}
              </div>
              <span className="text-xs text-gray-600">{headerData.rating}/5</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-coffee-600" />
              <span className="text-xs text-gray-600">Гарантия {headerData.warrantyYears} лет</span>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 text-white text-sm px-4 py-2 rounded-lg"
            >
              <a href={`tel:${headerData.phone.replace(/\D/g, '')}`}>
                <Phone className="w-4 h-4 mr-2" />
                {headerData.phone}
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleMenuClick(item.href)}
                  className="text-left px-4 py-2 text-gray-700 hover:bg-coffee-50 hover:text-coffee-600 rounded-lg transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            
            {/* Mobile Contact Info */}
            <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-coffee-500 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{headerData.rating}/5</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-coffee-600" />
                  <span className="text-sm text-gray-600">Гарантия {headerData.warrantyYears} лет</span>
                </div>
              </div>
              
              <Button
                asChild
                className="w-full mx-4 bg-gradient-to-r from-coffee-600 to-coffee-700 hover:from-coffee-700 hover:to-coffee-800 text-white"
              >
                <a href={`tel:${headerData.phone.replace(/\D/g, '')}`}>
                  <Phone className="w-4 h-4 mr-2" />
                  {headerData.phone}
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
