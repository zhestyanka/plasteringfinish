"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  ExternalLink,
  Menu,
  X
} from "lucide-react"
import { useAuth } from "@/lib/admin/auth"
import { cn } from "@/lib/utils"

interface AdminHeaderProps {
  title?: string
  subtitle?: string
  onMenuToggle?: () => void
  showMobileMenu?: boolean
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  onMenuToggle,
  showMobileMenu = false 
}: AdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { user } = useAuth()
  const pathname = usePathname()

  // Автоматическое определение заголовка на основе пути
  const getPageTitle = () => {
    if (title) return title

    const pathSegments = pathname.split("/").filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1]

    const titleMap: Record<string, string> = {
      "admin": "Дашборд",
      "content": "Управление контентом",
      "hero": "Главная страница",
      "steps": "Этапы работы",
      "pricing": "Тарифы",
      "services": "Услуги",
      "works": "Портфолио",
      "reviews": "Отзывы",
      "team": "Команда",
      "equipment": "Оборудование",
      "promotions": "Акции",
      "warehouse": "Склад",
      "contacts": "Контакты",
      "media": "Медиа файлы",
      "settings": "Настройки"
    }

    return titleMap[lastSegment] || "Админ панель"
  }

  const breadcrumbs = pathname.split("/").filter(Boolean).map((segment, index, array) => {
    const href = "/" + array.slice(0, index + 1).join("/")
    const titleMap: Record<string, string> = {
      "admin": "Админ",
      "content": "Контент",
      "hero": "Главная",
      "steps": "Этапы",
      "pricing": "Тарифы",
      "services": "Услуги",
      "works": "Портфолио",
      "reviews": "Отзывы",
      "team": "Команда",
      "equipment": "Оборудование",
      "promotions": "Акции",
      "warehouse": "Склад",
      "contacts": "Контакты",
      "media": "Медиа",
      "settings": "Настройки"
    }
    
    return {
      title: titleMap[segment] || segment,
      href,
      isLast: index === array.length - 1
    }
  })

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <div>
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  <span className={cn(
                    crumb.isLast ? "text-gray-900 font-medium" : "hover:text-coffee-600"
                  )}>
                    {crumb.title}
                  </span>
                </div>
              ))}
            </nav>

            {/* Page title */}
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
            {subtitle && (
              <p className="text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
            />
          </div>

          {/* Quick actions */}
          <div className="flex items-center space-x-2">
            {/* View site */}
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hidden sm:flex border-gray-300 hover:border-coffee-500 hover:text-coffee-600"
            >
              <a href="/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Посмотреть сайт
              </a>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <Badge className="absolute -top-1 -right-1 w-2 h-2 p-0 bg-red-500 border-0" />
            </Button>

            {/* User menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? 'Администратор' : 'Редактор'}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-coffee-500 to-coffee-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full border-gray-300 focus:border-coffee-500 focus:ring-coffee-500"
          />
        </div>
      </div>
    </header>
  )
} 