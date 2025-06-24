"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'
import { Save, Lock, Eye, EyeOff } from "lucide-react"
import { AuthService } from '@/lib/admin/auth'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.currentPassword) {
      toast.error('Введите текущий пароль')
      return
    }

    if (!formData.newPassword) {
      toast.error('Введите новый пароль')
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error('Новый пароль должен содержать минимум 6 символов')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Пароли не совпадают')
      return
    }

    setIsLoading(true)
    
    try {
      // Проверяем текущий пароль
      const isCurrentPasswordValid = AuthService.validatePassword(formData.currentPassword)
      
      if (!isCurrentPasswordValid) {
        toast.error('Неверный текущий пароль')
        return
      }

      // Сохраняем новый пароль
      const success = AuthService.changePassword(formData.currentPassword, formData.newPassword)
      
      if (success) {
        toast.success('Пароль успешно изменен')
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        toast.error('Ошибка при смене пароля')
      }
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      toast.error('Произошла ошибка при смене пароля')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Смена пароля</h1>
          <p className="text-gray-600 mt-2">Измените пароль для входа в админ панель</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-coffee-600" />
            <span>Безопасность</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  placeholder="Введите текущий пароль"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {showPasswords.current ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Введите новый пароль (минимум 6 символов)"
                  required
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {showPasswords.new ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Повторите новый пароль"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Требования к паролю:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Минимум 6 символов</li>
                <li>• Рекомендуется использовать буквы, цифры и символы</li>
                <li>• Избегайте простых паролей типа "123456" или "password"</li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-coffee-600 hover:bg-coffee-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Изменение...' : 'Изменить пароль'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Информация о текущем пользователе</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Имя пользователя</Label>
              <p className="text-gray-900">admin</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Последний вход</Label>
              <p className="text-gray-900">{new Date().toLocaleString('ru-RU')}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Роль</Label>
              <p className="text-gray-900">Администратор</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 