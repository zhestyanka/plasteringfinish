import TelegramBot from 'node-telegram-bot-api'

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE'
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID_HERE'

// Создаем экземпляр бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false })

// Интерфейс для заявки
interface ContactForm {
  name: string
  phone: string
  email?: string
  message?: string
  area?: string
  address?: string
  source?: string
}

// Интерфейс для калькулятора
interface CalculatorForm {
  clientPrice: string
  areaToPlaster: string
  layerThickness: string
  areaPerShift: string
  bagPrice: string
  bagWeight: string
  name: string
  phone: string
  email?: string
}

/**
 * Отправляет заявку в Telegram
 */
export async function sendContactFormToTelegram(formData: ContactForm): Promise<boolean> {
  try {
    const message = formatContactFormMessage(formData)
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
    
    console.log('✅ Заявка отправлена в Telegram')
    return true
  } catch (error) {
    console.error('❌ Ошибка отправки в Telegram:', error)
    return false
  }
}

/**
 * Отправляет данные калькулятора в Telegram
 */
export async function sendCalculatorFormToTelegram(formData: CalculatorForm): Promise<boolean> {
  try {
    const message = formatCalculatorFormMessage(formData)
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, message, {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
    
    console.log('✅ Данные калькулятора отправлены в Telegram')
    return true
  } catch (error) {
    console.error('❌ Ошибка отправки калькулятора в Telegram:', error)
    return false
  }
}

/**
 * Форматирует сообщение для заявки
 */
function formatContactFormMessage(formData: ContactForm): string {
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  return `
🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b>

📅 <b>Дата:</b> ${timestamp}
👤 <b>Имя:</b> ${formData.name}
📞 <b>Телефон:</b> ${formData.phone}
${formData.email ? `📧 <b>Email:</b> ${formData.email}` : ''}
${formData.area ? `📏 <b>Площадь:</b> ${formData.area}` : ''}
${formData.address ? `📍 <b>Адрес:</b> ${formData.address}` : ''}
${formData.message ? `💬 <b>Сообщение:</b> ${formData.message}` : ''}
${formData.source ? `🌐 <b>Источник:</b> ${formData.source}` : ''}

⚡️ <i>Требует быстрого ответа!</i>
  `.trim()
}

/**
 * Форматирует сообщение для калькулятора
 */
function formatCalculatorFormMessage(formData: CalculatorForm): string {
  const timestamp = new Date().toLocaleString('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })

  // Рассчитываем примерную стоимость
  const area = parseFloat(formData.areaToPlaster) || 0
  const price = parseFloat(formData.clientPrice) || 0
  const totalCost = area * price

  return `
🧮 <b>РАСЧЕТ СТОИМОСТИ</b>

📅 <b>Дата:</b> ${timestamp}
👤 <b>Имя:</b> ${formData.name}
📞 <b>Телефон:</b> ${formData.phone}
${formData.email ? `📧 <b>Email:</b> ${formData.email}` : ''}

📊 <b>Параметры расчета:</b>
• Цена за м²: ${formData.clientPrice} ₽
• Площадь: ${formData.areaToPlaster} м²
• Толщина слоя: ${formData.layerThickness} мм
• Площадь за смену: ${formData.areaPerShift} м²
• Цена мешка: ${formData.bagPrice} ₽
• Вес мешка: ${formData.bagWeight} кг

💰 <b>Примерная стоимость:</b> ${totalCost.toLocaleString('ru-RU')} ₽

⚡️ <i>Клиент заинтересован в расчете!</i>
  `.trim()
}

/**
 * Проверяет подключение к Telegram
 */
export async function testTelegramConnection(): Promise<boolean> {
  try {
    const me = await bot.getMe()
    console.log('✅ Telegram бот подключен:', me.username)
    return true
  } catch (error) {
    console.error('❌ Ошибка подключения к Telegram:', error)
    return false
  }
}

/**
 * Отправляет тестовое сообщение
 */
export async function sendTestMessage(): Promise<boolean> {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, '🧪 Тестовое сообщение от сайта штукатурки', {
      parse_mode: 'HTML'
    })
    console.log('✅ Тестовое сообщение отправлено')
    return true
  } catch (error) {
    console.error('❌ Ошибка отправки тестового сообщения:', error)
    return false
  }
}

export default bot
