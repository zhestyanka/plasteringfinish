import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'data', 'telegram-settings.json')

// GET - получение настроек Telegram
export async function GET() {
  try {
    if (!fs.existsSync(settingsPath)) {
      // Создаем файл с дефолтными настройками если он не существует
      const defaultSettings = {
        botToken: "8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY",
        chatId: "123456789",
        botUsername: "plasteringspb_bot"
      }
      fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 2))
      return NextResponse.json({ settings: defaultSettings })
    }

    const settingsData = fs.readFileSync(settingsPath, 'utf8')
    const settings = JSON.parse(settingsData)
    
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Ошибка при загрузке настроек Telegram:', error)
    return NextResponse.json(
      { error: 'Ошибка при загрузке настроек' },
      { status: 500 }
    )
  }
}

// POST - сохранение настроек Telegram
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { botToken, chatId, botUsername } = body

    // Валидация
    if (!botToken || !chatId || !botUsername) {
      return NextResponse.json(
        { error: 'Все поля обязательны для заполнения' },
        { status: 400 }
      )
    }

    // Проверка формата токена
    if (!botToken.match(/^\d+:[A-Za-z0-9_-]+$/)) {
      return NextResponse.json(
        { error: 'Неверный формат токена бота' },
        { status: 400 }
      )
    }

    // Проверка формата chat ID
    if (!chatId.match(/^-?\d+$/)) {
      return NextResponse.json(
        { error: 'Chat ID должен быть числом' },
        { status: 400 }
      )
    }

    // Проверка формата username
    if (!botUsername.match(/^[a-zA-Z0-9_]{5,32}$/)) {
      return NextResponse.json(
        { error: 'Username должен содержать 5-32 символа (буквы, цифры, подчеркивания)' },
        { status: 400 }
      )
    }

    // Сохраняем настройки
    const settings = { botToken, chatId, botUsername }
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2))

    return NextResponse.json({ 
      success: true, 
      message: 'Настройки Telegram успешно сохранены',
      settings 
    })
  } catch (error) {
    console.error('Ошибка при сохранении настроек Telegram:', error)
    return NextResponse.json(
      { error: 'Ошибка при сохранении настроек' },
      { status: 500 }
    )
  }
}
