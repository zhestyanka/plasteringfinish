"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Save, 
  Calculator,
  DollarSign,
  Ruler,
  Package,
  Settings
} from "lucide-react"
import { toast } from "sonner"

interface CalculatorContent {
  header: {
    badge: string
    title: string
  }
  priceSection: {
    title: string
    priceLabel: string
    pricePlaceholder: string
  }
  objectSection: {
    title: string
    areaLabel: string
    areaPlaceholder: string
    thicknessLabel: string
    thicknessPlaceholder: string
    shiftLabel: string
    shiftPlaceholder: string
  }
  mixtureSection: {
    title: string
    mixtureLabel: string
    bagWeightLabel: string
    bagWeightPlaceholder: string
    bagPriceLabel: string
    bagPricePlaceholder: string
    mixtures: Array<{
      value: string
      label: string
    }>
  }
  resultsSection: {
    title: string
    workCostLabel: string
    mixtureCostLabel: string
    bagsNeededLabel: string
    shiftsNeededLabel: string
    incomeLabel: string
    footer: string
  }
}

export default function CalculatorPage() {
  const [content, setContent] = useState<CalculatorContent>({
    header: {
      badge: "Калькулятор стоимости работ",
      title: "Стоимость работ"
    },
    priceSection: {
      title: "Укажите цены:",
      priceLabel: "Сколько ₽ за м²",
      pricePlaceholder: "450"
    },
    objectSection: {
      title: "Укажите данные объекта:",
      areaLabel: "Сколько м² нужно отштукатурить:",
      areaPlaceholder: "100",
      thicknessLabel: "Укажите толщину наносимого слоя: см",
      thicknessPlaceholder: "2.0",
      shiftLabel: "Сколько м² отштукатуриваете в смену:",
      shiftPlaceholder: "40"
    },
    mixtureSection: {
      title: "Укажите данные по смеси:",
      mixtureLabel: "Выберите, какой смесью работать:",
      bagWeightLabel: "Укажите сколько кг в 1 мешке:",
      bagWeightPlaceholder: "30",
      bagPriceLabel: "Сколько стоит 1 мешок смеси: ₽ / мешок",
      bagPricePlaceholder: "350",
      mixtures: [
        { value: "knauf", label: "Knauf MP 75" },
        { value: "volma", label: "Волма Гипс-Актив Экстра" },
        { value: "kreisel", label: "Kreisel 501" }
      ]
    },
    resultsSection: {
      title: "Результаты",
      workCostLabel: "Общая стоимость работ на объекте:",
      mixtureCostLabel: "Стоимость смеси составит:",
      bagsNeededLabel: "Вам понадобится ориентировочно:",
      shiftsNeededLabel: "Объект будет выполнен за:",
      incomeLabel: "Доход с объекта составит:",
      footer: "Надёжные штукатурные станции от производителя"
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  const loadContent = async () => {
    try {
      const response = await fetch('/api/data/calculator-content')
      if (response.ok) {
        const data = await response.json()
        if (data.content) {
          // Безопасная инициализация с дефолтными значениями
          const safeContent = {
            header: {
              badge: data.content.header?.badge || "Калькулятор стоимости работ",
              title: data.content.header?.title || "Стоимость работ"
            },
            priceSection: {
              title: data.content.priceSection?.title || "Укажите цены:",
              priceLabel: data.content.priceSection?.priceLabel || "Сколько ₽ за м²",
              pricePlaceholder: data.content.priceSection?.pricePlaceholder || "450"
            },
            objectSection: {
              title: data.content.objectSection?.title || "Укажите данные объекта:",
              areaLabel: data.content.objectSection?.areaLabel || "Сколько м² нужно отштукатурить:",
              areaPlaceholder: data.content.objectSection?.areaPlaceholder || "100",
              thicknessLabel: data.content.objectSection?.thicknessLabel || "Укажите толщину наносимого слоя: см",
              thicknessPlaceholder: data.content.objectSection?.thicknessPlaceholder || "2.0",
              shiftLabel: data.content.objectSection?.shiftLabel || "Сколько м² отштукатуриваете в смену:",
              shiftPlaceholder: data.content.objectSection?.shiftPlaceholder || "40"
            },
            mixtureSection: {
              title: data.content.mixtureSection?.title || "Укажите данные по смеси:",
              mixtureLabel: data.content.mixtureSection?.mixtureLabel || "Выберите, какой смесью работать:",
              bagWeightLabel: data.content.mixtureSection?.bagWeightLabel || "Укажите сколько кг в 1 мешке:",
              bagWeightPlaceholder: data.content.mixtureSection?.bagWeightPlaceholder || "30",
              bagPriceLabel: data.content.mixtureSection?.bagPriceLabel || "Сколько стоит 1 мешок смеси: ₽ / мешок",
              bagPricePlaceholder: data.content.mixtureSection?.bagPricePlaceholder || "350",
              mixtures: data.content.mixtureSection?.mixtures || [
                { value: "knauf", label: "Knauf MP 75" },
                { value: "volma", label: "Волма Гипс-Актив Экстра" },
                { value: "kreisel", label: "Kreisel 501" }
              ]
            },
            resultsSection: {
              title: data.content.resultsSection?.title || "Результаты",
              workCostLabel: data.content.resultsSection?.workCostLabel || "Общая стоимость работ на объекте:",
              mixtureCostLabel: data.content.resultsSection?.mixtureCostLabel || "Стоимость смеси составит:",
              bagsNeededLabel: data.content.resultsSection?.bagsNeededLabel || "Вам понадобится ориентировочно:",
              shiftsNeededLabel: data.content.resultsSection?.shiftsNeededLabel || "Объект будет выполнен за:",
              incomeLabel: data.content.resultsSection?.incomeLabel || "Доход с объекта составит:",
              footer: data.content.resultsSection?.footer || "Надёжные штукатурные станции от производителя"
            }
          }
          setContent(safeContent)
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки контента:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContent = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/data/calculator-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })

      if (response.ok) {
        toast.success('Контент успешно сохранен')
      } else {
        throw new Error('Failed to save content')
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Редактирование калькулятора</h1>
          <p className="text-gray-600 mt-2">Настройка калькулятора стоимости работ</p>
        </div>
        <Button 
          onClick={saveContent} 
          disabled={isSaving}
          className="bg-gradient-to-r from-coffee-600 to-coffee-500 hover:from-coffee-700 hover:to-coffee-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Заголовок калькулятора
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="header-badge">Бейдж</Label>
            <Input
              id="header-badge"
              value={content.header.badge}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, badge: e.target.value }
              })}
              placeholder="Калькулятор стоимости работ"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-title">Заголовок</Label>
            <Input
              id="header-title"
              value={content.header.title}
              onChange={(e) => setContent({
                ...content,
                header: { ...content.header, title: e.target.value }
              })}
              placeholder="Стоимость работ"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Секция цен
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price-title">Заголовок секции</Label>
            <Input
              id="price-title"
              value={content.priceSection.title}
              onChange={(e) => setContent({
                ...content,
                priceSection: { ...content.priceSection, title: e.target.value }
              })}
              placeholder="Укажите цены:"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-label">Подпись поля цены</Label>
            <Input
              id="price-label"
              value={content.priceSection.priceLabel}
              onChange={(e) => setContent({
                ...content,
                priceSection: { ...content.priceSection, priceLabel: e.target.value }
              })}
              placeholder="Сколько ₽ за м²"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price-placeholder">Placeholder поля цены</Label>
            <Input
              id="price-placeholder"
              value={content.priceSection.pricePlaceholder}
              onChange={(e) => setContent({
                ...content,
                priceSection: { ...content.priceSection, pricePlaceholder: e.target.value }
              })}
              placeholder="450"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5" />
            Секция данных объекта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="object-title">Заголовок секции</Label>
            <Input
              id="object-title"
              value={content.objectSection.title}
              onChange={(e) => setContent({
                ...content,
                objectSection: { ...content.objectSection, title: e.target.value }
              })}
              placeholder="Укажите данные объекта:"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area-label">Подпись поля площади</Label>
              <Input
                id="area-label"
                value={content.objectSection.areaLabel}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, areaLabel: e.target.value }
                })}
                placeholder="Сколько м² нужно отштукатурить:"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area-placeholder">Placeholder площади</Label>
              <Input
                id="area-placeholder"
                value={content.objectSection.areaPlaceholder}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, areaPlaceholder: e.target.value }
                })}
                placeholder="100"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thickness-label">Подпись поля толщины</Label>
              <Input
                id="thickness-label"
                value={content.objectSection.thicknessLabel}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, thicknessLabel: e.target.value }
                })}
                placeholder="Укажите толщину наносимого слоя: см"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness-placeholder">Placeholder толщины</Label>
              <Input
                id="thickness-placeholder"
                value={content.objectSection.thicknessPlaceholder}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, thicknessPlaceholder: e.target.value }
                })}
                placeholder="2.0"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="shift-label">Подпись поля смены</Label>
              <Input
                id="shift-label"
                value={content.objectSection.shiftLabel}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, shiftLabel: e.target.value }
                })}
                placeholder="Сколько м² отштукатуриваете в смену:"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shift-placeholder">Placeholder смены</Label>
              <Input
                id="shift-placeholder"
                value={content.objectSection.shiftPlaceholder}
                onChange={(e) => setContent({
                  ...content,
                  objectSection: { ...content.objectSection, shiftPlaceholder: e.target.value }
                })}
                placeholder="40"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Секция смеси
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mixture-title">Заголовок секции</Label>
            <Input
              id="mixture-title"
              value={content.mixtureSection.title}
              onChange={(e) => setContent({
                ...content,
                mixtureSection: { ...content.mixtureSection, title: e.target.value }
              })}
              placeholder="Укажите данные по смеси:"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mixture-label">Подпись выбора смеси</Label>
            <Input
              id="mixture-label"
              value={content.mixtureSection.mixtureLabel}
              onChange={(e) => setContent({
                ...content,
                mixtureSection: { ...content.mixtureSection, mixtureLabel: e.target.value }
              })}
              placeholder="Выберите, какой смесью работать:"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bag-weight-label">Подпись веса мешка</Label>
              <Input
                id="bag-weight-label"
                value={content.mixtureSection.bagWeightLabel}
                onChange={(e) => setContent({
                  ...content,
                  mixtureSection: { ...content.mixtureSection, bagWeightLabel: e.target.value }
                })}
                placeholder="Укажите сколько кг в 1 мешке:"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bag-weight-placeholder">Placeholder веса мешка</Label>
              <Input
                id="bag-weight-placeholder"
                value={content.mixtureSection.bagWeightPlaceholder}
                onChange={(e) => setContent({
                  ...content,
                  mixtureSection: { ...content.mixtureSection, bagWeightPlaceholder: e.target.value }
                })}
                placeholder="30"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bag-price-label">Подпись цены мешка</Label>
              <Input
                id="bag-price-label"
                value={content.mixtureSection.bagPriceLabel}
                onChange={(e) => setContent({
                  ...content,
                  mixtureSection: { ...content.mixtureSection, bagPriceLabel: e.target.value }
                })}
                placeholder="Сколько стоит 1 мешок смеси: ₽ / мешок"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bag-price-placeholder">Placeholder цены мешка</Label>
              <Input
                id="bag-price-placeholder"
                value={content.mixtureSection.bagPricePlaceholder}
                onChange={(e) => setContent({
                  ...content,
                  mixtureSection: { ...content.mixtureSection, bagPricePlaceholder: e.target.value }
                })}
                placeholder="350"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Секция результатов
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="results-title">Заголовок результатов</Label>
            <Input
              id="results-title"
              value={content.resultsSection.title}
              onChange={(e) => setContent({
                ...content,
                resultsSection: { ...content.resultsSection, title: e.target.value }
              })}
              placeholder="Результаты"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="work-cost-label">Подпись стоимости работ</Label>
              <Input
                id="work-cost-label"
                value={content.resultsSection.workCostLabel}
                onChange={(e) => setContent({
                  ...content,
                  resultsSection: { ...content.resultsSection, workCostLabel: e.target.value }
                })}
                placeholder="Общая стоимость работ на объекте:"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mixture-cost-label">Подпись стоимости смеси</Label>
              <Input
                id="mixture-cost-label"
                value={content.resultsSection.mixtureCostLabel}
                onChange={(e) => setContent({
                  ...content,
                  resultsSection: { ...content.resultsSection, mixtureCostLabel: e.target.value }
                })}
                placeholder="Стоимость смеси составит:"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bags-needed-label">Подпись количества мешков</Label>
              <Input
                id="bags-needed-label"
                value={content.resultsSection.bagsNeededLabel}
                onChange={(e) => setContent({
                  ...content,
                  resultsSection: { ...content.resultsSection, bagsNeededLabel: e.target.value }
                })}
                placeholder="Вам понадобится ориентировочно:"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shifts-needed-label">Подпись количества смен</Label>
              <Input
                id="shifts-needed-label"
                value={content.resultsSection.shiftsNeededLabel}
                onChange={(e) => setContent({
                  ...content,
                  resultsSection: { ...content.resultsSection, shiftsNeededLabel: e.target.value }
                })}
                placeholder="Объект будет выполнен за:"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income-label">Подпись дохода</Label>
            <Input
              id="income-label"
              value={content.resultsSection.incomeLabel}
              onChange={(e) => setContent({
                ...content,
                resultsSection: { ...content.resultsSection, incomeLabel: e.target.value }
              })}
              placeholder="Доход с объекта составит:"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="results-footer">Подпись внизу</Label>
            <Input
              id="results-footer"
              value={content.resultsSection.footer}
              onChange={(e) => setContent({
                ...content,
                resultsSection: { ...content.resultsSection, footer: e.target.value }
              })}
              placeholder="Надёжные штукатурные станции от производителя"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
