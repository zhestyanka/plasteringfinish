"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { Calculator, Clock, Shield, RussianRubleIcon as Ruble, Star, Trophy, Users, Phone, Mail, User } from "lucide-react"

interface HeroData {
  title: string
  subtitle: string
  description: string
  stats: Array<{
    icon: string
    label: string
    value: string
  }>
  calculator: {
    mixTypes: Array<{
      id: string
      name: string
      consumption: number
    }>
  }
}

interface CompanyData {
  name: string
  subtitle: string
  rating: number
  reviewsCount: number
  clientsCount: number
  experienceYears: number
  warrantyYears: number
}

export default function HeroSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    area: '',
    message: ''
  })

  // Данные из API
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Механизированная штукатурка",
    subtitle: "в Санкт-Петербурге",
    description: "Профессиональная штукатурка стен и потолков с использованием современного оборудования. Быстро, качественно, с гарантией 5 лет.",
    stats: [
      { icon: "Ruble", label: "Стоимость м²", value: "от 350₽" },
      { icon: "Clock", label: "Скорость работы", value: "100 м²/день" },
      { icon: "Shield", label: "Гарантия", value: "5 лет" }
    ],
    calculator: { mixTypes: [] }
  })

  const [companyData, setCompanyData] = useState<CompanyData>({
    name: "СПБ Штукатурка",
    subtitle: "Механизированная отделка",
    rating: 4.9,
    reviewsCount: 157,
    clientsCount: 500,
    experienceYears: 8,
    warrantyYears: 5
  })

  // Загрузка данных из API
  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await fetch('/api/data/content')
        if (response.ok) {
          const data = await response.json()
          if (data.hero) {
            setHeroData(data.hero)
          }
          if (data.company) {
            setCompanyData(data.company)
          }
        }
      } catch (error) {
        console.error('Error loading hero content:', error)
      }
    }

    loadContent()
  }, [])

  // Калькулятор состояние - с примерными значениями для демонстрации
  const [clientPrice, setClientPrice] = useState('450') // цена за м²
  const [areaToPlaster, setAreaToPlaster] = useState('100') // площадь для штукатурки
  const [layerThickness, setLayerThickness] = useState('1.5') // толщина слоя в см
  const [areaPerShift, setAreaPerShift] = useState('40') // площадь за смену
  const [mixType, setMixType] = useState("knauf") // тип смеси
  const [bagWeight, setBagWeight] = useState('30') // вес мешка в кг
  const [bagPrice, setBagPrice] = useState('350') // цена мешка

  // Используем данные из API или дефолтные значения
  const mixTypes = heroData.calculator?.mixTypes?.length > 0 
    ? heroData.calculator.mixTypes 
    : [
        { id: "knauf", name: "Knauf MP 75", consumption: 8.5 },
        { id: "volma", name: "Волма Гипс-Актив Экстра", consumption: 9.0 },
        { id: "kreisel", name: "Kreisel 501", consumption: 8.8 }
      ]

  // Расчеты калькулятора - БЕЗОПАСНОЕ ПРЕОБРАЗОВАНИЕ
  const selectedMixData = mixTypes.find(mix => mix.id === mixType)
  const clientPriceNum = Number(clientPrice) || 0
  const areaToPlasterNum = Number(areaToPlaster) || 0
  const layerThicknessNum = Number(layerThickness) || 0
  const areaPerShiftNum = Number(areaPerShift) || 0
  const bagWeightNum = Number(bagWeight) || 0
  const bagPriceNum = Number(bagPrice) || 0
  
  const totalWorkCost = areaToPlasterNum * clientPriceNum
  const totalMixConsumption = areaToPlasterNum * (selectedMixData?.consumption || 8.5) * layerThicknessNum
  const bagsNeeded = bagWeightNum > 0 ? Math.ceil(totalMixConsumption / bagWeightNum) : 0
  const mixCost = bagsNeeded * bagPriceNum
  const shiftsNeeded = areaPerShiftNum > 0 ? Math.ceil(areaToPlasterNum / areaPerShiftNum) : 0
  const profit = totalWorkCost - mixCost

  // ФУНКЦИИ ДЛЯ БЕЗОПАСНОГО ФОРМАТИРОВАНИЯ
  const formatNumber = (num: number) => {
    return isNaN(num) || !isFinite(num) ? '0' : num.toLocaleString('ru-RU')
  }

  const formatCount = (num: number) => {
    return isNaN(num) || !isFinite(num) ? '0' : num.toString()
  }

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
        background: `linear-gradient(135deg, #F5DEB3 0%, #DEB887 25%, #D2B48C 50%, #CD853F 75%, #A0522D 100%)`
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-coffee-50/60 to-coffee-100/80"></div>
      
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Геометрические фигуры */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-coffee-300/20 to-coffee-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-coffee-400/20 to-coffee-300/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-coffee-400/15 to-coffee-500/15 rounded-full blur-2xl animate-float"></div>
        
        {/* Строительные элементы */}
        <div className="absolute top-32 right-1/4 w-2 h-20 bg-coffee-400/30 rotate-45"></div>
        <div className="absolute top-32 right-1/4 w-20 h-2 bg-coffee-400/30 rotate-45"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-16 bg-coffee-300/40 -rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-16 h-2 bg-coffee-300/40 -rotate-12"></div>
        
        {/* Сетка */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({length: 12}).map((_, i) => (
              <div key={i} className="border-r border-coffee-600"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="space-y-6 md:space-y-10 text-center lg:text-left">
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star key={star} className={`w-4 h-4 md:w-5 md:h-5 text-coffee-500 ${star <= companyData.rating ? 'fill-current' : ''}`} />
                  ))}
                </div>
                <span className="text-coffee-700 font-medium text-sm md:text-base">
                  {companyData.rating} из 5 • {companyData.reviewsCount} отзывов
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight lg:pr-8">
                <span className="text-gray-800">
                  {heroData.title}
                </span>
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-coffee-700">
                  {heroData.subtitle}
                </span>
              </h1>
              
              <p className="text-base md:text-xl text-gray-600 max-w-md mx-auto lg:mx-0 leading-relaxed lg:pr-8">
                {heroData.description}
              </p>
            </div>

            {/* Stats */}
            <div className={`grid gap-4 md:gap-6 ${
              heroData.stats.length === 1 ? 'grid-cols-1 max-w-xs mx-auto lg:mx-0' :
              heroData.stats.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-3'
            }`}>
              {heroData.stats.map((stat, index) => {
                // Функция для получения иконки по названию
                const getIcon = (iconName: string) => {
                  const icons: { [key: string]: any } = { Ruble, Clock, Shield }
                  return icons[iconName] || Clock
                }
                const IconComponent = getIcon(stat.icon)
                
                return (
                  <div key={index} className="glass-effect rounded-xl p-4 md:p-6 text-center hover:shadow-glow transition-all duration-300">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <IconComponent className="w-5 h-5 md:w-6 md:h-6 text-black" />
                    </div>
                    <div className="text-gray-800 text-xs md:text-sm font-medium">{stat.label}</div>
                    <div className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                )
              })}
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-coffee-600" />
                <span className="text-xs md:text-sm text-gray-600">{companyData.experienceYears}+ лет на рынке</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 md:w-5 md:h-5 text-coffee-600" />
                <span className="text-xs md:text-sm text-gray-600">{companyData.clientsCount}+ довольных клиентов</span>
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

        {/* Калькулятор стоимости работ */}
        <div className="mt-16 md:mt-20">
          <Card className="bg-white border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
            <CardContent className="p-6 md:p-12">
              <div className="text-center mb-8 md:mb-12">
                <div className="inline-flex items-center space-x-2 bg-coffee-100 text-coffee-800 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
                  <Calculator className="w-3 h-3 md:w-4 md:h-4" />
                  <span>Калькулятор стоимости работ</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                  Стоимость работ
                </h3>
                </div>

              <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Левая колонка - Ввод данных */}
                <div className="space-y-6 md:space-y-8">
                  {/* Цены работы */}
                  <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Укажите цены:</h4>
                    <div className="space-y-4">
                  <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Сколько ₽ за м²
                        </label>
                        <Input
                          type="number"
                          value={clientPrice}
                          onChange={(e) => setClientPrice(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Данные объекта */}
                  <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Укажите данные объекта:</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Сколько м² нужно отштукатурить:
                        </label>
                        <Input
                          type="number"
                          value={areaToPlaster}
                          onChange={(e) => setAreaToPlaster(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                      </div>
                  <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Укажите толщину наносимого слоя: см
                        </label>
                        <Input
                          type="number"
                          step="0.1"
                          value={layerThickness}
                          onChange={(e) => setLayerThickness(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                          </div>
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Сколько м² отштукатуриваете в смену:
                        </label>
                        <Input
                          type="number"
                          value={areaPerShift}
                          onChange={(e) => setAreaPerShift(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>

                  {/* Данные по смеси */}
                  <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Укажите данные по смеси:</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Выберите, какой смесью работать:
                        </label>
                        <select
                          value={mixType}
                          onChange={(e) => setMixType(e.target.value)}
                          className="w-full border-2 border-gray-200 focus:border-coffee-400 rounded-xl bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400/20"
                        >
                          {mixTypes.map((mix) => (
                            <option key={mix.id} value={mix.id}>
                              {mix.name}
                            </option>
                          ))}
                        </select>
                      </div>
                  <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Укажите сколько кг в 1 мешке:
                        </label>
                        <Input
                          type="number"
                          value={bagWeight}
                          onChange={(e) => setBagWeight(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                      </div>
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Сколько стоит 1 мешок смеси: ₽ / мешок
                        </label>
                        <Input
                          type="number"
                          value={bagPrice}
                          onChange={(e) => setBagPrice(e.target.value)}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая колонка - Результаты */}
                <div className="space-y-6 md:space-y-8">
                  <div className="bg-gradient-to-br from-coffee-50 to-coffee-100 rounded-2xl p-6 md:p-8 border-2 border-coffee-200">
                    <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">Результаты</h4>
                    
                    <div className="space-y-4 mb-6">
                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Общая стоимость работ на объекте:</div>
                          <div className="text-2xl font-bold text-coffee-600">
                            {formatNumber(totalWorkCost)} ₽
                          </div>
                          <div className="text-xs text-gray-700">Без учёта смеси</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Стоимость смеси составит:</div>
                          <div className="text-2xl font-bold text-coffee-600">
                            {formatNumber(mixCost)} ₽
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Вам понадобится ориентировочно:</div>
                          <div className="text-3xl font-bold text-coffee-600 mb-1">{formatCount(bagsNeeded)}</div>
                          <div className="text-sm text-gray-600">мешков смеси</div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-4 shadow-sm">
                        <div className="text-center">
                          <div className="text-sm text-gray-600 mb-1">Объект будет выполнен за:</div>
                          <div className="text-3xl font-bold text-coffee-600 mb-1">{formatCount(shiftsNeeded)}</div>
                          <div className="text-sm text-gray-600">рабочих смен</div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-coffee-600 to-coffee-500 rounded-xl p-4 shadow-lg">
                    <div className="text-center">
                          <div className="text-sm text-yellow-100/50 mb-1">Доход с объекта составит:</div>
                          <div className="text-3xl font-bold text-yellow-100/50">
                            {formatNumber(profit)} ₽
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center text-xs text-gray-700 border-t border-coffee-200 pt-4">
                      Надёжные штукатурные станции от производителя
                    </div>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
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
