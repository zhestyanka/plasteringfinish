import { NextRequest, NextResponse } from 'next/server'
import { telegramConfig } from '../../../config/telegram'

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Telegram API вызван')
    
    // Проверяем наличие переменных окружения
    if (!telegramConfig.botToken || !telegramConfig.chatId) {
      console.log('⚠️ Telegram не настроен: отсутствуют переменные окружения')
      console.log('🔑 TELEGRAM_BOT_TOKEN:', telegramConfig.botToken ? 'Установлен' : 'Отсутствует')
      console.log('💬 TELEGRAM_CHAT_ID:', telegramConfig.chatId ? 'Установлен' : 'Отсутствует')
      return NextResponse.json({ 
        success: true, 
        message: 'Telegram не настроен, но заявка сохранена',
        telegramConfigured: false 
      })
    }

    const body = await request.json()
    console.log('📨 Полученные данные:', body)
    
    const { message, type = 'form' } = body

    if (!message) {
      console.log('❌ Сообщение отсутствует')
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Форматируем сообщение в зависимости от типа
    let formattedMessage = ''
    
    switch (type) {
      case 'contact':
        formattedMessage = formatContactMessage(message)
        break
      case 'calculator':
        formattedMessage = formatCalculatorMessage(message)
        break
      case 'callback':
        formattedMessage = formatCallbackMessage(message)
        break
      default:
        formattedMessage = formatDefaultMessage(message)
    }

    console.log('📝 Отформатированное сообщение:', formattedMessage)

    // Отправляем в Telegram
    const telegramResponse = await sendToTelegram(formattedMessage)
    
    if (telegramResponse.ok) {
      console.log('✅ Сообщение успешно отправлено в Telegram')
      return NextResponse.json({ success: true, message: 'Message sent to Telegram' })
    } else {
      console.log('❌ Ошибка отправки в Telegram, статус:', telegramResponse.status)
      const errorText = await telegramResponse.text()
      console.log('❌ Текст ошибки:', errorText)
      throw new Error('Failed to send to Telegram')
    }

  } catch (error) {
    console.error('❌ Telegram API error:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

async function sendToTelegram(message: string) {
  const url = `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`
  
  console.log('🌐 Отправляем в Telegram URL:', url)
  console.log('💬 Chat ID:', telegramConfig.chatId)
  console.log('📝 Сообщение:', message)
  
  const requestBody = {
    chat_id: telegramConfig.chatId,
    text: message,
    parse_mode: 'HTML'
  }
  
  const postData = JSON.stringify(requestBody)
  
  console.log('📤 Тело запроса:', requestBody)
  console.log('📏 Длина данных:', Buffer.byteLength(postData, 'utf8'))
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData, 'utf8').toString()
    },
    body: postData
  })

  console.log('📡 Ответ от Telegram API, статус:', response.status)
  
  return response
}

function formatContactMessage(data: any) {
  return `
🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

📋 <b>Тип:</b> Контактная форма

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📞 <b>Телефон:</b> ${data.phone || 'Не указано'}
📧 <b>Email:</b> ${data.email || 'Не указано'}
📍 <b>Адрес:</b> ${data.address || 'Не указано'}
💬 <b>Сообщение:</b> ${data.message || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> ${data.source || 'Сайт'}
  `.trim()
}

function formatCalculatorMessage(data: any) {
  const totalCost = data.totalCost || 'Не рассчитано'
  const area = data.area || 'Не указано'
  
  return `
🧮 <b>РАСЧЕТ СТОИМОСТИ</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📞 <b>Телефон:</b> ${data.phone || 'Не указано'}

📐 <b>Параметры:</b>
• Площадь: ${area} м²
• Цена клиента: ${data.clientPrice || 'Не указано'} ₽/м²
• Толщина слоя: ${data.layerThickness || 'Не указано'} мм
• Площадь за смену: ${data.areaPerShift || 'Не указано'} м²
• Вес мешка: ${data.bagWeight || 'Не указано'} кг
• Цена мешка: ${data.bagPrice || 'Не указано'} ₽

💰 <b>Итоговая стоимость:</b> ${totalCost} ₽

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Калькулятор на сайте
  `.trim()
}

function formatCallbackMessage(data: any) {
  return `
📞 <b>ЗАЯВКА НА ОБРАТНЫЙ ЗВОНОК</b>

👤 <b>Имя:</b> ${data.name || 'Не указано'}
📞 <b>Телефон:</b> ${data.phone || 'Не указано'}
💬 <b>Комментарий:</b> ${data.comment || 'Не указано'}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Форма обратного звонка
  `.trim()
}

function formatDefaultMessage(data: any) {
  return `
📝 <b>НОВОЕ СООБЩЕНИЕ</b>

${Object.entries(data).map(([key, value]) => `• <b>${key}:</b> ${value}`).join('\n')}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
🌐 <b>Источник:</b> Сайт
  `.trim()
}
