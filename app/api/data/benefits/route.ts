import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const benefitsFilePath = path.join(process.cwd(), 'data', 'benefits.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(benefitsFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading benefits:', error)
    return NextResponse.json({ error: 'Failed to load benefits' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(benefitsFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Benefits saved successfully' })
  } catch (error) {
    console.error('Error saving benefits:', error)
    return NextResponse.json({ error: 'Failed to save benefits' }, { status: 500 })
  }
} 