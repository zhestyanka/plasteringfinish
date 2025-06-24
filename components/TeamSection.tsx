"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Award, Clock } from "lucide-react"

interface TeamMember {
  id: string
  name: string
  role: string
  experience: string
  certificate: string
  image: string
  active: boolean
}

interface TeamData {
  team: TeamMember[]
}

export default function TeamSection() {
  const [activeTeamMember, setActiveTeamMember] = useState(0)
  const [teamData, setTeamData] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await fetch('/api/data/team')
        if (response.ok) {
          const data: TeamData = await response.json()
          // Фильтруем только активных сотрудников
          const activeTeam = data.team?.filter(member => member.active) || []
          setTeamData(activeTeam)
        } else {
          console.error('Failed to load team')
        }
      } catch (error) {
        console.error('Error loading team:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeam()
  }, [])

  // Если данные загружаются или команда пуста
  if (isLoading || teamData.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-amber-900 to-orange-900 text-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-amber-800 rounded w-64 mx-auto mb-8"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 bg-amber-800 rounded-lg"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-4xl font-bold mb-4">
                  <span className="text-amber-300">Наша</span> команда
                </h2>
                <p className="text-amber-100">Команда находится в процессе формирования</p>
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  const currentMember = teamData[activeTeamMember]

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
        <div className={`grid gap-4 mb-8 ${teamData.length <= 2 ? 'grid-cols-2' : teamData.length === 3 ? 'grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
          {teamData.map((member, index) => (
            <div
              key={member.id}
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
                    src={member.image || "/placeholder-user.jpg"}
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
              src={currentMember.image || "/placeholder-user.jpg"}
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
