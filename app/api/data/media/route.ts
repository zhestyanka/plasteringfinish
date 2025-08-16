import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const mediaFilePath = path.join(process.cwd(), 'data', 'media.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(mediaFilePath, 'utf8')
    const media = JSON.parse(fileContents)
    return NextResponse.json(media)
  } catch (error) {
    console.error('Ошибка чтения медиа:', error)
    return NextResponse.json({ media: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(mediaFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Медиа сохранено' })
  } catch (error) {
    console.error('Ошибка сохранения медиа:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}

