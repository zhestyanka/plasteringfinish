import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const teamFilePath = path.join(process.cwd(), 'data', 'team.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(teamFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Ошибка чтения команды:', error)
    return NextResponse.json({ team: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(teamFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Команда сохранена' })
  } catch (error) {
    console.error('Ошибка сохранения команды:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
} 