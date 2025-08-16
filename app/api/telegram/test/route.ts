import { NextRequest, NextResponse } from 'next/server'
import { testTelegramConnection, sendTestMessage } from '@/lib/telegram'

export async function GET(request: NextRequest) {
  try {
    // Проверяем подключение к Telegram
    const connectionSuccess = await testTelegramConnection()
    
    if (!connectionSuccess) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ошибка подключения к Telegram',
        error: 'Проверьте токен бота и настройки'
      }, { status: 500 })
    }

    // Отправляем тестовое сообщение
    const messageSuccess = await sendTestMessage()
    
    if (!messageSuccess) {
      return NextResponse.json({ 
        success: false, 
        message: 'Ошибка отправки тестового сообщения',
        error: 'Проверьте Chat ID'
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Telegram подключен и тестовое сообщение отправлено'
    })
    
  } catch (error) {
    console.error('Ошибка тестирования Telegram:', error)
    return NextResponse.json({ 
      success: false, 
      message: 'Ошибка тестирования Telegram',
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }, { status: 500 })
  }
}
