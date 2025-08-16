import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const contentFilePath = path.join(process.cwd(), 'data', 'content.json')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Валидация обязательных полей
    if (!formData.name || !formData.phone) {
      return NextResponse.json(
        { success: false, message: 'Имя и телефон обязательны для заполнения' },
        { status: 400 }
      )
    }

    // Читаем текущие настройки из content.json
    let recipientEmail = '9110163777@rambler.ru' // значение по умолчанию
    try {
      const contentData = await fs.readFile(contentFilePath, 'utf-8')
      const content = JSON.parse(contentData)
      console.log('📧 Читаем email из content.json:', content.contacts?.email || 'не найден')
      if (content.contacts && content.contacts.email) {
        recipientEmail = content.contacts.email
        console.log('✅ Email успешно прочитан:', recipientEmail)
      } else {
        console.log('⚠️ Email не найден в content.json, используем по умолчанию:', recipientEmail)
      }
    } catch (error) {
      console.log('❌ Ошибка чтения content.json, используем email по умолчанию:', recipientEmail)
      console.error('Детали ошибки:', error)
    }

    // Определяем тип формы и формируем тему письма
    let emailSubject = 'Новая заявка с сайта'
    let formType = 'общая'
    
    if (formData.service) {
      emailSubject = `Заявка на услугу: ${formData.service}`
      formType = 'услуга'
    } else if (formData.area) {
      emailSubject = `Заявка на расчет: ${formData.area} м²`
      formType = 'расчет'
    } else if (formData.message && formData.message.includes('консультация')) {
      emailSubject = 'Заявка на консультацию'
      formType = 'консультация'
    }

    // Формируем тело письма
    const emailBody = `
=== НОВАЯ ЗАЯВКА С САЙТА ===

Тип заявки: ${formType}
Дата: ${new Date().toLocaleString('ru-RU')}

ИНФОРМАЦИЯ О КЛИЕНТЕ:
Имя: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email || 'Не указан'}

${formData.area ? `Площадь помещения: ${formData.area} м²` : ''}
${formData.service ? `Интересующая услуга: ${formData.service}` : ''}

ДОПОЛНИТЕЛЬНАЯ ИНФОРМАЦИЯ:
${formData.message || 'Не указана'}

---
Отправлено с сайта: ${request.headers.get('origin') || 'Неизвестно'}
IP адрес: ${request.headers.get('x-forwarded-for') || 'Неизвестно'}
User-Agent: ${request.headers.get('user-agent') || 'Неизвестно'}
    `.trim()

    // Логируем заявку (в реальном проекте здесь была бы отправка email)
    console.log('=== НОВАЯ ЗАЯВКА ===')
    console.log('Получатель:', recipientEmail)
    console.log('Тема:', emailSubject)
    console.log('Содержание:', emailBody)
    console.log('========================')

    // В реальном проекте здесь был бы код отправки email
    // Например, через nodemailer или другой сервис

    return NextResponse.json({ 
      success: true, 
      message: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.' 
    })

  } catch (error) {
    console.error('Ошибка обработки заявки:', error)
    return NextResponse.json(
      { success: false, message: 'Ошибка при отправке заявки. Попробуйте позже.' },
      { status: 500 }
    )
  }
}

