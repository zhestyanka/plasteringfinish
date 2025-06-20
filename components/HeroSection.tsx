"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calculator, Clock, Shield, RussianRubleIcon as Ruble, Star, Trophy, Users, Phone, Mail, User } from "lucide-react"

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет логика отправки формы
    console.log('Форма отправлена:', formData)
    setIsModalOpen(false)
    // Сброс формы
    setFormData({
      name: '',
      phone: '',
      email: '',
      area: '',
      message: ''
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section
      id="hero"
      className="pt-16 pb-12 md:pt-20 md:pb-20 relative overflow-hidden min-h-screen flex items-center"
      style={{
        background: `linear-gradient(135deg, rgba(139, 69, 19, 0.1) 0%, rgba(160, 82, 45, 0.1) 100%), 
                     url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 coffee-light-gradient opacity-95"></div>
      
      {/* Floating elements - скрыты на мобильных */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-coffee-300/30 to-coffee-400/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-coffee-400/30 to-coffee-300/30 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-coffee-400/20 to-coffee-500/20 rounded-full blur-2xl animate-float"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6 md:space-y-10 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 md:w-5 md:h-5 text-coffee-500 fill-current" />
                  ))}
                </div>
                <span className="text-coffee-700 font-medium text-sm md:text-base">4.9 из 5 • 157 отзывов</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight lg:pr-8">
                <span className="bg-gradient-to-r from-coffee-600 to-coffee-500 bg-clip-text text-transparent">
                  Механизированная
                </span>
                <br />
                <span className="text-gray-800">штукатурка</span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-coffee-700">
                  в Санкт-Петербурге
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-600 max-w-md mx-auto lg:mx-0 leading-relaxed lg:pr-8">
                Профессиональная штукатурка стен и потолков с использованием современного оборудования. 
                Быстро, качественно, с гарантией 5 лет.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="glass-effect rounded-xl p-4 md:p-6 text-center hover:shadow-glow transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Ruble className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div className="text-gray-800 text-xs md:text-sm font-medium">Стоимость м²</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">от 350₽</div>
              </div>

              <div className="glass-effect rounded-xl p-4 md:p-6 text-center hover:shadow-glow transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div className="text-gray-800 text-xs md:text-sm font-medium">Скорость работы</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">100 м²/день</div>
              </div>

              <div className="glass-effect rounded-xl p-4 md:p-6 text-center hover:shadow-glow transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <div className="text-gray-800 text-xs md:text-sm font-medium">Гарантия</div>
                <div className="text-xl md:text-2xl font-bold text-gray-900">5 лет</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-coffee-600" />
                <span className="text-xs md:text-sm text-gray-600">8+ лет на рынке</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-coffee-600" />
                <span className="text-xs md:text-sm text-gray-600">500+ довольных клиентов</span>
              </div>
            </div>
          </div>

          {/* Right Column - CTA */}
          <div className="relative mt-8 lg:mt-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-coffee-600 to-coffee-500 rounded-2xl blur opacity-25"></div>
            <Card className="relative glass-effect border-white/50 shadow-2xl rounded-2xl overflow-hidden">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="flex items-center justify-center space-x-3 mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center">
                    <Calculator className="w-6 h-6 md:w-8 md:h-8 text-black" />
                  </div>
                </div>
                
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Бесплатный расчет</h2>
                  <p className="text-sm md:text-base text-gray-700">
                    Получите точную смету на механизированную штукатурку с выездом инженера
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-coffee-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Выезд в день обращения</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-coffee-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Фиксация цен в договоре</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-coffee-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Гарантия до 5 лет</span>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-black py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Получить расчет бесплатно
                  </Button>
                  
                  <p className="text-xs text-gray-700 text-center">
                    Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Модальное окно с формой обратной связи */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
              Получить расчет бесплатно
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-coffee-600" />
                Ваше имя *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Введите ваше имя"
                className="border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-coffee-600" />
                Телефон *
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+7 (999) 123-45-67"
                className="border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-coffee-600" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="example@mail.ru"
                className="border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-coffee-600" />
                Площадь помещения (м²)
              </Label>
              <Input
                id="area"
                name="area"
                type="number"
                value={formData.area}
                onChange={handleInputChange}
                placeholder="Введите площадь"
                className="border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Дополнительная информация
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Опишите ваш проект..."
                rows={3}
                className="border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-white font-semibold"
              >
                Отправить заявку
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Нажимая "Отправить заявку", вы соглашаетесь с обработкой персональных данных
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  )
}
