"use client"

import { User, AuthSession } from './types'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123', // В реальном проекте должен быть хешированный пароль
  email: 'admin@plasteringfinish.ru',
  role: 'admin' as const
}

const SESSION_KEY = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 часа

export class AuthService {
  static login(username: string, password: string): Promise<AuthSession | null> {
    return new Promise((resolve) => {
      // Имитация асинхронного запроса
      setTimeout(() => {
        const currentPassword = this.getStoredPassword()
        const currentUsername = this.getStoredUsername()
        
        if (username === currentUsername && password === currentPassword) {
          const user: User = {
            id: '1',
            username: currentUsername,
            email: ADMIN_CREDENTIALS.email,
            role: ADMIN_CREDENTIALS.role
          }

          const session: AuthSession = {
            user,
            token: this.generateToken(),
            expiresAt: Date.now() + SESSION_DURATION
          }

          // Сохраняем сессию в localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(SESSION_KEY, JSON.stringify(session))
          }

          resolve(session)
        } else {
          resolve(null)
        }
      }, 500)
    })
  }

  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  static getCurrentSession(): AuthSession | null {
    if (typeof window === 'undefined') return null

    try {
      const sessionData = localStorage.getItem(SESSION_KEY)
      if (!sessionData) return null

      const session: AuthSession = JSON.parse(sessionData)
      
      // Проверяем, не истекла ли сессия
      if (Date.now() > session.expiresAt) {
        this.logout()
        return null
      }

      return session
    } catch (error) {
      console.error('Ошибка при получении сессии:', error)
      this.logout()
      return null
    }
  }

  static isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  static getCurrentUser(): User | null {
    const session = this.getCurrentSession()
    return session?.user || null
  }

  static extendSession(): void {
    const session = this.getCurrentSession()
    if (session) {
      session.expiresAt = Date.now() + SESSION_DURATION
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_KEY, JSON.stringify(session))
      }
    }
  }

  private static generateToken(): string {
    return btoa(Date.now().toString() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '')
  }

  static async validateToken(token: string): Promise<boolean> {
    const session = this.getCurrentSession()
    return session?.token === token && Date.now() < session.expiresAt
  }

  static validatePassword(password: string): boolean {
    const currentPassword = this.getStoredPassword()
    return password === currentPassword
  }

  static changePassword(currentPassword: string, newPassword: string): boolean {
    try {
      // Проверяем текущий пароль
      const storedPassword = this.getStoredPassword()
      if (currentPassword !== storedPassword) {
        return false
      }

      // В реальном приложении здесь был бы запрос к серверу для смены пароля
      // Для демо просто обновляем локальную переменную
      // ВАЖНО: В продакшене пароли должны храниться в зашифрованном виде на сервере!
      
      // Временно сохраняем новый пароль в localStorage для демо
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_password', newPassword)
      }

      return true
    } catch (error) {
      console.error('Ошибка смены пароля:', error)
      return false
    }
  }

  static changeUsername(currentPassword: string, newUsername: string): boolean {
    try {
      // Проверяем текущий пароль для безопасности
      const storedPassword = this.getStoredPassword()
      if (currentPassword !== storedPassword) {
        return false
      }

      // Проверяем что новый логин не пустой
      if (!newUsername || newUsername.trim().length < 3) {
        return false
      }

      // Сохраняем новый логин
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin_username', newUsername.trim())
        
        // Обновляем текущую сессию
        const session = this.getCurrentSession()
        if (session) {
          session.user.username = newUsername.trim()
          localStorage.setItem(SESSION_KEY, JSON.stringify(session))
        }
      }

      return true
    } catch (error) {
      console.error('Ошибка смены логина:', error)
      return false
    }
  }

  static getStoredUsername(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_username') || ADMIN_CREDENTIALS.username
    }
    return ADMIN_CREDENTIALS.username
  }

  private static getStoredPassword(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_password') || ADMIN_CREDENTIALS.password
    }
    return ADMIN_CREDENTIALS.password
  }
}

// Хук для использования в компонентах
export function useAuth() {
  const session = AuthService.getCurrentSession()
  
  return {
    user: session?.user || null,
    isAuthenticated: !!session,
    login: AuthService.login,
    logout: AuthService.logout,
    extendSession: AuthService.extendSession
  }
}

// Middleware для защищенных маршрутов
export function requireAuth(): boolean {
  const isAuth = AuthService.isAuthenticated()
  
  if (!isAuth && typeof window !== 'undefined') {
    // Перенаправляем на страницу входа
    window.location.href = '/admin/login'
    return false
  }
  
  return isAuth
}

// HOC для защищенных компонентов
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuth()
    
    if (!isAuthenticated) {
      return null
    }
    
    return null
  }
} 