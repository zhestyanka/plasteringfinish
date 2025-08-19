import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const settingsPath = path.join(process.cwd(), 'data', 'telegram-settings.json')

// POST - тестирование подключения к боту
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { botToken, chatId } = body

    if (!botToken || !chatId) {
      return NextResponse.json(
        { error: 'Токен бота и Chat ID обязательны' },
        { status: 400 }
      )
    }

    // Тестируем подключение к боту
    const testMessage = `🧪 Тестовое сообщение от сайта штукатурки

✅ Бот успешно подключен!
📅 Дата: ${new Date().toLocaleString('ru-RU')}
🌐 Источник: Веб-сайт`

    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: testMessage,
          parse_mode: 'HTML'
        })
      })

      const result = await response.json()

      if (result.ok) {
        return NextResponse.json({ 
          success: true, 
          message: 'Тестовое сообщение успешно отправлено!',
          result: result.result
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: `Ошибка Telegram API: ${result.description}`,
          code: result.error_code
        })
      }
    } catch (telegramError) {
      return NextResponse.json({ 
        success: false, 
        error: 'Ошибка подключения к Telegram API. Проверьте токен бота и Chat ID.'
      })
    }
  } catch (error) {
    console.error('Ошибка при тестировании Telegram:', error)
    return NextResponse.json(
      { error: 'Ошибка при тестировании подключения' },
      { status: 500 }
    )
  }
}
