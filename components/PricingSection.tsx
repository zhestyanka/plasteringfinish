"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

import { Check, Star, Phone, Mail, MapPin, Clock, ArrowRight, Zap, Shield, Award, Target, Calculator, CheckCircle, Wallet } from "lucide-react"

interface PricingPlan {
  id: string
  name: string
  price: string
  unit: string
  description: string
  features: string[]
  popular: boolean
  active: boolean
  order: number
}

interface PricingData {
  pricing: PricingPlan[]
}

export default function PricingSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    area: "",
    message: ""
  })

  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState("standard")
  const [area, setArea] = useState(70)
  const [rooms, setRooms] = useState(2)

  useEffect(() => {
    const loadPricing = async () => {
      try {
        const response = await fetch('/api/data/pricing')
        if (response.ok) {
          const data: PricingData = await response.json()
          // Фильтруем только активные тарифы и сортируем по порядку
          const activePlans = data.pricing?.filter(plan => plan.active) || []
          activePlans.sort((a, b) => (a.order || 0) - (b.order || 0))
          setPlans(activePlans)
          
          // Устанавливаем популярный план как выбранный по умолчанию
          const popularPlan = activePlans.find(plan => plan.popular)
          if (popularPlan) {
            setSelectedPlan(popularPlan.id)
          } else if (activePlans.length > 0) {
            setSelectedPlan(activePlans[0].id)
          }
        } else {
          console.error('Failed to load pricing')
        }
      } catch (error) {
        console.error('Error loading pricing:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPricing()
  }, [])

  const paymentMethods = [
    {
      name: "Наличные",
      description: "Оплата наличными при завершении работ",
      icon: Wallet,
      discount: 0
    },
    {
      name: "Банковская карта",
      description: "Безналичная оплата картой, возможна рассрочка",
      icon: Wallet,
      discount: 0
    },
    {
      name: "Банковский перевод",
      description: "Оплата по счету для юридических лиц",
      icon: Shield,
      discount: 5
    }
  ]

  const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
  const totalCost = area * (selectedPlanData?.price ? parseInt(selectedPlanData.price) : 450)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataWithPricing = {
        ...formData,
        selectedPlan: selectedPlan,
        area: area,
        totalCost: totalCost,
        type: 'pricing'
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithPricing)
      })

      const result = await response.json()

      if (response.ok) {
        alert('�������! ���� ������ ����������. �� �������� � ���� � ��������� �����.')
        setFormData({
          name: '',
          phone: '',
          email: '',
          area: '',
          message: ''
        })
        setArea(100)
        setSelectedPlan('basic')
      } else {
        alert(`������: ${result.error || '�� ������� ��������� ������'}`)
      }
    } catch (error) {
      console.error('������ �������� �����:', error)
      alert('��������� ������ ��� �������� ������. ���������� ��� ���.')
    }
  }

  if (isLoading) {
    return (
      <section id="pricing" className="py-12 md:py-20 bg-gradient-to-br from-coffee-50/30 via-white to-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-coffee-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-96 bg-coffee-100 rounded-2xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="pricing" className="py-12 md:py-20 bg-gradient-to-br from-coffee-50/30 via-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements - скрыты на мобильных */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-coffee-300/10 to-coffee-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-gradient-to-br from-coffee-400/10 to-coffee-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 text-coffee-800 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
            <Target className="w-3 h-3 md:w-4 md:h-4" />
            <span>Прозрачные цены</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Тарифы на механизированную штукатурку
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Выберите подходящий тариф для вашего проекта
          </p>
        </div>

        {/* Pricing Cards */}
        <div className={`grid gap-6 md:gap-8 mb-12 md:mb-16 ${
          plans.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          plans.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 cursor-pointer border-2 ${
                selectedPlan === plan.id 
                  ? 'border-coffee-500 shadow-2xl scale-105' 
                  : 'border-gray-200 hover:border-coffee-300 hover:shadow-xl'
              } ${plan.popular ? 'ring-2 ring-coffee-200' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0">
                  <div className="bg-gradient-to-r from-coffee-600 to-coffee-500 text-white text-center py-2 text-sm font-medium">
                    Самый популярный
                  </div>
                </div>
              )}
              
              <CardHeader className={`text-center ${plan.popular ? 'pt-12' : 'pt-6'} pb-4`}>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl md:text-4xl font-bold text-coffee-600">{plan.price}₽</span>
                    <span className="text-gray-600 ml-1">/{plan.unit}</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-600 px-2">{plan.description}</p>
                </div>
              </CardHeader>
              
              <CardContent className="px-4 md:px-6 pb-6 md:pb-8">
                <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-coffee-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm md:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full py-3 md:py-4 text-sm md:text-base font-semibold rounded-xl transition-all duration-300 ${
                    selectedPlan === plan.id
                      ? 'bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-coffee-100 border-2 border-coffee-600 shadow-lg'
                      : 'bg-white hover:bg-coffee-50 text-coffee-600 border-2 border-coffee-300 hover:border-coffee-500'
                  }`}
                >
                  {selectedPlan === plan.id ? 'Выбрано' : 'Выбрать тариф'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          {paymentMethods.map((method, index) => (
            <Card key={index} className="bg-white border border-gray-200 hover:border-coffee-300 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 md:p-8 text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <method.icon className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">{method.name}</h3>
                <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{method.description}</p>
                {method.discount > 0 && (
                  <Badge className="bg-coffee-100 text-coffee-800 text-xs">
                    Скидка {method.discount}%
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Гарантия качества</h4>
              <p className="text-gray-600 text-sm md:text-base">До 5 лет гарантии на все виды работ</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Опытная команда</h4>
              <p className="text-gray-600 text-sm md:text-base">Более 8 лет на рынке строительных услуг</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
              </div>
              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Высокий рейтинг</h4>
              <p className="text-gray-600 text-sm md:text-base">4.9/5 звезд по отзывам клиентов</p>
            </div>
          </div>
        </div>

        {/* Advanced Consultation Form */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
                Получите точную смету
              </h3>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                Наш инженер приедет бесплатно, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего объекта
              </p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="flex flex-col items-center lg:items-start space-y-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-500 rounded-2xl flex items-center justify-center">
                  <Shield className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-bold text-gray-900 text-base md:text-lg">Гарантия</div>
                  <div className="text-gray-600 text-sm md:text-base">до 7 лет</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start space-y-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-500 rounded-2xl flex items-center justify-center">
                  <Clock className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-bold text-gray-900 text-base md:text-lg">Выезд</div>
                  <div className="text-gray-600 text-sm md:text-base">в день обращения</div>
                </div>
              </div>
              
              <div className="flex flex-col items-center lg:items-start space-y-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-500 rounded-2xl flex items-center justify-center">
                  <Award className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-bold text-gray-900 text-base md:text-lg">Качество</div>
                  <div className="text-gray-600 text-sm md:text-base">по ГОСТ</div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-coffee-50 rounded-2xl p-4 md:p-6 border border-coffee-200">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className="w-4 h-4 md:w-5 md:h-5 text-coffee-500 fill-current" />
                  ))}
                </div>
                <div className="text-center lg:text-left">
                  <div className="font-bold text-coffee-900 text-base md:text-lg">4.9 из 5</div>
                  <div className="text-coffee-800 text-xs md:text-sm">157 отзывов на Яндекс.Картах</div>
                </div>
              </div>
            </div>
          </div>

          <Card className="shadow-2xl rounded-2xl border-0 overflow-hidden">
            <CardContent className="p-6 md:p-8 bg-gradient-to-br from-white to-coffee-50/30">
              <div className="flex items-center space-x-3 mb-6 md:mb-8">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl md:text-2xl font-bold text-gray-900">Заказать расчет</h4>
                  <p className="text-xs md:text-sm text-gray-600">Бесплатно и без обязательств</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div>
                  <Input
                    placeholder="Ваше имя"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl h-11 md:h-14 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Номер телефона"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl h-11 md:h-14 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Площадь помещения (м²)"
                    type="text"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl h-11 md:h-14 text-sm md:text-base"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Дополнительная информация о проекте"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl min-h-[80px] md:min-h-[100px] text-sm md:text-base"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] group"
                >
                  ПОЛУЧИТЬ РАСЧЕТ БЕСПЛАТНО
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3 h-3 md:w-4 md:h-4 text-coffee-600" />
                    <span>+7 (812) 123-45-67</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3 h-3 md:w-4 md:h-4 text-coffee-600" />
                    <span>info@shtukaturka-spb.ru</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-coffee-600" />
                    <span>Санкт-Петербург</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 text-coffee-600" />
                    <span>Ежедневно 9:00-21:00</span>
                  </div>
                </div>
                
                <p className="text-center text-xs text-gray-700">
                  Нажимая кнопку, вы соглашаетесь с обработкой персональных данных
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

