"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Phone, Menu, X, Star, Shield, MapPin } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: "Главная", href: "#hero" },
    { name: "Преимущества", href: "#benefits" },
    { name: "Услуги", href: "#services" },
    { name: "Работы", href: "#works" },
    { name: "Цены", href: "#pricing" },
  ]

  const handleMenuClick = (href: string) => {
    setIsMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-black rounded-sm"></div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-black text-gray-800">СПБ Штукатурка</div>
              <div className="text-xs text-gray-700 hidden md:block">Механизированная отделка</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
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
              <span className="text-xs text-gray-600">4.9/5</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-coffee-600" />
              <span className="text-xs text-gray-600">Гарантия 5 лет</span>
            </div>
          </div>

          {/* Phone and Menu for Mobile/Tablet */}
          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Phone Button */}
            <a 
              href="tel:+78121234567" 
              className="flex items-center space-x-2 bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-black px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
            >
              <Phone className="w-3 h-3 md:w-4 md:h-4 text-black" />
              <span className="hidden sm:inline font-medium">+7 (812) 123-45-67</span>
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
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-3">
                {menuItems.map((item) => (
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
                    <span className="text-xs text-gray-600">4.9 из 5 • 157 отзывов</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-coffee-600" />
                    <span>Гарантия 5 лет</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-coffee-600" />
                    <span>Санкт-Петербург</span>
                  </div>
                </div>
                
                <div className="pt-3">
                  <a 
                    href="tel:+78121234567"
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
