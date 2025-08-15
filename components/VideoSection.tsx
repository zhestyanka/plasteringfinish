import { Play } from "lucide-react"

export default function VideoSection() {
  return (
    <section id="video" className="py-16 bg-gradient-to-b from-amber-900 to-orange-900 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              <span className="text-amber-300">Поэтапный процесс</span>
              <br />
              штукатурки машинным способом
            </h2>
            <p className="text-xl text-amber-100">Посмотрите яркий пример нашей работы</p>
          </div>

          {/* Right Column - Video */}
          <div className="relative">
            <div className="aspect-video bg-amber-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-amber-700 to-orange-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-colors cursor-pointer">
                    <Play className="w-10 h-10 text-gray-100 ml-1" />
                  </div>
                  <p className="text-amber-100">Нажмите для воспроизведения</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
