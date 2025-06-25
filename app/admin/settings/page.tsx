"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, User, Lock, Save } from "lucide-react"
import { toast } from "sonner"
import { AuthService } from "@/lib/admin/auth"

export default function SettingsPage() {
  // Состояние для смены пароля
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Состояние для смены логина
  const [currentPasswordForLogin, setCurrentPasswordForLogin] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [currentUsername, setCurrentUsername] = useState("")
  const [showPasswordForLogin, setShowPasswordForLogin] = useState(false)
  const [isChangingUsername, setIsChangingUsername] = useState(false)

  useEffect(() => {
    // Загружаем текущий логин
    setCurrentUsername(AuthService.getStoredUsername())
  }, [])

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Заполните все поля")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Новые пароли не совпадают")
      return
    }

    if (newPassword.length < 6) {
      toast.error("Новый пароль должен содержать минимум 6 символов")
      return
    }

    setIsChangingPassword(true)

    try {
      const success = AuthService.changePassword(currentPassword, newPassword)
      
      if (success) {
        toast.success("Пароль успешно изменён")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        toast.error("Неверный текущий пароль")
      }
    } catch (error) {
      toast.error("Ошибка при смене пароля")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleUsernameChange = async () => {
    if (!currentPasswordForLogin || !newUsername) {
      toast.error("Заполните все поля")
      return
    }

    if (newUsername.length < 3) {
      toast.error("Логин должен содержать минимум 3 символа")
      return
    }

    if (newUsername === currentUsername) {
      toast.error("Новый логин совпадает с текущим")
      return
    }

    setIsChangingUsername(true)

    try {
      const success = AuthService.changeUsername(currentPasswordForLogin, newUsername)
      
      if (success) {
        toast.success("Логин успешно изменён")
        setCurrentUsername(newUsername)
        setCurrentPasswordForLogin("")
        setNewUsername("")
      } else {
        toast.error("Неверный пароль")
      }
    } catch (error) {
      toast.error("Ошибка при смене логина")
    } finally {
      setIsChangingUsername(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Настройки учётной записи</h1>
        <p className="text-gray-600 mt-2">Управление логином и паролем администратора</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Смена логина */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Изменить логин</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-username">Текущий логин</Label>
              <Input
                id="current-username"
                value={currentUsername}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="new-username">Новый логин</Label>
              <Input
                id="new-username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Введите новый логин"
                minLength={3}
              />
            </div>

            <div>
              <Label htmlFor="password-for-login">Подтвердите паролем</Label>
              <div className="relative">
                <Input
                  id="password-for-login"
                  type={showPasswordForLogin ? "text" : "password"}
                  value={currentPasswordForLogin}
                  onChange={(e) => setCurrentPasswordForLogin(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPasswordForLogin(!showPasswordForLogin)}
                >
                  {showPasswordForLogin ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handleUsernameChange}
              disabled={isChangingUsername || !newUsername || !currentPasswordForLogin}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isChangingUsername ? "Изменение..." : "Изменить логин"}
            </Button>
          </CardContent>
        </Card>

        {/* Смена пароля */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Изменить пароль</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="current-password">Текущий пароль</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Введите текущий пароль"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="new-password">Новый пароль</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Введите новый пароль"
                  minLength={6}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              onClick={handlePasswordChange}
              disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {isChangingPassword ? "Изменение..." : "Изменить пароль"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 