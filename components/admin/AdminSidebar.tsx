"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Users,
  Star,
  Briefcase,
  Camera,
  DollarSign,
  Settings,
  ChevronDown,
  Home,
  Phone,
  Wrench,
  X,
  Video,
  Contact,
  Calculator,
  Building2,
  MessageSquare,
  Award
} from "lucide-react"

const menuItems = [
  { title: "Главная", href: "/admin", icon: LayoutDashboard },
  { title: "Хедер", href: "/admin/header", icon: FileText },
  { title: "Главная страница", href: "/admin/content", icon: Home },
  { title: "Калькулятор", href: "/admin/calculator", icon: Calculator },
  { title: "Услуги", href: "/admin/services", icon: Briefcase },
  { title: "Портфолио", href: "/admin/works", icon: Camera },
  { title: "Тарифы", href: "/admin/pricing", icon: DollarSign },
  { title: "Видео", href: "/admin/video", icon: Video },
  { title: "Отзывы", href: "/admin/reviews", icon: Star },
  { title: "Команда", href: "/admin/team", icon: Users },
  { title: "Оборудование", href: "/admin/equipment", icon: Wrench },
  { title: "Контакты", href: "/admin/contacts", icon: Contact },
  { title: "Футер", href: "/admin/footer", icon: FileText },
  { title: "Учетная Запись", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  className?: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function AdminSidebar({ className, isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleLinkClick = () => {
    if (onMobileClose) {
      onMobileClose()
    }
  }

  const SidebarContent = ({ showCloseButton = false }) => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-coffee-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-coffee-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-coffee-900">Админ панель</h2>
              <p className="text-sm text-coffee-600">Управление сайтом</p>
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={onMobileClose}
              className="p-1 rounded-lg hover:bg-coffee-100 lg:hidden"
            >
              <X className="w-5 h-5 text-coffee-600" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-coffee-600 text-white"
                  : "text-coffee-700 hover:bg-coffee-100 hover:text-coffee-900"
              )}
              onClick={handleLinkClick}
            >
              <Icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden lg:flex lg:flex-col lg:w-64 bg-white border-r border-coffee-200",
        className
      )}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 w-64 h-full bg-white border-r border-coffee-200 transform transition-transform lg:hidden",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent showCloseButton={true} />
      </aside>
    </>
  )
}