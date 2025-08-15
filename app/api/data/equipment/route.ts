import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const equipmentFilePath = path.join(process.cwd(), 'data', 'equipment.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(equipmentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    // Возвращаем данные в формате, который ожидает компонент
    return NextResponse.json({ equipment: data })
  } catch (error) {
    console.error('Ошибка чтения оборудования:', error)
    return NextResponse.json({ equipment: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    // Сохраняем только массив equipment, а не весь объект
    await fs.writeFile(equipmentFilePath, JSON.stringify(data.equipment || data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Оборудование сохранено' })
  } catch (error) {
    console.error('Ошибка сохранения оборудования:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
} 