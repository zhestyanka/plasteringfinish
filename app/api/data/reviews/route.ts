import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(reviewsFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading reviews:', error)
    return NextResponse.json({ error: 'Failed to load reviews' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(reviewsFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Reviews saved successfully' })
  } catch (error) {
    console.error('Error saving reviews:', error)
    return NextResponse.json({ error: 'Failed to save reviews' }, { status: 500 })
  }
} 