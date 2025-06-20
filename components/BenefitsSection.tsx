import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, FileText, GraduationCap, Award, CheckCircle } from "lucide-react"

export default function BenefitsSection() {
  const benefits = [
    {
      icon: UserCheck,
      title: "Выезд инженера бесплатно",
      description:
        "Наш инженер бесплатно приедет на объект, рассчитает точную стоимость сметы и проконсультирует по вопросам штукатурки и ремонта. Это ни к чему не обязывает.",
      image: "/images/engineer.png"
    },
    {
      icon: FileText,
      title: "Юридическая ответственность",
      description:
        "Фиксируем в договоре цены и сроки работ, а также гарантию 5 лет. За каждый день просрочки — платим неустойку.",
      image: "/images/legal.png"
    },
    {
      icon: GraduationCap,
      title: "Профессиональная подготовка",
      description: "Нанимаем только мастеров с опытом от 5 лет. Дополнительно тестируем и обучаем рабочих",
      image: "/images/education.png"
    },
    {
      icon: Award,
      title: "Качество по ГОСТ",
      description:
        'Соблюдаем ГОСТ Р 57984-2017 "Штукатурка для наружных и внутренних работ". При необходимости, организуем независимую приемку работ.',
      image: "/images/gost.png"
    },
  ]

  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-gray-50 via-white to-coffee-50/30 relative overflow-hidden">
      {/* Background decorative elements - скрыты на мобильных */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-coffee-300/20 to-coffee-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-gradient-to-br from-coffee-400/20 to-coffee-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-coffee-100 text-coffee-800 px-3 md:px-4 py-2 rounded-full font-medium mb-4 text-sm">
            <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
            <span>Наши преимущества</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Почему выбирают именно нас
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Мы не просто выполняем работы — мы гарантируем качество и берем полную ответственность за результат
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="group bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-2xl hover:-translate-y-2"
            >
              <div className="relative h-40 md:h-48 overflow-hidden">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                    <benefit.icon className="w-5 h-5 md:w-6 md:h-6 text-coffee-600" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-coffee-700 transition-colors duration-300">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-sm">
                  {benefit.description}
                </p>
                
                <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-gray-100">
                  <div className="flex items-center text-coffee-600 text-xs md:text-sm font-medium">
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Гарантировано
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional info section */}
        <div className="mt-12 md:mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-coffee-600">500+</div>
              <div className="text-xs md:text-sm text-gray-600">Довольных клиентов</div>
            </div>
            <div className="w-full h-px sm:w-px sm:h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-coffee-600">8+</div>
              <div className="text-xs md:text-sm text-gray-600">Лет опыта</div>
            </div>
            <div className="w-full h-px sm:w-px sm:h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-coffee-600">5</div>
              <div className="text-xs md:text-sm text-gray-600">Лет гарантии</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
