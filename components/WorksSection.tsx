"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  MapPin, 
  Ruler, 
  Clock, 
  Star,
  ChevronLeft,
  ChevronRight,
  Eye
} from "lucide-react"

interface WorkProject {
  id: string
  title: string
  category: string
  area: string
  duration: string
  description: string
  images: string[]
  beforeAfter?: {
    before: string
    after: string
  }
  active: boolean
  featured: boolean
  order: number
}

interface WorksData {
  works: WorkProject[]
}

export default function WorksSection() {
  const [works, setWorks] = useState<WorkProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("Все")
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({})

  useEffect(() => {
    const loadWorks = async () => {
      try {
        const response = await fetch('/api/data/works')
        if (response.ok) {
          const data: WorksData = await response.json()
          // Фильтруем только активные проекты и сортируем по порядку
          const activeWorks = data.works?.filter(work => work.active) || []
          activeWorks.sort((a, b) => (a.order || 0) - (b.order || 0))
          setWorks(activeWorks)
          
          // Инициализируем индексы изображений
          const initialIndexes: {[key: string]: number} = {}
          activeWorks.forEach(work => {
            initialIndexes[work.id] = 0
          })
          setCurrentImageIndex(initialIndexes)
        } else {
          console.error('Failed to load works')
        }
      } catch (error) {
        console.error('Error loading works:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWorks()
  }, [])

  // Получаем уникальные категории
  const categories = ["Все", ...Array.from(new Set(works.map(work => work.category)))]
  
  // Фильтруем работы по категории
  const filteredWorks = activeCategory === "Все" 
    ? works 
    : works.filter(work => work.category === activeCategory)

  const nextImage = (workId: string, maxIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [workId]: (prev[workId] + 1) % maxIndex
    }))
  }

  const prevImage = (workId: string, maxIndex: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [workId]: prev[workId] === 0 ? maxIndex - 1 : prev[workId] - 1
    }))
  }

  if (isLoading) {
  return (
      <section id="works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-100 rounded-lg"></div>
                ))}
              </div>
      </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="works" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Наши работы
          </h2>
          <p className="text-xl text-gray-600">
            Примеры выполненных проектов механизированной штукатурки
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={
                  activeCategory === category
                    ? "bg-coffee-600 hover:bg-coffee-700 text-white"
                    : "border-coffee-300 text-coffee-600 hover:bg-coffee-50"
                }
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {/* Works Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredWorks.map((work) => (
            <Card key={work.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              {/* Image Carousel */}
              <div className="relative h-64 overflow-hidden">
                {work.featured && (
                  <Badge className="absolute top-3 right-3 z-10 bg-coffee-600 text-white border-0">
                    <Star className="w-3 h-3 mr-1" />
                    Рекомендуем
                  </Badge>
                )}
                
                {work.images && work.images.length > 0 && (
                  <>
                    <img
                      src={work.images[currentImageIndex[work.id] || 0]}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* Image Navigation */}
                    {work.images.length > 1 && (
                      <>
                        <button
                          onClick={() => prevImage(work.id, work.images.length)}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => nextImage(work.id, work.images.length)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-opacity opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                          {work.images.map((_, index) => (
                            <div
                              key={index}
                              className={`w-2 h-2 rounded-full ${
                                index === (currentImageIndex[work.id] || 0)
                                  ? 'bg-white'
                                  : 'bg-white/50'
                              }`}
                            />
                          ))}
                      </div>
                      </>
                    )}
                  </>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                <div>
                    <CardTitle className="text-lg mb-2">{work.title}</CardTitle>
                    <Badge variant="outline" className="text-xs text-coffee-600 border-coffee-300">
                      {work.category}
                      </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {work.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Ruler className="w-4 h-4 mr-2 text-coffee-500" />
                    <span>{work.area}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-coffee-500" />
                    <span>{work.duration}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-coffee-600 hover:bg-coffee-700 text-white">
                  <Eye className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </CardContent>
          </Card>
            ))}
          </div>

        {filteredWorks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Проекты в выбранной категории не найдены</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600 text-white px-8 py-3"
          >
            ЗАКАЗАТЬ ШТУКАТУРКУ
          </Button>
        </div>
      </div>
    </section>
  )
}