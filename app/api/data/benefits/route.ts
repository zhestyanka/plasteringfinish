import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const benefitsFilePath = path.join(process.cwd(), 'data', 'benefits.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(benefitsFilePath, 'utf8')
    const benefits = JSON.parse(fileContents)
    return NextResponse.json(benefits)
  } catch (error) {
    console.error('Ошибка чтения преимуществ:', error)
    return NextResponse.json({ benefits: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(benefitsFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Преимущества сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения преимуществ:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}

