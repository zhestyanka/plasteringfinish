import { Truck, Clock, Thermometer, Calendar } from "lucide-react"

export default function WarehouseSection() {
  const benefits = [
    {
      icon: Truck,
      title: "Штукатурка дешевле чем в розничных магазинах",
      description: "Закупаем смесь оптом на заводе",
    },
    {
      icon: Clock,
      title: "Бесперебойная работа бригады мастеров",
      description: "Завозим на объект материал с запасом 5%. Излишки вывозим обратно на склад",
    },
    {
      icon: Thermometer,
      title: "Храним материалы по ГОСТу",
      description:
        "Соблюдаем температурный режим и нормы влажности. Гарантируем сохранение качеств заявленных производителем",
    },
    {
      icon: Calendar,
      title: "Выходим на объект от 1-го дня",
      description: "Мы не зависим от сторонних поставщиков. Материал всегда в наличии",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-20 w-32 h-32 bg-amber-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            <span className="text-orange-700">Предоставляем</span> материал
            <br />
            <span className="text-amber-800">с собственного</span> склада
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start space-x-4 bg-white/70 p-6 rounded-lg border border-amber-200">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <benefit.icon className="w-8 h-8 text-gray-100" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-2">{benefit.title}</h3>
                <p className="text-amber-800">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
