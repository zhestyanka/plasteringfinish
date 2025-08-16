import { NextRequest, NextResponse } from 'next/server'
import { sendCalculatorFormToTelegram } from '@/lib/telegram'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    // Валидация данных
    if (!formData.name || !formData.phone) {
      return NextResponse.json({ 
        error: 'Имя и телефон обязательны' 
      }, { status: 400 })
    }

    if (!formData.clientPrice || !formData.areaToPlaster) {
      return NextResponse.json({ 
        error: 'Цена и площадь обязательны для расчета' 
      }, { status: 400 })
    }

    // Отправляем данные калькулятора в Telegram
    const telegramSuccess = await sendCalculatorFormToTelegram({
      clientPrice: formData.clientPrice,
      areaToPlaster: formData.areaToPlaster,
      layerThickness: formData.layerThickness || '0',
      areaPerShift: formData.areaPerShift || '0',
      bagPrice: formData.bagPrice || '0',
      bagWeight: formData.bagWeight || '0',
      name: formData.name,
      phone: formData.phone,
      email: formData.email
    })

    // Рассчитываем примерную стоимость
    const area = parseFloat(formData.areaToPlaster) || 0
    const price = parseFloat(formData.clientPrice) || 0
    const totalCost = area * price

    // Логируем для отладки
    console.log('=== РАСЧЕТ СТОИМОСТИ ===')
    console.log('Клиент:', formData.name)
    console.log('Телефон:', formData.phone)
    console.log('Площадь:', formData.areaToPlaster, 'м²')
    console.log('Цена за м²:', formData.clientPrice, '₽')
    console.log('Примерная стоимость:', totalCost.toLocaleString('ru-RU'), '₽')
    console.log('Telegram отправлен:', telegramSuccess ? '✅' : '❌')
    console.log('==================')

    return NextResponse.json({ 
      success: true, 
      message: 'Расчет отправлен',
      calculatedCost: totalCost,
      telegramSent: telegramSuccess
    })
    
  } catch (error) {
    console.error('Ошибка отправки расчета:', error)
    return NextResponse.json({ 
      error: 'Ошибка отправки расчета' 
    }, { status: 500 })
  }
}
