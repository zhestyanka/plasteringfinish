import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const servicesFilePath = path.join(process.cwd(), 'data', 'services.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(servicesFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading services:', error)
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(servicesFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Services saved successfully' })
  } catch (error) {
    console.error('Error saving services:', error)
    return NextResponse.json({ error: 'Failed to save services' }, { status: 500 })
  }
} 