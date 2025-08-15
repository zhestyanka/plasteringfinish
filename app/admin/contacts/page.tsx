"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from 'sonner'
import { Save, Phone, Mail, MapPin, Clock } from "lucide-react"

interface ContactsData {
  contacts: {
    phone: string
    email: string
    address: string
    workingHours: string
    socialMedia: {
      telegram: string
      whatsapp: string
      vk: string
    }
    description: string
  }
}

export default function ContactsPage() {
  const [contactsData, setContactsData] = useState<ContactsData['contacts']>({
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    socialMedia: {
      telegram: '',
      whatsapp: '',
      vk: ''
    },
    description: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const response = await fetch('/api/data/content')
      if (response.ok) {
        const data = await response.json()
        if (data.contacts) {
          // Обеспечиваем, что все поля имеют значения по умолчанию
          setContactsData({
            phone: data.contacts.phone || '',
            email: data.contacts.email || '',
            address: data.contacts.address || '',
            workingHours: data.contacts.workingHours || '',
            socialMedia: {
              telegram: data.contacts.socialMedia?.telegram || '',
              whatsapp: data.contacts.socialMedia?.whatsapp || '',
              vk: data.contacts.socialMedia?.vk || ''
            },
            description: data.contacts.description || ''
          })
        }
      } else {
        throw new Error('Failed to load contacts')
      }
    } catch (error) {
      console.error('Ошибка загрузки контактов:', error)
      toast.error('Ошибка загрузки данных')
    } finally {
      setIsLoading(false)
    }
  }

  const saveContacts = async () => {
    setIsSaving(true)
    try {
      // Сначала загружаем текущие данные
      const currentResponse = await fetch('/api/data/content')
      const currentData = await currentResponse.json()
      
      // Обновляем только контакты
      const updatedData = {
        ...currentData,
        contacts: contactsData
      }

      const response = await fetch('/api/data/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      })

      if (response.ok) {
        toast.success('Контакты успешно сохранены')
      } else {
        throw new Error('Failed to save contacts')
      }
    } catch (error) {
      console.error('Ошибка сохранения контактов:', error)
      toast.error('Ошибка сохранения')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    saveContacts()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Контакты</h1>
          <p className="text-gray-600 mt-2">Управление контактной информацией</p>
        </div>
        <Button onClick={saveContacts} disabled={isSaving} className="bg-coffee-600 hover:bg-coffee-700">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Phone className="w-5 h-5 text-coffee-600" />
            <span>Основная информация</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Телефон</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={contactsData.phone}
                  onChange={(e) => setContactsData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={contactsData.email}
                  onChange={(e) => setContactsData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>Адрес</span>
                </Label>
                <Input
                  id="address"
                  value={contactsData.address}
                  onChange={(e) => setContactsData(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours" className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Время работы</span>
                </Label>
                <Input
                  id="workingHours"
                  value={contactsData.workingHours}
                  onChange={(e) => setContactsData(prev => ({ ...prev, workingHours: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={contactsData.description}
                onChange={(e) => setContactsData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Социальные сети</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="telegram">Telegram</Label>
              <Input
                id="telegram"
                value={contactsData.socialMedia?.telegram || ''}
                onChange={(e) => setContactsData(prev => ({
                  ...prev,
                  socialMedia: { 
                    ...prev.socialMedia, 
                    telegram: e.target.value,
                    whatsapp: prev.socialMedia?.whatsapp || '',
                    vk: prev.socialMedia?.vk || ''
                  }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={contactsData.socialMedia?.whatsapp || ''}
                onChange={(e) => setContactsData(prev => ({
                  ...prev,
                  socialMedia: { 
                    ...prev.socialMedia, 
                    whatsapp: e.target.value,
                    telegram: prev.socialMedia?.telegram || '',
                    vk: prev.socialMedia?.vk || ''
                  }
                }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vk">ВКонтакте</Label>
              <Input
                id="vk"
                value={contactsData.socialMedia?.vk || ''}
                onChange={(e) => setContactsData(prev => ({
                  ...prev,
                  socialMedia: { 
                    ...prev.socialMedia, 
                    vk: e.target.value,
                    telegram: prev.socialMedia?.telegram || '',
                    whatsapp: prev.socialMedia?.whatsapp || ''
                  }
                }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button 
          onClick={saveContacts} 
          disabled={isSaving}
          className="bg-coffee-600 hover:bg-coffee-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>
    </div>
  )
} 