import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json()

    // Создаем транспортер для отправки email
    // В реальном проекте здесь должны быть настройки SMTP
    const transporter = nodemailer.createTransporter({
      service: 'gmail', // или другой сервис
      auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    })

    // Отправляем email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: to,
      subject: subject,
      text: text
    })

    console.log('✅ Email отправлен:', info.messageId)
    return NextResponse.json({ success: true, messageId: info.messageId })

  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка отправки email' },
      { status: 500 }
    )
  }
}
