import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const contentFilePath = path.join(process.cwd(), 'data', 'content.json')

export async function POST(request: NextRequest) {
  try {
    console.log('📨 API Contact вызван')
    console.log('📋 Headers:', Object.fromEntries(request.headers.entries()))
    
    const formData = await request.json()
    console.log('📋 Полученные данные:', formData)
    
    // Валидация данных
    if (!formData.name || !formData.phone) {
      console.log('❌ Валидация не пройдена:')
      console.log('   name:', formData.name)
      console.log('   phone:', formData.phone)
      return NextResponse.json({ 
        error: 'Имя и телефон обязательны' 
      }, { status: 400 })
    }

    // Загружаем email из content.json
    let recipientEmail = '9110163777@rambler.ru' // дефолтный email
    
    try {
      const fileContents = await fs.readFile(contentFilePath, 'utf8')
      const data = JSON.parse(fileContents)
      if (data.contacts?.email) {
        recipientEmail = data.contacts.email
      }
    } catch (error) {
      console.error('Ошибка чтения content.json:', error)
    }

    // Формируем текст письма
    const emailSubject = 'Новая заявка с сайта Штукатур СПб'
    const emailBody = `
Новая заявка с сайта:

Имя: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email || 'Не указан'}
Площадь: ${formData.area || 'Не указана'} м²
Сообщение: ${formData.message || 'Не указано'}

Дата отправки: ${new Date().toLocaleString('ru-RU')}
    `.trim()

    // Отправляем в Telegram
    try {
      console.log('🔍 Начинаем отправку в Telegram...')
      console.log('📋 Данные формы:', formData)
      
      const telegramData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'Не указан',
        area: formData.area || 'Не указана',
        message: formData.message || 'Не указано',
        // Данные калькулятора
        clientPrice: formData.clientPrice || 'Не указано',
        areaToPlaster: formData.areaToPlaster || 'Не указано',
        layerThickness: formData.layerThickness || 'Не указано',
        areaPerShift: formData.areaPerShift || 'Не указано',
        bagWeight: formData.bagWeight || 'Не указано',
        bagPrice: formData.bagPrice || 'Не указано',
        totalCost: formData.totalCost || 'Не рассчитано',
        source: formData.type === 'calculator' ? 'Калькулятор' : 'Контактная форма'
      }

      console.log('📤 Данные для Telegram:', telegramData)
      console.log('🌐 URL для отправки:', `http://localhost:3000/api/telegram`)

      const telegramResponse = await fetch(`http://localhost:3000/api/telegram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: telegramData,
          type: formData.type || 'contact'
        })
      })

      console.log('📡 Статус ответа Telegram:', telegramResponse.status)
      console.log('📡 Заголовки ответа:', Object.fromEntries(telegramResponse.headers.entries()))

      const telegramResult = await telegramResponse.json()
      console.log('📨 Результат Telegram:', telegramResult)
      
      if (telegramResponse.ok) {
        if (telegramResult.telegramConfigured === false) {
          console.log('⚠️ Telegram не настроен, но заявка сохранена')
        } else {
          console.log('✅ Сообщение отправлено в Telegram')
        }
      } else {
        console.log('⚠️ Ошибка отправки в Telegram:', telegramResult.error)
      }
    } catch (telegramError) {
      console.error('❌ Telegram error:', telegramError)
      console.error('❌ Stack trace:', telegramError instanceof Error ? telegramError.stack : 'No stack trace')
    }

    // Здесь должна быть логика отправки email
    // Для демонстрации просто логируем
    console.log('=== НОВАЯ ЗАЯВКА ===')
    console.log('Получатель:', recipientEmail)
    console.log('Тема:', emailSubject)
    console.log('Содержание:', emailBody)
    console.log('==================')

    // В реальном проекте здесь будет отправка через nodemailer или другой сервис
    // Пример с nodemailer:
    /*
    const nodemailer = require('nodemailer')
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
      }
    })
    
    await transporter.sendMail({
      from: 'your-email@gmail.com',
      to: recipientEmail,
      subject: emailSubject,
      text: emailBody
    })
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка успешно отправлена',
      recipientEmail: recipientEmail
    })
    
  } catch (error) {
    console.error('Ошибка отправки заявки:', error)
    return NextResponse.json({ 
      error: 'Ошибка отправки заявки' 
    }, { status: 500 })
  }
}