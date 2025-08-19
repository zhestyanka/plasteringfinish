import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

const calculatorContentFilePath = path.join(process.cwd(), 'data', 'calculator-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(calculatorContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading calculator content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
      content: {
        header: {
          title: "Рассчитайте стоимость штукатурки",
          subtitle: "Получите точную смету за 5 минут"
        },
        form: {
          name: "Ваше имя",
          phone: "Номер телефона",
          email: "Email",
          area: "Площадь помещения (м²)",
          message: "Дополнительная информация",
          button: "РАССЧИТАТЬ СТОИМОСТЬ",
          consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
        },
        features: {
          warranty: {
            title: "Гарантия",
            value: "до 7 лет"
          },
          visit: {
            title: "Выезд",
            value: "в день обращения"
          },
          quality: {
            title: "Качество",
            value: "по ГОСТ"
          }
        },
        rating: {
          value: "4.9 из 5",
          reviews: "157 отзывов на Яндекс.Карты"
        }
      }
    }
    return NextResponse.json(defaultData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(calculatorContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Calculator content saved successfully' })
  } catch (error) {
    console.error('Error saving calculator content:', error)
    return NextResponse.json({ error: 'Failed to save calculator content' }, { status: 500 })
  }
}
import { promises as fs } from 'fs'
import path from 'path'

const calculatorContentFilePath = path.join(process.cwd(), 'data', 'calculator-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(calculatorContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading calculator content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
      content: {
        header: {
          title: "Рассчитайте стоимость штукатурки",
          subtitle: "Получите точную смету за 5 минут"
        },
        form: {
          name: "Ваше имя",
          phone: "Номер телефона",
          email: "Email",
          area: "Площадь помещения (м²)",
          message: "Дополнительная информация",
          button: "РАССЧИТАТЬ СТОИМОСТЬ",
          consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
        },
        features: {
          warranty: {
            title: "Гарантия",
            value: "до 7 лет"
          },
          visit: {
            title: "Выезд",
            value: "в день обращения"
          },
          quality: {
            title: "Качество",
            value: "по ГОСТ"
          }
        },
        rating: {
          value: "4.9 из 5",
          reviews: "157 отзывов на Яндекс.Карты"
        }
      }
    }
    return NextResponse.json(defaultData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(calculatorContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Calculator content saved successfully' })
  } catch (error) {
    console.error('Error saving calculator content:', error)
    return NextResponse.json({ error: 'Failed to save calculator content' }, { status: 500 })
  }
}
import { promises as fs } from 'fs'
import path from 'path'

const calculatorContentFilePath = path.join(process.cwd(), 'data', 'calculator-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(calculatorContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading calculator content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
      content: {
        header: {
          title: "Рассчитайте стоимость штукатурки",
          subtitle: "Получите точную смету за 5 минут"
        },
        form: {
          name: "Ваше имя",
          phone: "Номер телефона",
          email: "Email",
          area: "Площадь помещения (м²)",
          message: "Дополнительная информация",
          button: "РАССЧИТАТЬ СТОИМОСТЬ",
          consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
        },
        features: {
          warranty: {
            title: "Гарантия",
            value: "до 7 лет"
          },
          visit: {
            title: "Выезд",
            value: "в день обращения"
          },
          quality: {
            title: "Качество",
            value: "по ГОСТ"
          }
        },
        rating: {
          value: "4.9 из 5",
          reviews: "157 отзывов на Яндекс.Карты"
        }
      }
    }
    return NextResponse.json(defaultData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(calculatorContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Calculator content saved successfully' })
  } catch (error) {
    console.error('Error saving calculator content:', error)
    return NextResponse.json({ error: 'Failed to save calculator content' }, { status: 500 })
  }
}
import { promises as fs } from 'fs'
import path from 'path'

const calculatorContentFilePath = path.join(process.cwd(), 'data', 'calculator-content.json')

export async function GET() {
  try {
    const fileContents = await fs.readFile(calculatorContentFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  } catch (error) {
    console.error('Error reading calculator content:', error)
    // Возвращаем дефолтные данные если файл не существует
    const defaultData = {
      content: {
        header: {
          title: "Рассчитайте стоимость штукатурки",
          subtitle: "Получите точную смету за 5 минут"
        },
        form: {
          name: "Ваше имя",
          phone: "Номер телефона",
          email: "Email",
          area: "Площадь помещения (м²)",
          message: "Дополнительная информация",
          button: "РАССЧИТАТЬ СТОИМОСТЬ",
          consent: "Нажимая кнопку, вы соглашаетесь с обработкой персональных данных"
        },
        features: {
          warranty: {
            title: "Гарантия",
            value: "до 7 лет"
          },
          visit: {
            title: "Выезд",
            value: "в день обращения"
          },
          quality: {
            title: "Качество",
            value: "по ГОСТ"
          }
        },
        rating: {
          value: "4.9 из 5",
          reviews: "157 отзывов на Яндекс.Карты"
        }
      }
    }
    return NextResponse.json(defaultData, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Сохраняем данные в файл
    await fs.writeFile(calculatorContentFilePath, JSON.stringify(data, null, 2), 'utf8')
    
    return NextResponse.json({ success: true, message: 'Calculator content saved successfully' })
  } catch (error) {
    console.error('Error saving calculator content:', error)
    return NextResponse.json({ error: 'Failed to save calculator content' }, { status: 500 })
  }
}
