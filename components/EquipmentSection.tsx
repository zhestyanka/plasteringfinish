import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Settings, Wrench, Package } from "lucide-react"

export default function EquipmentSection() {
  const equipment = [
    {
      icon: Settings,
      count: "6",
      title: "штукатурных станций PFT RITMO XL",
      subtitle: "для квартиры",
      description: "Сочетание компактности и эффективности",
    },
    {
      icon: Wrench,
      count: "4",
      title: "штукатурные станции PFT G4 FU",
      subtitle: "для квартир",
      description: "Высокая производительность для больших площадей",
    },
    {
      icon: Package,
      count: "",
      title: "Knauf MP 75, Волма Гипс-Актив Экстра, Kreisel 501",
      subtitle: "",
      description: "Используем только проверенные штукатурные смеси",
    },
  ]

  return (
    <section id="equipment" className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-4">
            <span className="text-orange-700">Наше</span> <span className="text-amber-800">оборудование</span> и
            материалы
          </h2>
                      <p className="text-xl text-amber-800">10 профессиональных штукатурных станций для любых помещений</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {equipment.map((item, index) => (
            <Card key={index} className="bg-white border-2 border-amber-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-8 h-8 text-gray-100" />
                </div>

                {item.count && <div className="text-4xl font-bold text-orange-600 mb-4">{item.count}</div>}

                <h3 className="text-lg font-bold text-amber-900 mb-2">
                  {item.title}
                  {item.subtitle && <span className="block text-orange-700">{item.subtitle}</span>}
                </h3>

                <p className="text-amber-800">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100 px-8 py-3 text-lg">
            ПОЛУЧИТЬ СМЕТУ
          </Button>
        </div>
      </div>
    </section>
  )
}
