import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const promotionsFilePath = path.join(process.cwd(), 'data', 'promotions.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(promotionsFilePath, 'utf8')
    const promotions = JSON.parse(fileContents)
    return NextResponse.json(promotions)
  } catch (error) {
    console.error('Ошибка чтения акций:', error)
    return NextResponse.json({ promotions: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(promotionsFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Акции сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения акций:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}

