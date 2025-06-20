import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gift } from "lucide-react"

export default function GiftSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-100 to-amber-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-48 h-48 bg-orange-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 mb-6">
              <Gift className="w-12 h-12 text-orange-600" />
              <h2 className="text-4xl font-bold text-amber-900">
                <span className="text-orange-700">При заказе механизированной штукатурки</span> предоставляем{" "}
                <span className="text-amber-800">скидку</span> на стяжку пола
              </h2>
            </div>
            <div className="text-3xl font-bold text-orange-600">от 350 ₽/м²</div>
          </div>

          {/* Right Column - Form */}
          <div>
            <Card className="bg-gradient-to-br from-white to-amber-50 border-2 border-amber-200 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-amber-900 mb-2">Подготовим выгодное предложение</h3>
                <p className="text-amber-800 mb-6">с точной ценой после консультации</p>
                <div className="space-y-4">
                  <Input placeholder="Ваш телефон" className="border-amber-300 focus:border-amber-500" />
                  <Button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100">
                    Получить консультацию
                  </Button>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="consent3" className="text-amber-600" defaultChecked />
                    <label htmlFor="consent3" className="text-sm text-amber-800">
                      Даю согласие на обработку персональных данных
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
