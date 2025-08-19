import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const servicesContentFilePath = path.join(process.cwd(), 'data', 'services-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(servicesContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading services content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
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
    await fs.writeFile(servicesContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Services content saved successfully' })
  } catch (error) {
    console.error('Error saving services content:', error)
    return NextResponse.json({ error: 'Failed to save services content' }, { status: 500 })
  }
}
