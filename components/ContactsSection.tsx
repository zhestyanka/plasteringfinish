"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, MapPin, Mail } from "lucide-react"

interface ContactData {
  phone: string
  email: string
  address: string
  workingHours: string
  description?: string
  socialMedia?: {
    telegram?: string
    whatsapp?: string
    vk?: string
  }
}

export default function ContactsSection() {
  const [contactData, setContactData] = useState<ContactData>({
    phone: "",
    email: "",
    address: "",
    workingHours: ""
  })
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })

  useEffect(() => {
    const loadContactData = async () => {
      try {
        const response = await fetch('/api/data/content')
        if (response.ok) {
          const data = await response.json()
          if (data.contacts) {
            setContactData(data.contacts)
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки контактов:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadContactData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const formDataWithType = {
        ...formData,
        type: 'contact'
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataWithType)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.')
        setFormData({
          name: '',
          phone: ''
        })
      } else {
        alert(`Ошибка: ${result.error || 'Не удалось отправить заявку'}`)
      }
    } catch (error) {
      console.error('Ошибка отправки формы:', error)
      alert('Произошла ошибка при отправке заявки. Попробуйте еще раз.')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (isLoading) {
    return (
      <section id="contacts" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contacts" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900">Контакты</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Phone */}
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-gray-100" />
            </div>
            <div>
              {contactData.phone ? (
                <a 
                  href={`tel:${contactData.phone.replace(/\D/g, '')}`}
                  className="block text-amber-900 font-semibold hover:text-orange-700"
                >
                  {contactData.phone}
                </a>
              ) : (
                <div className="text-amber-900 font-semibold">Телефон не указан</div>
              )}
              {contactData.workingHours && (
                <div className="text-amber-800 text-sm mt-1">{contactData.workingHours}</div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-100" />
            </div>
            <div>
              <div className="text-amber-800">Адрес:</div>
              <div className="text-amber-900 font-semibold">
                {contactData.address || 'Адрес не указан'}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-100" />
            </div>
            <div>
              <div className="text-amber-800">E-mail:</div>
              {contactData.email ? (
                <a 
                  href={`mailto:${contactData.email}`}
                  className="text-amber-900 font-semibold hover:text-orange-700"
                >
                  {contactData.email}
                </a>
              ) : (
                <div className="text-amber-900 font-semibold">Email не указан</div>
              )}
            </div>
          </div>
        </div>

        {/* Map and Form */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="aspect-video bg-amber-100 rounded-lg border border-amber-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
              <div className="text-center text-amber-800">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p>Интерактивная карта</p>
                <p className="text-sm">{contactData.address || 'Адрес не указан'}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-amber-900 mb-2">Свяжитесь с нами</h3>
              {contactData.description && (
                <p className="text-amber-800 mb-6">{contactData.description}</p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <Input 
                    type="text" 
                    name="name" 
                    placeholder="Введите ваше имя" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    className="border-amber-300 focus:border-amber-500" 
                    required
                  />
                  <Input 
                    type="tel" 
                    name="phone" 
                    placeholder="Ваш телефон" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    className="border-amber-300 focus:border-amber-500" 
                    required
                  />
                  <Button type="submit" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100">
                    Получить консультацию
                  </Button>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consent5" className="text-amber-600" defaultChecked />
                    <label htmlFor="consent5" className="text-sm text-amber-800">
                      Даю согласие на обработку персональных данных
                    </label>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
