"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Play, User } from "lucide-react"

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState("video")
  const [showMore, setShowMore] = useState(false)

  const videoReviews = [
    {
      id: 1,
      thumbnail: "/placeholder.svg?height=300&width=400",
      title: "Отзыв о штукатурке квартиры",
    },
    {
      id: 2,
      thumbnail: "/placeholder.svg?height=300&width=400",
      title: "Отзыв о работе в коттедже",
    },
  ]

  const textReviews = [
    {
      name: "Мария Власова",
      role: "заказчица",
      title: "10 из 10",
      text: "Большое спасибо! Выбрала вас за профессиональный подход к работе. На замере сметчик наглядно показал отклонение стен, показал какой слой штукатурки будет, подробно объяснил всю технологию. Организация работ на 10 из 10. Прораб в Whatsapp присылал фотоотчеты о ходе ремонта. Все сделали даже раньше срока по договору!",
    },
    {
      name: "Игорь Емельянов",
      role: "заказчик",
      title: "Отличное качество",
      text: "Мы с женой приобрели квартиру в новом доме в начале ноября. Очень хотели въехать до праздников, но тут нам сказали, сколько по времени займет черновая отделка. Стал искать варианты, наткнулся на вас. Спасибо, отличное качество работы, сделали штукатурку с глянцеванием, поверх можно сразу клеить обои.",
    },
    {
      name: "Валерий Денисов",
      role: "заказчик",
      title: "Быстрее, чем ожидали",
      text: "Я считаю, что в 21 веке нужно следить за технологиями, потому что они серьезно облегчают жизнь. Когда готовился к ремонту, увидел видео на Ютубе про механизированную штукатурку. Коттедж 520 метров по стенам за 7 дней - это фантастика! Сделали ровно и аккуратно. Спасибо!",
    },
    {
      name: "Ольга Мельникова",
      role: "заказчица",
      title: "Черновая отделка под ключ",
      text: "Срок аренды квартиры уже подходил к концу, и я начинала нервничать. Решила, что надо ускоряться, и выбрала вас. Я и не ожидала, что можно так быстро сделать всю черновую отделку. Штукатурка стен заняла 3 дня, электрика 5 дней, а стяжку пола сделали за день.",
    },
    {
      name: "Кирилл Жданов",
      role: "заказчик",
      title: "Быстро и недорого",
      text: "Я давно слышал о механизированной штукатурке, но думал, что это очень дорого. Потом, когда купил свою квартиру, задумался о таком варианте для ремонта. Просмотрел цены и понял, что это даже дешевле чем обычная ручная штукатурка.",
    },
    {
      name: "Максим Стаханов",
      role: "заказчик",
      title: "Фиксированная стоимость",
      text: "Огромное вам спасибо! Стоимость как и обещал сметчик Сергей не изменилась в ходе работ. Качество и организация работ на высшем уровне. Обязательно буду вас рекомендовать всем друзьям и соседям!",
    },
  ]

  const visibleReviews = showMore ? textReviews : textReviews.slice(0, 3)

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-amber-900 mb-8">
            <span className="text-orange-700">Отзывы</span> <span className="text-amber-800">клиентов</span>
          </h2>

          {/* Tab Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <Button
              variant={activeTab === "video" ? "default" : "outline"}
              onClick={() => setActiveTab("video")}
              className={
                activeTab === "video"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-gray-100"
                  : "border-amber-300 text-amber-800 hover:bg-amber-50"
              }
            >
              ВИДЕООТЗЫВЫ
            </Button>
            <Button
              variant={activeTab === "text" ? "default" : "outline"}
              onClick={() => setActiveTab("text")}
              className={
                activeTab === "text"
                  ? "bg-gradient-to-r from-amber-600 to-orange-600 text-gray-100"
                  : "border-amber-300 text-amber-800 hover:bg-amber-50"
              }
            >
              ТЕКСТОВЫЕ
            </Button>
          </div>
        </div>

        {/* Video Reviews */}
        {activeTab === "video" && (
          <div className="grid md:grid-cols-2 gap-8">
            {videoReviews.map((video) => (
              <div key={video.id} className="relative group cursor-pointer">
                <div className="aspect-video bg-amber-100 rounded-lg overflow-hidden border border-amber-200">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <Play className="w-8 h-8 text-amber-600 ml-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Text Reviews */}
        {activeTab === "text" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleReviews.map((review, index) => (
                <Card key={index} className="bg-white border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <h4 className="text-lg font-bold text-amber-900 mb-3">{review.title}</h4>
                    <p className="text-amber-800 text-sm mb-4 leading-relaxed">{review.text}</p>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-100" />
                      </div>
                      <div>
                        <div className="font-semibold text-amber-900">{review.name}</div>
                        <div className="text-sm text-amber-800">{review.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Show More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowMore(!showMore)}
                className="border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                {showMore ? "Скрыть отзывы" : "Показать еще"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
