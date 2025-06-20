import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left */}
          <div className="space-y-2">
            <div className="text-amber-100">© 2024 «Штукатур СПб» Все права защищены</div>
            <a href="#" className="text-amber-300 hover:text-amber-100 text-sm underline">
              Политика конфиденциальности
            </a>
          </div>

          {/* Center */}
          <div className="text-center">
            <span className="text-amber-200">Разработка сайта: </span>
            <a href="#" className="text-amber-300 hover:text-amber-100 underline">
              WebZavod.bz
            </a>
          </div>

          {/* Right */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-right">
              <div className="text-amber-100 font-semibold">8 (812) 986-98-03</div>
              <div className="text-amber-200 text-sm">8 (963) 329-65-63</div>
            </div>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100 border-amber-500">
              Перезвоните мне
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
