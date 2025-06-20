import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, MapPin, Mail } from "lucide-react"

export default function ContactsSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
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
              <a href="tel:+78129869803" className="block text-amber-900 font-semibold hover:text-orange-700">
                8 (812) 986-98-03
              </a>
              <a href="tel:+79633296563" className="block text-amber-800 hover:text-orange-700">
                8 (963) 329-65-63
              </a>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-gray-100" />
            </div>
            <div>
              <div className="text-amber-800">Санкт-Петербург,</div>
              <div className="text-amber-900 font-semibold">улица Бабушкина, 2</div>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-4 bg-white p-6 rounded-lg border border-amber-200">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-gray-100" />
            </div>
            <div>
                              <div className="text-amber-800">E-mail:</div>
              <a href="mailto:vegasia@mail.ru" className="text-amber-900 font-semibold hover:text-orange-700">
                vegasia@mail.ru
              </a>
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
                <p className="text-sm">Санкт-Петербург, ул. Бабушкина, 2</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-amber-900 mb-2">Хотите к нам в гости?</h3>
                              <p className="text-amber-800 mb-2">
                <span className="text-orange-700 font-semibold">Наш офис находится по адресу: улица Бабушкина, 2</span>
              </p>
                              <p className="text-amber-800 mb-6">Оставьте заявку, чтобы мы могли оформить пропуск в бизнес-центр</p>
              <div className="space-y-4">
                <Input placeholder="Введите ваше имя" className="border-amber-300 focus:border-amber-500" />
                <Input placeholder="Ваш телефон" className="border-amber-300 focus:border-amber-500" />
                <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100">
                  Получить консультацию
                </Button>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="consent5" className="text-amber-600" defaultChecked />
                  <label htmlFor="consent5" className="text-sm text-amber-800">
                    Даю согласие на обработку персональных данных
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
