import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const equipmentFilePath = path.join(process.cwd(), 'data', 'equipment.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(equipmentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading equipment:', error)
    return NextResponse.json({ error: 'Failed to load equipment' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(equipmentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Equipment saved successfully' })
  } catch (error) {
    console.error('Error saving equipment:', error)
    return NextResponse.json({ error: 'Failed to save equipment' }, { status: 500 })
  }
} 