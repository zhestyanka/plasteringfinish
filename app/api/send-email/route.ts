import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { to, subject, text } = await request.json()

    console.log('📧 Попытка отправки email:')
    console.log('Кому:', to)
    console.log('Тема:', subject)
    console.log('Текст:', text)

    // В реальном проекте здесь был бы код отправки через nodemailer
    // Но пока просто логируем для демонстрации
    console.log('✅ Email успешно отправлен (демо режим)')
    
    // Возвращаем успешный ответ
    return NextResponse.json({ 
      success: true, 
      messageId: `demo-${Date.now()}`,
      message: 'Email отправлен в демо режиме'
    })

  } catch (error) {
    console.error('❌ Ошибка отправки email:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка отправки email' },
      { status: 500 }
    )
  }
}
