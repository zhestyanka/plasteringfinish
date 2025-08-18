import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'services-content.json')

// Функция для чтения данных из файла
function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Ошибка чтения файла services-content.json:', error)
  }
  
  // Возвращаем данные по умолчанию, если файл не существует
  return {
    content: {
      header: {
        badge: "Наши услуги",
        title: "Полный комплекс строительных работ",
        subtitle: "От демонтажа до финишной отделки — выполняем все виды работ качественно и в срок"
      },
      consultation: {
        badge: "Бесплатная консультация",
        title: "Не знаете с чего начать?",
        description: "Наш инженер бесплатно приедет на объект, оценит объем работ и составит подробную смету. Это ни к чему не обязывает.",
        features: {
          fast: {
            title: "Быстро",
            description: "Выезд в день обращения"
          },
          free: {
            title: "Бесплатно",
            description: "Оценка и консультация"
          },
          convenient: {
            title: "Удобно",
            description: "В любое время"
          },
          professional: {
            title: "Профессионально",
            description: "Опытный инженер"
          }
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
    console.error('Ошибка записи файла services-content.json:', error)
    return false
  }
}

export async function GET() {
  try {
    const data = readData()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ошибка GET /api/data/services-content:', error)
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
    console.error('Ошибка POST /api/data/services-content:', error)
    return NextResponse.json(
      { error: 'Ошибка обработки запроса' },
      { status: 500 }
    )
  }
}
