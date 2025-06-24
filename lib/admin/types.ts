// Основные типы для админ панели
export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'editor'
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

// Типы контента
export interface HeroContent {
  title: string
  subtitle: string
  description: string
  stats: StatItem[]
  calculator: Calculator
}

export interface StatItem {
  icon: string
  label: string
  value: string
}

export interface Calculator {
  mixTypes: MixType[]
}

export interface MixType {
  id: string
  name: string
  consumption: number
}

export interface Contact {
  phones: string[]
  email: string
  address: string
  workingHours: string
}

export interface Company {
  name: string
  subtitle: string
  rating: number
  reviewsCount: number
  clientsCount: number
  experienceYears: number
  warrantyYears: number
}

export interface Service {
  id: string
  icon: string
  title: string
  description: string
  price: string
  features: string[]
  image: string
  popular: boolean
  active: boolean
}

export interface Benefit {
  id: string
  icon: string
  title: string
  description: string
  image: string
  order: number
  active: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  experience: string
  certificate: string
  image: string
  active: boolean
}

export interface TextReview {
  id: string
  name: string
  role: string
  title: string
  text: string
  rating: number
  active: boolean
  featured: boolean
}

export interface VideoReview {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  active: boolean
}

export interface Project {
  id: string
  title: string
  description: string
  category: string
  location: string
  area: string
  completionDate: string
  mainImage: string
  images: string[]
  active: boolean
  featured: boolean
}

export interface Equipment {
  id: string
  icon: string
  count?: string
  title: string
  subtitle?: string
  description: string
  active: boolean
}

export interface Step {
  id: string
  icon: string
  number: string
  title: string
  description: string
  link?: string
  active: boolean
}

export interface Pricing {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular: boolean
  color: string
  active: boolean
}

export interface Promotion {
  id: string
  title: string
  description: string
  price: string
  conditions: string[]
  active: boolean
}

export interface WarehouseBenefit {
  id: string
  icon: string
  title: string
  description: string
  active: boolean
}

// API Response типы
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Form типы
export interface FormField {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'url' | 'email' | 'tel' | 'image' | 'array'
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

export interface MediaFile {
  id: string
  filename: string
  originalName: string
  path: string
  url: string
  size: number
  mimeType: string
  createdAt: string
}

// Admin Dashboard типы
export interface DashboardStats {
  totalServices: number
  totalProjects: number
  totalReviews: number
  totalTeamMembers: number
  recentActivity: ActivityItem[]
}

export interface ActivityItem {
  id: string
  type: 'create' | 'update' | 'delete'
  entity: string
  description: string
  timestamp: string
  user: string
}

// Navigation
export interface NavItem {
  title: string
  href: string
  icon: string
  children?: NavItem[]
} 