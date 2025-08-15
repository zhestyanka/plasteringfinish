"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Footer } from "@/lib/admin/types"

export default function Footer() {
  const [footerData, setFooterData] = useState<Footer>({
    copyright: "© 2024 «Штукатур СПб» Все права защищены",
    privacyPolicy: "Политика конфиденциальности",
    privacyPolicyUrl: "#",
    development: "Разработка сайта: WebZavod.bz",
    developmentUrl: "#",
    phones: ["8 (812) 986-98-03", "8 (963) 329-65-63"],
    callbackButton: "Перезвоните мне"
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        const response = await fetch('/api/data/content')
        if (response.ok) {
          const data = await response.json()
          if (data.footer) {
            setFooterData(data.footer)
          }
        }
      } catch (error) {
        console.error('Ошибка загрузки данных футера:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFooterData()
  }, [])

  if (isLoading) {
    return (
      <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-300"></div>
          </div>
        </div>
      </footer>
    )
  }

  // Безопасная обработка development
  const developmentParts = footerData.development.includes(':') 
    ? footerData.development.split(':') 
    : ['Разработка сайта', footerData.development]

  return (
    <footer className="bg-gradient-to-r from-amber-900 to-orange-900 text-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          {/* Left */}
          <div className="space-y-2">
            <div className="text-amber-100">{footerData.copyright}</div>
            <a href={footerData.privacyPolicyUrl} className="text-amber-300 hover:text-amber-100 text-sm underline">
              {footerData.privacyPolicy}
            </a>
          </div>

          {/* Center */}
          <div className="text-center">
            <span className="text-amber-200">{developmentParts[0]}: </span>
            <a href={footerData.developmentUrl} className="text-amber-300 hover:text-amber-100 underline">
              {developmentParts[1]}
            </a>
          </div>

          {/* Right */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="text-right">
              {footerData.phones.map((phone, index) => (
                <div 
                  key={index} 
                  className={index === 0 ? "text-amber-100 font-semibold" : "text-amber-200 text-sm"}
                >
                  {phone}
                </div>
              ))}
            </div>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-gray-100 border-amber-500">
              {footerData.callbackButton}
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
