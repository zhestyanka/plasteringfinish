import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const pricingFilePath = path.join(process.cwd(), 'data', 'pricing.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(pricingFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading pricing:', error)
    return NextResponse.json({ error: 'Failed to load pricing' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(pricingFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Pricing saved successfully' })
  } catch (error) {
    console.error('Error saving pricing:', error)
    return NextResponse.json({ error: 'Failed to save pricing' }, { status: 500 })
  }
} 