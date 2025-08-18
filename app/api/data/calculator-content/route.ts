import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'calculator-content.json')

// Функция для чтения данных из файла
function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Ошибка чтения файла calculator-content.json:', error)
  }
  
  // Возвращаем данные по умолчанию, если файл не существует
  return {
    content: {
      header: {
        title: "Получите точную смету",
        subtitle: "Бесплатный расчет стоимости",
        description: "Наш инженер бесплатно приедет на объект, проведет замеры и рассчитает точную стоимость с учетом всех особенностей вашего проекта"
      },
      form: {
        title: "Заказать расчет",
        subtitle: "Бесплатно и без обязательств",
        fields: {
          name: {
            label: "Ваше имя",
            placeholder: "Введите ваше имя"
          },
          phone: {
            label: "Телефон",
            placeholder: "+7 (999) 123-45-67"
          },
          email: {
            label: "Email",
            placeholder: "example@mail.ru"
          },
          area: {
            label: "Площадь помещения (м²)",
            placeholder: "Введите площадь"
          },
          message: {
            label: "Дополнительная информация",
            placeholder: "Опишите ваш проект..."
          }
        },
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
        stars: "4.9 из 5",
        reviews: "157 отзывов на Яндекс.Карты"
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
    console.error('Ошибка записи файла calculator-content.json:', error)
    return false
  }
}

export async function GET() {
  try {
    const data = readData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ошибка GET /api/data/calculator-content:', error)
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
    console.error('Ошибка POST /api/data/calculator-content:', error)
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}
