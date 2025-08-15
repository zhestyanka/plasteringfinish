"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Menu,
  X,
  ExternalLink,
  Bell,
  User
} from "lucide-react"

interface User {
  username: string
  role: 'admin' | 'editor'
}

interface AdminHeaderProps {
  title?: string
  subtitle?: string
  showMobileMenu?: boolean
  onMenuToggle?: () => void
}

export default function AdminHeader({ 
  title, 
  subtitle, 
  showMobileMenu = false, 
  onMenuToggle 
}: AdminHeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Загружаем данные пользователя
    const loadUser = async () => {
      try {
        const response = await fetch('/api/admin/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error)
      }
    }

    loadUser()
  }, [])

  const getPageTitle = () => {
    if (title) return title

    const pathMap: Record<string, string> = {
      '/admin': 'Главная',
      '/admin/content': 'Главная страница',
      '/admin/contacts': 'Контакты',
      '/admin/footer': 'Футер',
      '/admin/pricing': 'Тарифы',
      '/admin/works': 'Портфолио',
      '/admin/video': 'Видео',
      '/admin/reviews': 'Отзывы',
      '/admin/team': 'Команда',
      '/admin/equipment': 'Оборудование',
      '/admin/services': 'Услуги',
      '/admin/settings': 'Настройки',
    }

    return pathMap[pathname] || 'Админ панель'
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { title: 'Админ панель', href: '/admin', isLast: pathname === '/admin' }
    ]

    if (pathname !== '/admin') {
      const pageTitle = getPageTitle()
      breadcrumbs.push({ title: pageTitle, href: pathname, isLast: true })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

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
    </header>
  )
} 