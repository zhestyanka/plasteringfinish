"use client"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AuthService } from "@/lib/admin/auth"
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader"
import { cn } from "@/lib/utils"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Проверяем авторизацию при загрузке
    const checkAuth = () => {
      if (pathname === "/admin/login") {
        setLoading(false)
        return
      }

      if (!AuthService.isAuthenticated()) {
        router.replace("/admin/login")
        return
      }

      // Продлеваем сессию при активности
      AuthService.extendSession()
      setLoading(false)
    }

    checkAuth()
  }, [pathname, router])

  // Показываем загрузку во время проверки авторизации
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600 mx-auto mb-4"></div>
          <p className="text-coffee-700">Загрузка...</p>
        </div>
      </div>
    )
  }

  // Для страницы логина возвращаем только children
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Основной лейаут админки
  return (
    <div className="h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <AdminSidebar 
        isMobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          showMobileMenu={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 