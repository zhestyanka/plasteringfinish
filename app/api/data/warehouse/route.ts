import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const warehouseFilePath = path.join(process.cwd(), 'data', 'warehouse.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(warehouseFilePath, 'utf8')
    const warehouse = JSON.parse(fileContents)
    return NextResponse.json(warehouse)
  } catch (error) {
    console.error('Ошибка чтения складов:', error)
    return NextResponse.json({ warehouse: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    await fs.writeFile(warehouseFilePath, JSON.stringify(data, null, 2), 'utf8')
    return NextResponse.json({ success: true, message: 'Склады сохранены' })
  } catch (error) {
    console.error('Ошибка сохранения складов:', error)
    return NextResponse.json({ error: 'Ошибка сохранения' }, { status: 500 })
  }
}
