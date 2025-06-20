"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Award, Clock } from "lucide-react"

export default function TeamSection() {
  const [activeTeamMember, setActiveTeamMember] = useState(0)

  const teamMembers = [
    {
      name: "Сергей Иванов",
      role: "Оператор машины",
      experience: "Опыт работы 5 лет",
      certificate: "Сертификат KNAUF",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Дмитрий Гореев",
      role: "Прораб",
      experience: "Опыт работы 6 лет",
      certificate: "Сертификат KNAUF",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Семен Власов",
      role: "Штукатур 5 разряда",
      experience: "Опыт работы 6 лет",
      certificate: "Сертификат KNAUF",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      name: "Борис Романов",
      role: "Штукатур 6 разряда",
      experience: "Опыт работы 10 лет",
      certificate: "Сертификат KNAUF",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  const currentMember = teamMembers[activeTeamMember]

  return (
    <section className="py-16 bg-gradient-to-br from-amber-900 to-orange-900 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              <span className="text-amber-300">Наша</span> команда
            </h2>
          </div>
          <div>
            <p className="text-xl text-amber-100">
              Все мастера и прорабы проходят стажировку на заводе Knauf. Мы набираем только мастеров - славян с опытом
              работы от 5 лет
            </p>
          </div>
        </div>

        {/* Team Member Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                activeTeamMember === index ? "transform scale-105" : ""
              }`}
              onClick={() => setActiveTeamMember(index)}
            >
              <div className="text-center">
                <div
                  className={`w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden border-4 ${
                    activeTeamMember === index ? "border-amber-300" : "border-amber-600"
                  }`}
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className={`font-semibold ${activeTeamMember === index ? "text-amber-300" : "text-amber-100"}`}>
                  {member.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Active Team Member Details */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Large Photo */}
          <div className="aspect-[3/4] bg-amber-800 rounded-lg overflow-hidden">
            <img
              src={currentMember.image || "/placeholder.svg"}
              alt={currentMember.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <Card className="bg-white/10 border-amber-600 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-3xl font-bold text-amber-300 mb-6">{currentMember.name}</h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="w-6 h-6 text-amber-400" />
                  <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                    {currentMember.role}
                  </Badge>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-100">{currentMember.experience}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <span className="text-amber-100">{currentMember.certificate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
