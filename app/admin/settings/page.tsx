"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock, Save, Bot, MessageSquare, TestTube } from "lucide-react"
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

  // Состояние для настроек Telegram
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
    botUsername: ""
  })
  const [isLoadingTelegram, setIsLoadingTelegram] = useState(false)
  const [isSavingTelegram, setIsSavingTelegram] = useState(false)
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)

  useEffect(() => {
    // Загружаем текущий логин
    setCurrentUsername(AuthService.getStoredUsername())
    
    // Загружаем настройки Telegram
    loadTelegramSettings()
  }, [])

  const loadTelegramSettings = async () => {
    setIsLoadingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram')
      if (response.ok) {
        const data = await response.json()
        setTelegramSettings(data.settings)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек Telegram:', error)
      toast.error('Ошибка загрузки настроек Telegram')
    } finally {
      setIsLoadingTelegram(false)
    }
  }

  const saveTelegramSettings = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId || !telegramSettings.botUsername) {
      toast.error('Заполните все поля')
      return
    }

    setIsSavingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramSettings)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Настройки Telegram успешно сохранены')
      } else {
        toast.error(result.error || 'Ошибка сохранения настроек')
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек Telegram:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSavingTelegram(false)
    }
  }

  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error('Заполните токен бота и Chat ID для тестирования')
      return
    }

    setIsTestingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Тестовое сообщение отправлено! Проверьте Telegram.')
      } else {
        toast.error(result.error || 'Ошибка отправки тестового сообщения')
      }
    } catch (error) {
      console.error('Ошибка тестирования Telegram:', error)
      toast.error('Ошибка тестирования подключения')
    } finally {
      setIsTestingTelegram(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Управление настройками системы</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Учётная запись
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Telegram бот
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки учётной записи</h2>
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
        </TabsContent>

        <TabsContent value="telegram" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки Telegram бота</h2>
            <p className="text-gray-600 mt-2">Управление настройками для отправки заявок в Telegram</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Настройки бота</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bot-token">Токен бота</Label>
                <Input
                  id="bot-token"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <div>
                <Label htmlFor="chat-id">Chat ID</Label>
                <Input
                  id="chat-id"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                  placeholder="123456789"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  ID чата или канала для получения заявок
                </p>
              </div>

              <div>
                <Label htmlFor="bot-username">Username бота</Label>
                <Input
                  id="bot-username"
                  value={telegramSettings.botUsername}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                  placeholder="my_bot"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username бота без символа @
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={saveTelegramSettings}
                  disabled={isSavingTelegram || isLoadingTelegram}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingTelegram ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button 
                  onClick={testTelegramConnection}
                  disabled={isTestingTelegram || isLoadingTelegram || !telegramSettings.botToken || !telegramSettings.chatId}
                  variant="outline"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTestingTelegram ? "Тестирование..." : "Тест подключения"}
                </Button>
              </div>

              {isLoadingTelegram && (
                <div className="text-center text-gray-500">
                  Загрузка настроек...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Как получить токен бота:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Напишите @BotFather в Telegram</li>
                  <li>Отправьте команду /newbot</li>
                  <li>Следуйте инструкциям для создания бота</li>
                  <li>Скопируйте полученный токен</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="text-sm text-gray-600">
                <p><strong>Как получить Chat ID:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Добавьте бота в нужный чат/канал</li>
                  <li>Отправьте любое сообщение в чат</li>
                  <li>Перейдите по ссылке: https://api.telegram.org/bot[TOKEN]/getUpdates</li>
                  <li>Найдите "chat":{'{'}"id": число{'}'} в ответе</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock, Save, Bot, MessageSquare, TestTube } from "lucide-react"
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

  // Состояние для настроек Telegram
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
    botUsername: ""
  })
  const [isLoadingTelegram, setIsLoadingTelegram] = useState(false)
  const [isSavingTelegram, setIsSavingTelegram] = useState(false)
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)

  useEffect(() => {
    // Загружаем текущий логин
    setCurrentUsername(AuthService.getStoredUsername())
    
    // Загружаем настройки Telegram
    loadTelegramSettings()
  }, [])

  const loadTelegramSettings = async () => {
    setIsLoadingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram')
      if (response.ok) {
        const data = await response.json()
        setTelegramSettings(data.settings)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек Telegram:', error)
      toast.error('Ошибка загрузки настроек Telegram')
    } finally {
      setIsLoadingTelegram(false)
    }
  }

  const saveTelegramSettings = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId || !telegramSettings.botUsername) {
      toast.error('Заполните все поля')
      return
    }

    setIsSavingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramSettings)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Настройки Telegram успешно сохранены')
      } else {
        toast.error(result.error || 'Ошибка сохранения настроек')
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек Telegram:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSavingTelegram(false)
    }
  }

  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error('Заполните токен бота и Chat ID для тестирования')
      return
    }

    setIsTestingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Тестовое сообщение отправлено! Проверьте Telegram.')
      } else {
        toast.error(result.error || 'Ошибка отправки тестового сообщения')
      }
    } catch (error) {
      console.error('Ошибка тестирования Telegram:', error)
      toast.error('Ошибка тестирования подключения')
    } finally {
      setIsTestingTelegram(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Управление настройками системы</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Учётная запись
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Telegram бот
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки учётной записи</h2>
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
        </TabsContent>

        <TabsContent value="telegram" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки Telegram бота</h2>
            <p className="text-gray-600 mt-2">Управление настройками для отправки заявок в Telegram</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Настройки бота</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bot-token">Токен бота</Label>
                <Input
                  id="bot-token"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <div>
                <Label htmlFor="chat-id">Chat ID</Label>
                <Input
                  id="chat-id"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                  placeholder="123456789"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  ID чата или канала для получения заявок
                </p>
              </div>

              <div>
                <Label htmlFor="bot-username">Username бота</Label>
                <Input
                  id="bot-username"
                  value={telegramSettings.botUsername}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                  placeholder="my_bot"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username бота без символа @
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={saveTelegramSettings}
                  disabled={isSavingTelegram || isLoadingTelegram}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingTelegram ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button 
                  onClick={testTelegramConnection}
                  disabled={isTestingTelegram || isLoadingTelegram || !telegramSettings.botToken || !telegramSettings.chatId}
                  variant="outline"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTestingTelegram ? "Тестирование..." : "Тест подключения"}
                </Button>
              </div>

              {isLoadingTelegram && (
                <div className="text-center text-gray-500">
                  Загрузка настроек...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Как получить токен бота:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Напишите @BotFather в Telegram</li>
                  <li>Отправьте команду /newbot</li>
                  <li>Следуйте инструкциям для создания бота</li>
                  <li>Скопируйте полученный токен</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="text-sm text-gray-600">
                <p><strong>Как получить Chat ID:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Добавьте бота в нужный чат/канал</li>
                  <li>Отправьте любое сообщение в чат</li>
                  <li>Перейдите по ссылке: https://api.telegram.org/bot[TOKEN]/getUpdates</li>
                  <li>Найдите "chat":{'{'}"id": число{'}'} в ответе</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock, Save, Bot, MessageSquare, TestTube } from "lucide-react"
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

  // Состояние для настроек Telegram
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
    botUsername: ""
  })
  const [isLoadingTelegram, setIsLoadingTelegram] = useState(false)
  const [isSavingTelegram, setIsSavingTelegram] = useState(false)
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)

  useEffect(() => {
    // Загружаем текущий логин
    setCurrentUsername(AuthService.getStoredUsername())
    
    // Загружаем настройки Telegram
    loadTelegramSettings()
  }, [])

  const loadTelegramSettings = async () => {
    setIsLoadingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram')
      if (response.ok) {
        const data = await response.json()
        setTelegramSettings(data.settings)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек Telegram:', error)
      toast.error('Ошибка загрузки настроек Telegram')
    } finally {
      setIsLoadingTelegram(false)
    }
  }

  const saveTelegramSettings = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId || !telegramSettings.botUsername) {
      toast.error('Заполните все поля')
      return
    }

    setIsSavingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramSettings)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Настройки Telegram успешно сохранены')
      } else {
        toast.error(result.error || 'Ошибка сохранения настроек')
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек Telegram:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSavingTelegram(false)
    }
  }

  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error('Заполните токен бота и Chat ID для тестирования')
      return
    }

    setIsTestingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Тестовое сообщение отправлено! Проверьте Telegram.')
      } else {
        toast.error(result.error || 'Ошибка отправки тестового сообщения')
      }
    } catch (error) {
      console.error('Ошибка тестирования Telegram:', error)
      toast.error('Ошибка тестирования подключения')
    } finally {
      setIsTestingTelegram(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Управление настройками системы</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Учётная запись
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Telegram бот
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки учётной записи</h2>
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
        </TabsContent>

        <TabsContent value="telegram" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки Telegram бота</h2>
            <p className="text-gray-600 mt-2">Управление настройками для отправки заявок в Telegram</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Настройки бота</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bot-token">Токен бота</Label>
                <Input
                  id="bot-token"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <div>
                <Label htmlFor="chat-id">Chat ID</Label>
                <Input
                  id="chat-id"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                  placeholder="123456789"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  ID чата или канала для получения заявок
                </p>
              </div>

              <div>
                <Label htmlFor="bot-username">Username бота</Label>
                <Input
                  id="bot-username"
                  value={telegramSettings.botUsername}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                  placeholder="my_bot"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username бота без символа @
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={saveTelegramSettings}
                  disabled={isSavingTelegram || isLoadingTelegram}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingTelegram ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button 
                  onClick={testTelegramConnection}
                  disabled={isTestingTelegram || isLoadingTelegram || !telegramSettings.botToken || !telegramSettings.chatId}
                  variant="outline"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTestingTelegram ? "Тестирование..." : "Тест подключения"}
                </Button>
              </div>

              {isLoadingTelegram && (
                <div className="text-center text-gray-500">
                  Загрузка настроек...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Как получить токен бота:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Напишите @BotFather в Telegram</li>
                  <li>Отправьте команду /newbot</li>
                  <li>Следуйте инструкциям для создания бота</li>
                  <li>Скопируйте полученный токен</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="text-sm text-gray-600">
                <p><strong>Как получить Chat ID:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Добавьте бота в нужный чат/канал</li>
                  <li>Отправьте любое сообщение в чат</li>
                  <li>Перейдите по ссылке: https://api.telegram.org/bot[TOKEN]/getUpdates</li>
                  <li>Найдите "chat":{'{'}"id": число{'}'} в ответе</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, User, Lock, Save, Bot, MessageSquare, TestTube } from "lucide-react"
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

  // Состояние для настроек Telegram
  const [telegramSettings, setTelegramSettings] = useState({
    botToken: "",
    chatId: "",
    botUsername: ""
  })
  const [isLoadingTelegram, setIsLoadingTelegram] = useState(false)
  const [isSavingTelegram, setIsSavingTelegram] = useState(false)
  const [isTestingTelegram, setIsTestingTelegram] = useState(false)

  useEffect(() => {
    // Загружаем текущий логин
    setCurrentUsername(AuthService.getStoredUsername())
    
    // Загружаем настройки Telegram
    loadTelegramSettings()
  }, [])

  const loadTelegramSettings = async () => {
    setIsLoadingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram')
      if (response.ok) {
        const data = await response.json()
        setTelegramSettings(data.settings)
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек Telegram:', error)
      toast.error('Ошибка загрузки настроек Telegram')
    } finally {
      setIsLoadingTelegram(false)
    }
  }

  const saveTelegramSettings = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId || !telegramSettings.botUsername) {
      toast.error('Заполните все поля')
      return
    }

    setIsSavingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(telegramSettings)
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Настройки Telegram успешно сохранены')
      } else {
        toast.error(result.error || 'Ошибка сохранения настроек')
      }
    } catch (error) {
      console.error('Ошибка сохранения настроек Telegram:', error)
      toast.error('Ошибка сохранения настроек')
    } finally {
      setIsSavingTelegram(false)
    }
  }

  const testTelegramConnection = async () => {
    if (!telegramSettings.botToken || !telegramSettings.chatId) {
      toast.error('Заполните токен бота и Chat ID для тестирования')
      return
    }

    setIsTestingTelegram(true)
    try {
      const response = await fetch('/api/settings/telegram/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botToken: telegramSettings.botToken,
          chatId: telegramSettings.chatId
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        toast.success('Тестовое сообщение отправлено! Проверьте Telegram.')
      } else {
        toast.error(result.error || 'Ошибка отправки тестового сообщения')
      }
    } catch (error) {
      console.error('Ошибка тестирования Telegram:', error)
      toast.error('Ошибка тестирования подключения')
    } finally {
      setIsTestingTelegram(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
        <p className="text-gray-600 mt-2">Управление настройками системы</p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Учётная запись
          </TabsTrigger>
          <TabsTrigger value="telegram" className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Telegram бот
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки учётной записи</h2>
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
        </TabsContent>

        <TabsContent value="telegram" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Настройки Telegram бота</h2>
            <p className="text-gray-600 mt-2">Управление настройками для отправки заявок в Telegram</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>Настройки бота</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bot-token">Токен бота</Label>
                <Input
                  id="bot-token"
                  value={telegramSettings.botToken}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botToken: e.target.value })}
                  placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Получите токен у @BotFather в Telegram
                </p>
              </div>

              <div>
                <Label htmlFor="chat-id">Chat ID</Label>
                <Input
                  id="chat-id"
                  value={telegramSettings.chatId}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, chatId: e.target.value })}
                  placeholder="123456789"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  ID чата или канала для получения заявок
                </p>
              </div>

              <div>
                <Label htmlFor="bot-username">Username бота</Label>
                <Input
                  id="bot-username"
                  value={telegramSettings.botUsername}
                  onChange={(e) => setTelegramSettings({ ...telegramSettings, botUsername: e.target.value })}
                  placeholder="my_bot"
                  disabled={isLoadingTelegram}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Username бота без символа @
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={saveTelegramSettings}
                  disabled={isSavingTelegram || isLoadingTelegram}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSavingTelegram ? "Сохранение..." : "Сохранить настройки"}
                </Button>

                <Button 
                  onClick={testTelegramConnection}
                  disabled={isTestingTelegram || isLoadingTelegram || !telegramSettings.botToken || !telegramSettings.chatId}
                  variant="outline"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  {isTestingTelegram ? "Тестирование..." : "Тест подключения"}
                </Button>
              </div>

              {isLoadingTelegram && (
                <div className="text-center text-gray-500">
                  Загрузка настроек...
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Информация</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600">
                <p><strong>Как получить токен бота:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Напишите @BotFather в Telegram</li>
                  <li>Отправьте команду /newbot</li>
                  <li>Следуйте инструкциям для создания бота</li>
                  <li>Скопируйте полученный токен</li>
                </ol>
              </div>
              
              <Separator />
              
              <div className="text-sm text-gray-600">
                <p><strong>Как получить Chat ID:</strong></p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Добавьте бота в нужный чат/канал</li>
                  <li>Отправьте любое сообщение в чат</li>
                  <li>Перейдите по ссылке: https://api.telegram.org/bot[TOKEN]/getUpdates</li>
                  <li>Найдите "chat":{'{'}"id": число{'}'} в ответе</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
