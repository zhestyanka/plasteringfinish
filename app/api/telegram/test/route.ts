import { NextRequest, NextResponse } from 'next/server'
import { sendTestTelegramMessage, checkTelegramConfig } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    // Проверяем настройки
    if (!checkTelegramConfig()) {
      return NextResponse.json({ 
        error: 'Telegram не настроен. Проверьте TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID',
        configured: false
      }, { status: 400 })
    }

    // Отправляем тестовое сообщение
    const success = await sendTestTelegramMessage()

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Тестовое сообщение отправлено в Telegram',
        configured: true
      })
    } else {
      return NextResponse.json({ 
        error: 'Ошибка отправки тестового сообщения',
        configured: true
      }, { status: 500 })
    }
    
  } catch (error) {
    console.error('Ошибка тестирования Telegram:', error)
    return NextResponse.json({ 
      error: 'Ошибка тестирования Telegram',
      configured: checkTelegramConfig()
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const configured = checkTelegramConfig()
    
    return NextResponse.json({ 
      configured,
      message: configured 
        ? 'Telegram настроен корректно' 
        : 'Telegram не настроен. Установите TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID'
    })
    
  } catch (error) {
    console.error('Ошибка проверки настроек Telegram:', error)
    return NextResponse.json({ 
      error: 'Ошибка проверки настроек',
      configured: false
    }, { status: 500 })
  }
}
