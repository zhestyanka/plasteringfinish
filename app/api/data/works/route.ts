import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const worksFilePath = path.join(process.cwd(), 'data', 'works.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(worksFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    // Возвращаем данные в формате, который ожидает компонент
    return NextResponse.json({ works: data })
  } catch (error) {
    console.error('Ошибка чтения портфолио:', error)
    return NextResponse.json({ works: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Сохраняем только массив works, а не весь объект
    await fs.writeFile(worksFilePath, JSON.stringify(data.works || data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Портфолио сохранено' })
  } catch (error) {
    console.error('Ошибка сохранения портфолио:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
} 