import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const videoFilePath = path.join(process.cwd(), 'data', 'video.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(videoFilePath, 'utf8')
    const video = JSON.parse(fileContents)
    return NextResponse.json(video)
  } catch (error) {
    console.error('Ошибка чтения видео:', error)
    return NextResponse.json({ video: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(videoFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Видео сохранено' })
  } catch (error) {
    console.error('Ошибка сохранения видео:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}
