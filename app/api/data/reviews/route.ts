import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(reviewsFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Возвращаем данные в формате, который ожидает компонент
    return NextResponse.json({
      textReviews: data.textReviews || [],
      videoReviews: data.videoReviews || [],
      reviews: data.reviews || []
    })
  } catch (error) {
    console.error('Ошибка чтения отзывов:', error)
    return NextResponse.json({ 
      textReviews: [], 
      videoReviews: [], 
      reviews: [] 
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(reviewsFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Отзывы сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения отзывов:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
} 