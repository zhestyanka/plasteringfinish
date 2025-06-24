"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  MessageSquare, 
  FolderOpen, 
  Hammer,
  TrendingUp,
  Clock,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Activity,
  Calendar,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/lib/admin/auth"

export default function AdminDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalServices: 4,
    totalProjects: 3,
    totalReviews: 6,
    totalTeamMembers: 4,
    totalViews: 1247,
    conversionRate: 3.2
  })

  const recentActivity = [
    {
      id: "1",
      type: "create",
      entity: "Отзыв",
      description: "Добавлен новый отзыв от Марии Власовой",
      timestamp: "2 минуты назад",
      user: "Система"
    },
    {
      id: "2", 
      type: "update",
      entity: "Услуга",
      description: "Обновлена цена на финишную отделку",
      timestamp: "1 час назад",
      user: "admin"
    },
    {
      id: "3",
      type: "create",
      entity: "Проект",
      description: "Добавлен новый проект - офис в БЦ Невский",
      timestamp: "3 часа назад",
      user: "admin"
    }
  ]

  const quickActions = [
    {
      title: "Добавить услугу",
      description: "Создать новую услугу",
      href: "/admin/services",
      icon: Plus,
      color: "bg-blue-500"
    },
    {
      title: "Добавить проект",
      description: "Добавить в портфолио",
      href: "/admin/works",
      icon: FolderOpen,
      color: "bg-green-500"
    },
    {
      title: "Управление отзывами",
      description: "Модерировать отзывы",
      href: "/admin/reviews",
      icon: MessageSquare,
      color: "bg-purple-500"
    },
    {
      title: "Команда",
      description: "Управление сотрудниками",
      href: "/admin/team",
      icon: Users,
      color: "bg-orange-500"
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <Plus className="w-4 h-4 text-green-600" />
      case "update":
        return <Edit className="w-4 h-4 text-blue-600" />
      case "delete":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-coffee-600 to-coffee-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Добро пожаловать, {user?.username}!
            </h1>
            <p className="text-coffee-100 mb-4">
              Управляйте содержимым вашего сайта механизированной штукатурки
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date().toLocaleDateString('ru-RU', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <Button variant="secondary" asChild>
              <Link href="/" target="_blank">
                <Eye className="w-4 h-4 mr-2" />
                Посмотреть сайт
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Услуги
            </CardTitle>
            <Hammer className="w-4 h-4 text-coffee-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalServices}</div>
            <p className="text-xs text-gray-500 mt-1">
              Активных услуг
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Проекты
            </CardTitle>
            <FolderOpen className="w-4 h-4 text-coffee-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
            <p className="text-xs text-gray-500 mt-1">
              В портфолио
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Отзывы
            </CardTitle>
            <MessageSquare className="w-4 h-4 text-coffee-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalReviews}</div>
            <p className="text-xs text-gray-500 mt-1">
              Опубликованных отзывов
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Команда
            </CardTitle>
            <Users className="w-4 h-4 text-coffee-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.totalTeamMembers}</div>
            <p className="text-xs text-gray-500 mt-1">
              Сотрудников
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-coffee-600" />
              <span>Быстрые действия</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-coffee-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                        <action.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-500">{action.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-coffee-600" />
              <span>Последние изменения</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {activity.entity}
                      </Badge>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-900 mt-1">{activity.description}</p>
                    <p className="text-xs text-gray-500">от {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-coffee-600" />
            <span>Обзор производительности</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">{stats.totalViews.toLocaleString()}</div>
              <p className="text-sm text-gray-600 mt-1">Просмотров сайта</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12% за месяц</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">{stats.conversionRate}%</div>
              <p className="text-sm text-gray-600 mt-1">Конверсия заявок</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+0.8% за месяц</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-coffee-600">24</div>
              <p className="text-sm text-gray-600 mt-1">Новых заявок</p>
              <div className="flex items-center justify-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+5 за неделю</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}