import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const teamFilePath = path.join(process.cwd(), 'data', 'team.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(teamFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading team:', error)
    return NextResponse.json({ error: 'Failed to load team' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(teamFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Team saved successfully' })
  } catch (error) {
    console.error('Error saving team:', error)
    return NextResponse.json({ error: 'Failed to save team' }, { status: 500 })
  }
} 