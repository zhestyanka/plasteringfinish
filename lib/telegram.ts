import TelegramBot from 'node-telegram-bot-api'

// Конфигурация Telegram бота
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

// Создаем экземпляр бота
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: false })

/**
 * Отправляет заявку в Telegram
 */
export async function sendTelegramNotification(formData: any) {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram bot token или chat ID не настроены')
      return false
    }

    // Формируем сообщение
    const message = formatTelegramMessage(formData)
    
    // Отправляем сообщение
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
 * Форматирует данные заявки для Telegram
 */
function formatTelegramMessage(data: any): string {
  const timestamp = new Date().toLocaleString('ru-RU')
  
  let message = `🔔 <b>Новая заявка с сайта</b>\n\n`
  message += `📅 <b>Дата:</b> ${timestamp}\n\n`

  // Основная информация
  if (data.name) message += `👤 <b>Имя:</b> ${data.name}\n`
  if (data.phone) message += `📞 <b>Телефон:</b> ${data.phone}\n`
  if (data.email) message += `📧 <b>Email:</b> ${data.email}\n`
  
  // Адрес
  if (data.address) message += `📍 <b>Адрес:</b> ${data.address}\n`
  
  // Площадь и тип работ
  if (data.area) message += `📏 <b>Площадь:</b> ${data.area}\n`
  if (data.workType) message += `🔨 <b>Тип работ:</b> ${data.workType}\n`
  
  // Дополнительная информация
  if (data.description) {
    message += `\n📝 <b>Описание:</b>\n${data.description}\n`
  }
  
  // Контактная информация
  if (data.contactMethod) {
    message += `\n📞 <b>Предпочтительный способ связи:</b> ${data.contactMethod}\n`
  }
  
  // Время для звонка
  if (data.callTime) {
    message += `⏰ <b>Удобное время для звонка:</b> ${data.callTime}\n`
  }

  // Источник заявки
  if (data.source) {
    message += `\n🌐 <b>Источник:</b> ${data.source}\n`
  }

  // URL страницы
  if (data.pageUrl) {
    message += `🔗 <b>Страница:</b> ${data.pageUrl}\n`
  }

  message += `\n⚡ <b>Требует быстрого ответа!</b>`

  return message
}

/**
 * Отправляет тестовое сообщение в Telegram
 */
export async function sendTestTelegramMessage(): Promise<boolean> {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Telegram bot token или chat ID не настроены')
      return false
    }

    const testMessage = `🧪 <b>Тестовое сообщение</b>\n\n✅ Интеграция с Telegram работает корректно!\n\n📅 ${new Date().toLocaleString('ru-RU')}`
    
    await bot.sendMessage(TELEGRAM_CHAT_ID, testMessage, {
      parse_mode: 'HTML'
    })

    console.log('✅ Тестовое сообщение отправлено в Telegram')
    return true
  } catch (error) {
    console.error('❌ Ошибка отправки тестового сообщения:', error)
    return false
  }
}

/**
 * Проверяет настройки Telegram
 */
export function checkTelegramConfig(): boolean {
  return !!(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID)
}
