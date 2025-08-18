import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const pricingContentFilePath = path.join(process.cwd(), 'data', 'pricing-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(pricingContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading pricing content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
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
          transfer: {
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
          form: {
            name: "Ваше имя",
            phone: "Номер телефона",
            area: "Площадь помещения (м²)",
            message: "Дополнительная информация о проекте",
            button: "ПОЛУЧИТЬ РАСЧЕТ",
            consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
          },
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
            value: "4.9 из 5",
            reviews: "157 отзывов на Яндекс.Карты"
          }
        }
      }
    }
    return NextResponse.json(defaultData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(pricingContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Pricing content saved successfully' })
  } catch (error) {
    console.error('Error saving pricing content:', error)
    return NextResponse.json({ error: 'Failed to save pricing content' }, { status: 500 })
  }
}
