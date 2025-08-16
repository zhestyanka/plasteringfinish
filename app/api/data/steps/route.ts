import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const stepsFilePath = path.join(process.cwd(), 'data', 'steps.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(stepsFilePath, 'utf8')
    const steps = JSON.parse(fileContents)
    return NextResponse.json(steps)
  } catch (error) {
    console.error('Ошибка чтения этапов работы:', error)
    return NextResponse.json({ steps: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(stepsFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Этапы работы сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения этапов работы:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}

