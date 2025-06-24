import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const worksFilePath = path.join(process.cwd(), 'data', 'works.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(worksFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading works:', error)
    return NextResponse.json({ error: 'Failed to load works' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(worksFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Works saved successfully' })
  } catch (error) {
    console.error('Error saving works:', error)
    return NextResponse.json({ error: 'Failed to save works' }, { status: 500 })
  }
} 