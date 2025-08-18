import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'pricing-content.json')

// Функция для чтения данных из файла
function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Ошибка чтения файла pricing-content.json:', error)
  }
  
  // Возвращаем данные по умолчанию, если файл не существует
  return {
    content: {
      header: {
        badge: "Прозрачные цены",
        title: "Тарифы на механизированную штукатурку",
        subtitle: "Выберите подходящий тариф для вашего проекта"
      },
      paymentMethods: {
        cash: {
          title: "Наличные",
          description: "Оплата наличными при завершении работ"
        },
        card: {
          title: "Банковская карта",
          description: "Безналичная оплата картой, возможна рассрочка"
        },
        bank: {
          title: "Банковский перевод",
          description: "Оплата по счету для юридических лиц",
          discount: "Скидка 5%"
        }
      },
      benefits: {
        warranty: {
          title: "Гарантия качества",
          description: "До 5 лет гарантии на все виды работ"
        },
        team: {
          title: "Оптимная команда",
          description: "Более 8 лет на рынке строительных услуг"
        },
        rating: {
          title: "Высокий рейтинг",
          description: "4.9/5 звоезд по отзывам клиентов"
        }
      },
      calculator: {
        title: "Получите точную смету",
        description: "Наш инженер предложит бесплатно, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего объекта",
        features: {
          warranty: {
            title: "Гарантия",
            value: "до 7 лет"
          },
          visit: {
            title: "Выезд",
            value: "в день обращения"
          },
          quality: {
            title: "Качество",
            value: "по ГОСТ"
          }
        },
        rating: {
          stars: "4.9 из 5",
          reviews: "157 отзывов на Яндекс.Карты"
        }
      },
      form: {
        title: "Заказать расчет",
        subtitle: "Бесплатно и без обязательств",
        contact: {
          phone: "+7 (812) 123-45-67",
          email: "info@shtukaturka-spb.ru",
          address: "Санкт-Петербург",
          hours: "Ежедневно 9:00-21:00"
        }
      }
    }
  }
}

// Функция для записи данных в файл
function writeData(data: any) {
  try {
    // Создаем директорию, если она не существует
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8')
    return true
  } catch (error) {
    console.error('Ошибка записи файла pricing-content.json:', error)
    return false
  }
}

export async function GET() {
  try {
    const data = readData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ошибка GET /api/data/pricing-content:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки данных' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.content) {
      return NextResponse.json(
        { error: 'Отсутствует content в теле запроса' },
        { status: 400 }
      )
    }
    
    const success = writeData(body)
    
    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Данные успешно сохранены' 
      })
    } else {
      return NextResponse.json(
        { error: 'Ошибка сохранения данных' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Ошибка POST /api/data/pricing-content:', error)
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}
