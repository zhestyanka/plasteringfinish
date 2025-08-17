export const telegramConfig = {
  botToken: process.env.TELEGRAM_BOT_TOKEN || '8441134609:AAEE2nxXaxsh1BAkTH5QABBMCg5F4zq4RmY',
  chatId: process.env.TELEGRAM_CHAT_ID || '6476993703'
}

console.log('🔧 Telegram Config загружен:')
console.log('🔑 Bot Token:', telegramConfig.botToken ? 'Установлен' : 'Отсутствует')
console.log('💬 Chat ID:', telegramConfig.chatId ? 'Установлен' : 'Отсутствует')
