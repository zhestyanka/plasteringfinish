import { NextRequest, NextResponse } from 'next/server'

// Конфигурация Telegram
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function POST(request: NextRequest) {
  try {
    // Проверяем наличие переменных окружения
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.log('⚠️ Telegram не настроен: отсутствуют переменные окружения')
      return NextResponse.json({ 
        success: true, 
        message: 'Telegram не настроен, но заявка сохранена',
        telegramConfigured: false 
      })
    }

    const body = await request.json()
    const { message, type = 'form' } = body

    if (!message) {
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

    // Отправляем в Telegram
    const telegramResponse = await sendToTelegram(formattedMessage)
    
    if (telegramResponse.ok) {
      return NextResponse.json({ success: true, message: 'Message sent to Telegram' })
    } else {
      throw new Error('Failed to send to Telegram')
    }

  } catch (error) {
    console.error('Telegram API error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}

async function sendToTelegram(message: string) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    })
  })

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
