"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Play, User } from "lucide-react"

interface TextReview {
  id: string
  name: string
  role: string
  title: string
  text: string
  rating: number
  active: boolean
  featured?: boolean
}

interface VideoReview {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  active: boolean
}

interface ReviewsData {
  textReviews: TextReview[]
  videoReviews: VideoReview[]
}

export default function ReviewsSection() {
  const [activeTab, setActiveTab] = useState("video")
  const [showMore, setShowMore] = useState(false)
  const [reviewsData, setReviewsData] = useState<ReviewsData>({
    textReviews: [],
    videoReviews: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch('/api/data/reviews')
        if (response.ok) {
          const data = await response.json()
          setReviewsData(data)
        } else {
          console.error('Failed to load reviews')
        }
      } catch (error) {
        console.error('Error loading reviews:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadReviews()
  }, [])

  // Фильтруем только активные отзывы
  const activeTextReviews = reviewsData.textReviews?.filter(review => review.active) || []
  const activeVideoReviews = reviewsData.videoReviews?.filter(review => review.active) || []

  const visibleReviews = showMore ? activeTextReviews : activeTextReviews.slice(0, 3)

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-orange-50 to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-amber-200 rounded w-64 mx-auto mb-8"></div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-48 bg-amber-100 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

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
              ВИДЕООТЗЫВЫ ({activeVideoReviews.length})
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
              ТЕКСТОВЫЕ ({activeTextReviews.length})
            </Button>
          </div>
        </div>

        {/* Video Reviews */}
        {activeTab === "video" && (
          <div className="grid md:grid-cols-2 gap-8">
            {activeVideoReviews.map((video) => (
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
                <h3 className="text-lg font-semibold text-amber-900 mt-3 text-center">{video.title}</h3>
              </div>
            ))}
          </div>
        )}

        {/* Text Reviews */}
        {activeTab === "text" && (
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleReviews.map((review) => (
                <Card key={review.id} className="bg-white border-amber-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(review.rating || 5)].map((_, i) => (
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
            {activeTextReviews.length > 3 && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setShowMore(!showMore)}
                className="border-amber-300 text-amber-800 hover:bg-amber-50"
              >
                {showMore ? "Скрыть отзывы" : "Показать еще"}
              </Button>
            </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
