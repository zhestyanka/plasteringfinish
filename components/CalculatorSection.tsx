"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Target } from "lucide-react"

export default function CalculatorSection() {
  // Калькулятор состояние
  const [clientPrice, setClientPrice] = useState(450) // Цена для клиента за м²
  const [areaToPlaster, setAreaToPlaster] = useState(150) // м² для штукатурки
  const [layerThickness, setLayerThickness] = useState(1.5) // толщина слоя в см
  const [areaPerShift, setAreaPerShift] = useState(50) // м² за смену
  const [mixType, setMixType] = useState("knauf") // тип смеси
  const [bagWeight, setBagWeight] = useState(30) // кг в мешке
  const [bagPrice, setBagPrice] = useState(350) // цена за мешок

  const mixTypes = [
    { id: "knauf", name: "Knauf MP 75", consumption: 8.5 }, // кг/м² при толщине 1см
    { id: "volma", name: "Волма Гипс-Актив Экстра", consumption: 9.0 },
    { id: "kreisel", name: "Kreisel 501", consumption: 8.8 }
  ]

  // Расчеты калькулятора
  const selectedMixData = mixTypes.find(mix => mix.id === mixType)
  const totalWorkCost = areaToPlaster * clientPrice // Общая стоимость работ
  const totalMixConsumption = areaToPlaster * (selectedMixData?.consumption || 8.5) * layerThickness // кг смеси
  const bagsNeeded = Math.ceil(totalMixConsumption / bagWeight) // количество мешков
  const mixCost = bagsNeeded * bagPrice // стоимость смеси
  const shiftsNeeded = Math.ceil(areaToPlaster / areaPerShift) // количество смен
  const profit = totalWorkCost - mixCost // доход с объекта (без учета работы бригады)

  return (
    <section id="calculator" className="py-12 md:py-20 bg-gradient-to-br from-coffee-50/30 via-white to-gray-50 relative overflow-hidden">
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
            Калькулятор расхода смеси и дохода с объектов
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            по механизированной штукатурке стен
          </p>
        </div>

        {/* Калькулятор расхода смеси и дохода */}
        <Card className="bg-white border-0 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">
          <CardContent className="p-6 md:p-12">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center space-x-2 bg-coffee-100 text-coffee-800 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
                <Calculator className="w-3 h-3 md:w-4 md:h-4" />
                <span>Калькулятор расхода смеси и дохода</span>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                Рассчитайте прибыль с объекта
              </h3>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              {/* Левая колонка - Ввод данных */}
              <div className="space-y-6 md:space-y-8">
                {/* Цены работы */}
                <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Укажите цены, по которым работаете:</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Сколько ₽ Вам заплатил клиент: за м²
                      </label>
                      <Input
                        type="number"
                        value={clientPrice}
                        onChange={(e) => setClientPrice(Number(e.target.value))}
                        className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                        placeholder="450"
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
                        onChange={(e) => setAreaToPlaster(Number(e.target.value))}
                        className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                        placeholder="150"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Толщина слоя штукатурки (см):
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={layerThickness}
                        onChange={(e) => setLayerThickness(Number(e.target.value))}
                        className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                        placeholder="1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Сколько м² делаете за смену:
                      </label>
                      <Input
                        type="number"
                        value={areaPerShift}
                        onChange={(e) => setAreaPerShift(Number(e.target.value))}
                        className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                        placeholder="50"
                      />
                    </div>
                  </div>
                </div>

                {/* Выбор смеси */}
                <div className="bg-coffee-50 rounded-xl p-4 md:p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Выберите смесь и укажите цены:</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-800 font-semibold mb-2 text-sm">
                        Тип смеси:
                      </label>
                      <Select value={mixType} onValueChange={setMixType}>
                        <SelectTrigger className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {mixTypes.map((mix) => (
                            <SelectItem key={mix.id} value={mix.id}>
                              {mix.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Вес мешка (кг):
                        </label>
                        <Input
                          type="number"
                          value={bagWeight}
                          onChange={(e) => setBagWeight(Number(e.target.value))}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-800 font-semibold mb-2 text-sm">
                          Цена за мешок (₽):
                        </label>
                        <Input
                          type="number"
                          value={bagPrice}
                          onChange={(e) => setBagPrice(Number(e.target.value))}
                          className="border-2 border-gray-200 focus:border-coffee-400 rounded-xl"
                          placeholder="350"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая колонка - Результаты */}
              <div className="space-y-6 md:space-y-8">
                <div className="bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-xl p-6 md:p-8 text-white">
                  <h4 className="text-xl font-bold mb-6">Результаты расчета:</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-coffee-100">Стоимость работ:</span>
                      <span className="font-bold text-lg">{totalWorkCost.toLocaleString()} ₽</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-coffee-100">Стоимость смеси:</span>
                      <span className="font-bold text-lg">{mixCost.toLocaleString()} ₽</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-coffee-100">Количество мешков:</span>
                      <span className="font-bold text-lg">{bagsNeeded} шт</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-white/20">
                      <span className="text-coffee-100">Количество смен:</span>
                      <span className="font-bold text-lg">{shiftsNeeded} смен</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-3 mt-4 bg-white/10 rounded-lg px-4">
                      <span className="text-white font-semibold">Прибыль с объекта:</span>
                      <span className="font-bold text-xl text-green-200">{profit.toLocaleString()} ₽</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-white/10 rounded-lg">
                    <p className="text-coffee-100 text-sm">
                      <strong>Расход смеси:</strong> {selectedMixData?.consumption} кг/м² при толщине слоя 1 см<br/>
                      <strong>Общий расход:</strong> {totalMixConsumption.toFixed(1)} кг
                    </p>
                  </div>
                </div>

                {/* Дополнительная информация */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6">
                  <h5 className="font-bold text-amber-800 mb-3">💡 Полезная информация:</h5>
                  <ul className="text-sm text-amber-700 space-y-2">
                    <li>• Расход указан с учетом потерь (5-10%)</li>
                    <li>• Рекомендуется заказывать смесь с запасом 10%</li>
                    <li>• Толщина слоя может варьироваться в зависимости от кривизны стен</li>
                    <li>• Время работы зависит от опыта бригады и сложности объекта</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
} 