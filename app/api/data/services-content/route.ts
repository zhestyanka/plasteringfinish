import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const dataFilePath = path.join(process.cwd(), 'data', 'services-content.json')

export async function GET() {
  try {
    const data = await fs.readFile(dataFilePath, 'utf8')
    return NextResponse.json(JSON.parse(data))
  } catch (error) {
    // Если файл не существует, возвращаем данные по умолчанию
    const defaultData = {
      content: {
        header: {
          badge: "Наши услуги",
          title: "Механизированная штукатурка стен",
          subtitle: "Профессиональная отделка помещений любой сложности"
        },
        consultation: {
          badge: "Бесплатная консультация",
          title: "Получите бесплатную консультацию",
          description: "Наши специалисты помогут подобрать оптимальное решение для вашего проекта",
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
    console.error('Ошибка сохранения контента услуг:', error)
    return NextResponse.json(
      { error: 'Ошибка сохранения данных' },
      { status: 500 }
    )
  }
}
