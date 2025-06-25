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
  menuItems: Array<{ name: string; href: string }>
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
    city: "Санкт-Петербург",
    menuItems: [
      { name: "Главная", href: "#hero" },
      { name: "Услуги", href: "#services" },
      { name: "Работы", href: "#works" },
      { name: "Цены", href: "#pricing" }
    ]
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadHeaderData = async () => {
      try {
        const response = await fetch('/api/data/content')
        if (response.ok) {
          const data = await response.json()
          if (data.header) {
            setHeaderData(data.header)
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

  const menuItems = headerData.menuItems

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
          <nav className="hidden lg:flex items-center space-x-8">
            {headerData.menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMenuClick(item.href)}
                className="text-gray-700 hover:text-coffee-600 font-medium transition-colors duration-300 relative group"
              >
                {item.name}
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-coffee-500 to-coffee-600 group-hover:w-full transition-all duration-300"></div>
              </button>
            ))}
          </nav>

          {/* Desktop Contact Info */}
          <div className="hidden lg:flex items-center space-x-6">
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
          </div>

          {/* Phone and Menu for Mobile/Tablet */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Phone Button */}
            <a 
              href={`tel:${headerData.phone.replace(/\D/g, '')}`}
              className="flex items-center space-x-2 bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-black px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <Phone className="w-3 h-3 md:w-4 md:h-4 text-black" />
              <span className="hidden sm:inline font-medium">{headerData.phone}</span>
              <span className="sm:hidden font-medium">Звонок</span>
            </a>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200/50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                {headerData.menuItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.href)}
                    className="block w-full text-left py-3 px-4 text-gray-700 hover:text-coffee-600 hover:bg-coffee-50 rounded-lg transition-all duration-300 font-medium"
                  >
                    {item.name}
                  </button>
                ))}
              </nav>
              
              {/* Mobile Trust Indicators */}
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[1,2,3,4,5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-coffee-500 fill-current" />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">{headerData.rating} из 5 • {headerData.reviewsCount} отзывов</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-coffee-600" />
                    <span>Гарантия {headerData.warrantyYears} лет</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-coffee-600" />
                    <span>{headerData.city}</span>
                  </div>
                </div>
                
                <div className="pt-3">
                  <a 
                    href={`tel:${headerData.phone.replace(/\D/g, '')}`}
                    className="block w-full text-center bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-black py-3 rounded-lg font-medium transition-all duration-300"
                  >
                    <Phone className="w-4 h-4 inline mr-2 text-black" />
                    Позвонить сейчас
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
