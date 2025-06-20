import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Phone, Ruler, FileText, Hammer, CheckCircle } from "lucide-react"

export default function StepsSection() {
  const steps = [
    {
      icon: Phone,
      number: "1",
      title: "Заявка",
      description: "Оставьте заявку на сайте или по телефону",
      link: "8 (963) 329-65-63",
    },
    {
      icon: Ruler,
      number: "2",
      title: "Замер",
      description: "С применением лазерного нивелира — максимальная точность",
    },
    {
      icon: FileText,
      number: "3",
      title: "Договор",
      description: "Согласуем смету и заключаем договор",
    },
    {
      icon: Hammer,
      number: "4",
      title: "Работа",
      description: "Проводим работы строго в срок, указанный в договоре",
    },
    {
      icon: CheckCircle,
      number: "5",
      title: "Сдача",
      description: "Заказчик принимает работу и получает гарантию на 5 лет",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-amber-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-20 w-40 h-40 bg-amber-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            Как мы <span className="text-orange-700">работаем</span>
          </h2>
                      <p className="text-xl text-amber-800">5 шагов к идеальным стенам</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <step.icon className="w-10 h-10 text-gray-100" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-900 text-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="text-lg font-bold text-amber-900 mb-2">{step.title}</h3>
              <p className="text-amber-800 text-sm mb-2">{step.description}</p>
              {step.link && (
                <a
                  href={`tel:${step.link.replace(/\s/g, "")}`}
                  className="text-orange-600 font-semibold hover:text-orange-700"
                >
                  {step.link}
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Consultation Form */}
        <Card className="bg-gradient-to-r from-white to-amber-50 border-2 border-amber-200 shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-amber-900 text-center mb-6">
              Оставьте заявку на консультацию по механизированной штукатурке
            </h3>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input placeholder="Ваш телефон" className="border-amber-300 focus:border-amber-500" />
              </div>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100 px-8">
                Получить консультацию
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <input type="checkbox" id="consent" className="text-amber-600" defaultChecked />
              <label htmlFor="consent" className="text-sm text-amber-800">
                Даю согласие на обработку персональных данных
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
