import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'pricing-content.json')

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    // Если файл не существует, возвращаем данные по умолчанию
    const defaultData = {
      content: {
        header: {
          badge: "Наши тарифы",
          title: "Прозрачные цены на штукатурку",
          subtitle: "Выберите подходящий тариф для вашего проекта"
        },
        paymentMethods: {
          title: "Способы оплаты",
          description: "Удобные варианты оплаты для наших клиентов",
          methods: ["Наличные", "Банковская карта", "Безналичный расчет"]
        },
        benefits: {
          title: "Преимущества работы с нами",
          items: [
            { "title": "Гарантия качества", "description": "5 лет гарантии на все работы" },
            { "title": "Быстрое выполнение", "description": "Сроки от 1 дня" },
            { "title": "Опытные мастера", "description": "Более 8 лет опыта" }
          ]
        },
        calculator: {
          title: "Калькулятор стоимости",
          subtitle: "Рассчитайте стоимость онлайн",
          description: "Быстрый расчет стоимости штукатурных работ"
        },
        contact: {
          title: "Получить консультацию",
          subtitle: "Бесплатная консультация",
          description: "Наш специалист свяжется с вами в течение 15 минут"
        }
      }
    }
    return NextResponse.json(defaultData)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Создаем директорию, если она не существует
    const dir = path.dirname(dataFilePath)
    await fs.mkdir(dir, { recursive: true })
    
    // Записываем данные в файл
    await fs.writeFile(dataFilePath, JSON.stringify(body, null, 2), 'utf8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка сохранения контента тарифов:', error)
    return NextResponse.json(
      { error: 'Ошибка сохранения данных' },
      { status: 500 }
    )
  }
}
