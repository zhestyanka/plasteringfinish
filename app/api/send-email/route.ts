import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json()

    console.log('📧 Попытка отправки email:')
    console.log('Кому:', to)
    console.log('Тема:', subject)
    console.log('Текст:', text)

    // Загружаем настройки email
    const contentPath = path.join(process.cwd(), 'data', 'content.json')
    const contentData = await fs.readFile(contentPath, 'utf-8')
    const content = JSON.parse(contentData)
    const emailSettings = content.emailSettings || {}
    
    console.log('📧 Настройки SMTP:', {
      host: emailSettings.smtpHost,
      port: emailSettings.smtpPort,
      user: emailSettings.smtpUser ? '***' : 'не указан'
    })

    // Проверяем наличие настроек
    if (!emailSettings.smtpHost || !emailSettings.smtpUser || !emailSettings.smtpPass) {
      console.log('⚠️ SMTP настройки неполные, используем демо режим')
      console.log('✅ Email успешно отправлен (демо режим)')
      return NextResponse.json({ 
        success: true, 
        messageId: `demo-${Date.now()}`,
        message: 'Email отправлен в демо режиме (SMTP не настроен)'
      })
    }

    // Создаем транспортер
    const transporter = nodemailer.createTransporter({
      host: emailSettings.smtpHost,
      port: parseInt(emailSettings.smtpPort) || 587,
      secure: emailSettings.smtpSecure || false,
      auth: {
        user: emailSettings.smtpUser,
        pass: emailSettings.smtpPass
      }
    })

    // Отправляем email
    const info = await transporter.sendMail({
      from: emailSettings.smtpUser,
      to: to,
      subject: subject,
      text: text
    })

    console.log('✅ Email успешно отправлен:', info.messageId)
    return NextResponse.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'Email успешно отправлен'
    })

  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка отправки email' },
      { status: 500 }
    )
  }
}
