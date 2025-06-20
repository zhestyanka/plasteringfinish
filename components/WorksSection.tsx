"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ExternalLink, 
  MapPin, 
  Calendar, 
  Users, 
  ArrowLeft, 
  ArrowRight,
  Star,
  CheckCircle,
  Eye
} from "lucide-react"

export default function WorksSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const projects = [
    {
      title: "Штукатурка квартиры 85м²",
      location: "ЖК Северная Долина",
      area: "85 м²",
      duration: "5 дней",
      type: "Квартира",
      rating: 5,
      price: "189 000₽",
      images: [
        "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Полная механизированная штукатурка всех помещений с последующей шпаклевкой под покраску"
    },
    {
      title: "Отделка офисного помещения",
      location: "БЦ Невский",
      area: "120 м²",
      duration: "7 дней", 
      type: "Офис",
      rating: 5,
      price: "298 000₽",
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Машинная штукатурка, финишная шпаклевка и покраска офисных помещений"
    },
    {
      title: "Загородный дом 180м²",
      location: "Пушкинский район",
      area: "180 м²",
      duration: "14 дней",
      type: "Дом",
      rating: 5,
      price: "456 000₽",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
      ],
      description: "Комплексная отделка загородного дома включая все внутренние помещения"
    }
  ]

  const nextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length)
  }

  const prevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length)
  }

  const currentProject = projects[currentIndex]

  return (
    <section id="works" className="py-12 md:py-20 bg-gradient-to-br from-white via-coffee-50/20 to-coffee-100/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-32 right-20 w-48 h-48 bg-gradient-to-br from-coffee-300/10 to-coffee-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-16 w-64 h-64 bg-gradient-to-br from-coffee-400/10 to-coffee-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 text-coffee-800 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
            <Eye className="w-3 h-3 md:w-4 md:h-4" />
            <span>Наши работы</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Выполненные проекты
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Более 500 успешно завершенных объектов в Санкт-Петербурге и области
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Main project showcase */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mb-8 md:mb-12">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Images Gallery */}
              <div className="relative h-64 sm:h-80 lg:h-96">
                <div className="grid grid-cols-2 gap-1 h-full">
                  <div className="relative overflow-hidden">
                    <img 
                      src={currentProject.images[0]} 
                      alt="До ремонта"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2">
                      <Badge className="bg-black/70 text-gray-100 border-0 text-xs">
                        До
                      </Badge>
        </div>
        </div>

                  <div className="grid grid-rows-2 gap-1">
                    <div className="relative overflow-hidden">
                  <img
                        src={currentProject.images[1]} 
                        alt="В процессе"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-coffee-600 text-gray-100 border-0 text-xs">
                          Процесс
                        </Badge>
                      </div>
                </div>
                    
                    <div className="relative overflow-hidden">
                      <img 
                        src={currentProject.images[2]} 
                        alt="После ремонта"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-600 text-gray-100 border-0 text-xs">
                          Результат
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation arrows */}
                <div className="absolute top-1/2 left-3 md:left-4 transform -translate-y-1/2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={prevProject}
                    className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white shadow-lg"
                  >
                    <ArrowLeft className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                  </Button>
                </div>
                
                <div className="absolute top-1/2 right-3 md:right-4 transform -translate-y-1/2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextProject}
                    className="w-8 h-8 md:w-10 md:h-10 p-0 rounded-full bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white shadow-lg"
                  >
                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-700" />
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <CardContent className="p-6 md:p-10 flex flex-col justify-center">
                <div className="space-y-4 md:space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-coffee-100 text-coffee-800 border border-coffee-300 text-xs">
                        {currentProject.type}
                      </Badge>
                      <div className="flex items-center">
                        {[1,2,3,4,5].map((star) => (
                          <Star key={star} className="w-3 h-3 md:w-4 md:h-4 text-coffee-500 fill-current" />
                        ))}
                  </div>
                </div>

                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                      {currentProject.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 text-sm md:text-base mb-3 md:mb-4">
                      <MapPin className="w-4 h-4 mr-1 text-coffee-600" />
                      {currentProject.location}
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {currentProject.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                      <div className="text-coffee-800 text-xs md:text-sm font-medium mb-1">Площадь</div>
                      <div className="text-xl md:text-2xl font-bold text-coffee-600">{currentProject.area}</div>
                    </div>
                    
                                          <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                        <div className="text-coffee-800 text-xs md:text-sm font-medium mb-1">Срок выполнения</div>
                      <div className="text-xl md:text-2xl font-bold text-coffee-600">{currentProject.duration}</div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 md:pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-coffee-800 text-xs md:text-sm font-medium mb-1">Стоимость проекта</div>
                        <div className="text-2xl md:text-3xl font-bold text-coffee-600">{currentProject.price}</div>
                      </div>
                      
                      <Button className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-gray-100 border-0 px-4 md:px-6 py-2 md:py-3 text-sm md:text-base">
                        <ExternalLink className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                        Подробнее
                      </Button>
                  </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Project indicators */}
          <div className="flex justify-center space-x-2 md:space-x-3 mb-8 md:mb-12">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-coffee-600 w-6 md:w-8' 
                    : 'bg-gray-300 hover:bg-coffee-400'
                }`}
              />
            ))}
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-coffee-600 mb-1">500+</div>
                <div className="text-xs md:text-sm text-gray-600">Выполненных проектов</div>
                </div>

              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Users className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-coffee-600 mb-1">98%</div>
                <div className="text-xs md:text-sm text-gray-600">Довольных клиентов</div>
                </div>

              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Calendar className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-coffee-600 mb-1">8+</div>
                <div className="text-xs md:text-sm text-gray-600">Лет опыта</div>
                  </div>
              
              <div className="text-center">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-coffee-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Star className="w-6 h-6 md:w-8 md:h-8 text-coffee-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-coffee-600 mb-1">4.9</div>
                <div className="text-xs md:text-sm text-gray-600">Средняя оценка</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
