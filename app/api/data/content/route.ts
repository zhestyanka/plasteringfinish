import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const contentFilePath = path.join(process.cwd(), 'data', 'content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(contentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading content:', error)
    return NextResponse.json({ error: 'Failed to load content' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(contentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Content saved successfully' })
  } catch (error) {
    console.error('Error saving content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json()
    
    // Читаем существующие данные
    const fileContents = await fs.readFile(contentFilePath, 'utf8')
    const existingData = JSON.parse(fileContents)
    
    // Обновляем только переданные поля
    const updatedData = { ...existingData, ...updateData }
    
    // Сохраняем обновленные данные
    await fs.writeFile(contentFilePath, JSON.stringify(updatedData, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Content updated successfully' })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 })
  }
} 