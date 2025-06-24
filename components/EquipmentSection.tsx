"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Wrench, Package, Truck, Zap, Shield } from "lucide-react"

interface EquipmentItem {
  id: string
  name: string
  type: string
  description: string
  specifications?: {
    power?: string
    productivity?: string
    pressure?: string
    capacity?: string
    mixing_time?: string
  }
  image?: string
  active: boolean
  order: number
}

interface EquipmentData {
  equipment: EquipmentItem[]
}

// Функция для получения иконки по типу оборудования
const getIcon = (type: string) => {
  const icons: { [key: string]: any } = {
    "Штукатурная станция": Settings,
    "Миксер": Wrench,
    "Компрессор": Package,
    "Транспорт": Truck,
    "Электрооборудование": Zap,
    "Безопасность": Shield
  }
  return icons[type] || Settings
}

export default function EquipmentSection() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadEquipment = async () => {
      try {
        const response = await fetch('/api/data/equipment')
        if (response.ok) {
          const data: EquipmentData = await response.json()
          // Фильтруем только активное оборудование и сортируем по порядку
          const activeEquipment = data.equipment?.filter(item => item.active) || []
          activeEquipment.sort((a, b) => (a.order || 0) - (b.order || 0))
          setEquipment(activeEquipment)
        } else {
          console.error('Failed to load equipment')
        }
      } catch (error) {
        console.error('Error loading equipment:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadEquipment()
  }, [])

  if (isLoading) {
    return (
      <section id="equipment" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-amber-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-64 bg-amber-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="equipment" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            <span className="text-orange-700">Наше</span> <span className="text-amber-800">оборудование</span> и
            материалы
          </h2>
          <p className="text-xl text-amber-800">Профессиональное оборудование для качественных работ</p>
        </div>

        <div className={`grid gap-8 mb-8 ${
          equipment.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
          equipment.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto' :
          'grid-cols-1 md:grid-cols-3'
        }`}>
          {equipment.map((item) => {
            const IconComponent = getIcon(item.type)
            return (
              <Card key={item.id} className="bg-white border-2 border-amber-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-gray-100" />
                  </div>

                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    {item.name}
                    {item.type && <span className="block text-orange-700 text-sm font-medium">{item.type}</span>}
                  </h3>

                  <p className="text-amber-800 mb-4">{item.description}</p>

                  {item.specifications && (
                    <div className="text-sm text-amber-700 space-y-1">
                      {item.specifications.power && (
                        <div>Мощность: {item.specifications.power}</div>
                      )}
                      {item.specifications.productivity && (
                        <div>Производительность: {item.specifications.productivity}</div>
                      )}
                      {item.specifications.pressure && (
                        <div>Давление: {item.specifications.pressure}</div>
                      )}
                      {item.specifications.capacity && (
                        <div>Объем: {item.specifications.capacity}</div>
                      )}
                      {item.specifications.mixing_time && (
                        <div>Время смешивания: {item.specifications.mixing_time}</div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100 px-8 py-3 text-lg">
            ПОЛУЧИТЬ СМЕТУ
          </Button>
        </div>
      </div>
    </section>
  )
}
