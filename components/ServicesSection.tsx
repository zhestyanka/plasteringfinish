"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Hammer, 
  Paintbrush, 
  Zap, 
  Wrench, 
  Phone, 
  MessageCircle,
  Calendar,
  CheckCircle,
  Clock,
  ArrowRight
} from "lucide-react"

interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  image: string
  popular: boolean
  active: boolean
}

interface ServicesData {
  services: Service[]
}

// Функция для получения иконки по названию
const getIcon = (iconName: string) => {
  const icons: { [key: string]: any } = {
    Hammer,
    Paintbrush,
    Zap,
    Wrench
  }
  return icons[iconName] || Hammer
}

export default function ServicesSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  })
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await fetch('/api/data/services')
        if (response.ok) {
          const data: ServicesData = await response.json()
          // Фильтруем только активные услуги
          const activeServices = data.services?.filter(service => service.active) || []
          setServices(activeServices)
        } else {
          console.error('Failed to load services')
        }
      } catch (error) {
        console.error('Error loading services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.')
        setFormData({
          name: '',
          phone: '',
          service: '',
          message: ''
        })
      } else {
        alert(`Ошибка: ${result.message || 'Не удалось отправить заявку'}`)
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.')
    }
  }

  if (isLoading) {
    return (
      <section id="services" className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-coffee-900 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-coffee-800 rounded w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-96 bg-coffee-800 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-12 md:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-coffee-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #CD853F 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, #A0522D 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-600/20 text-coffee-300 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm backdrop-blur-sm border border-coffee-400/30">
            <Hammer className="w-3 h-3 md:w-4 md:h-4" />
            <span>Наши услуги</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Полный комплекс строительных работ
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4">
            От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок
          </p>
        </div>

        <div className={`grid gap-6 md:gap-8 mb-12 md:mb-16 ${
          services.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          services.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
          services.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
          'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}>
          {services.map((service) => {
            const IconComponent = getIcon(service.icon)
            return (
              <Card key={service.id} className="group bg-white/10 backdrop-blur-sm border border-white/20 hover:border-coffee-400/50 transition-all duration-500 overflow-hidden rounded-2xl hover:-translate-y-2 hover:bg-white/15">
                <div className="relative h-40 md:h-48 overflow-hidden">
                  {service.popular && (
                    <Badge className="absolute top-3 md:top-4 right-3 md:right-4 z-10 bg-coffee-600 text-white border-0 text-xs">
                      Популярно
                    </Badge>
                  )}
                  {service.image ? (
                    <img 
                      src={service.image} 
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-coffee-200 to-coffee-300 flex items-center justify-center">
                      <IconComponent className="w-12 h-12 md:w-16 md:h-16 text-coffee-600 opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-coffee-400/30">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-lg md:text-xl font-bold text-gray-100 group-hover:text-coffee-300 transition-colors duration-300">
                      {service.title}
                    </h3>
                    <span className="text-coffee-400 font-bold text-sm md:text-base">
                      {service.price}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-sm leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-xs md:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-coffee-400 mr-2 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-coffee-600 hover:bg-coffee-500 text-gray-100 border-0 transition-all duration-300 group-hover:shadow-lg text-sm md:text-base">
                    Заказать услугу
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Consultation Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-12 border border-white/20 shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-coffee-600/20 text-coffee-300 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
                <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                <span>Бесплатная консультация</span>
              </div>
              
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-4 md:mb-6">
                Не знаете с чего начать?
              </h3>
              
              <p className="text-gray-300 mb-6 md:mb-8 text-lg leading-relaxed">
                Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. 
                Это ни к чему не обязывает.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-600/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <div className="text-gray-100 font-semibold text-sm md:text-base">Быстро</div>
                    <div className="text-gray-300 text-xs md:text-sm">Выезд в день обращения</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-600/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <div className="text-gray-100 font-semibold text-sm md:text-base">Бесплатно</div>
                    <div className="text-gray-300 text-xs md:text-sm">Оценка и консультация</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-600/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <div className="text-gray-100 font-semibold text-sm md:text-base">Удобно</div>
                    <div className="text-gray-300 text-xs md:text-sm">В любое время</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-coffee-600/20 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-coffee-400" />
                  </div>
                  <div>
                    <div className="text-gray-100 font-semibold text-sm md:text-base">Профессионально</div>
                    <div className="text-gray-300 text-xs md:text-sm">Опытный инженер</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <Input
                  placeholder="Ваше имя"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="bg-white/10 border-white/20 text-gray-100 placeholder:text-gray-300 h-12 md:h-14 text-sm md:text-base"
                />
                
                <Input
                  placeholder="Номер телефона"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="bg-white/10 border-white/20 text-gray-100 placeholder:text-gray-300 h-12 md:h-14 text-sm md:text-base"
                />
                
                <Input
                  placeholder="Интересующая услуга"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  className="bg-white/10 border-white/20 text-gray-100 placeholder:text-gray-300 h-12 md:h-14 text-sm md:text-base"
                />
                
                <Textarea
                  placeholder="Дополнительная информация (необязательно)"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="bg-white/10 border-white/20 text-gray-100 placeholder:text-gray-300 min-h-[100px] md:min-h-[120px] text-sm md:text-base"
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-gray-100 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-0"
                >
                  <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Заказать бесплатный выезд
                </Button>
                
                <p className="text-xs text-gray-700 text-center">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
