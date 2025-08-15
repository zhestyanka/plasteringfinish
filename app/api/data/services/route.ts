import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const servicesFilePath = path.join(process.cwd(), 'data', 'services.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(servicesFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ошибка чтения услуг:', error)
    return NextResponse.json({ services: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(servicesFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Услуги сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения услуг:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
} 