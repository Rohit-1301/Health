"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import Cookies from "js-cookie"
import { toast } from "sonner"

interface NotificationPreferences {
  email: boolean
  browser: boolean
  appointment: boolean
  medication: boolean
  healthRecords: boolean
  measurements: boolean
}

interface NotificationContextType {
  preferences: NotificationPreferences
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
  sendTestNotification: () => Promise<void>
  isLoading: boolean
}

const defaultPreferences: NotificationPreferences = {
  email: true,
  browser: true,
  appointment: true,
  medication: true,
  healthRecords: false,
  measurements: false,
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchNotificationPreferences()
    } else {
      setPreferences(defaultPreferences)
    }
  }, [user])

  const fetchNotificationPreferences = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = Cookies.get("auth_token")
      const response = await fetch("http://localhost:5000/api/notifications/preferences", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
      } else {
        console.error("Failed to fetch notification preferences")
        // Fallback to default preferences if fetch fails
        setPreferences(defaultPreferences)
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error)
      setPreferences(defaultPreferences)
    } finally {
      setIsLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = Cookies.get("auth_token")
      const updatedPreferences = { ...preferences, ...newPreferences }
      
      const response = await fetch("http://localhost:5000/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPreferences),
      })

      if (response.ok) {
        setPreferences(updatedPreferences)
        toast.success("Notification preferences updated")
      } else {
        toast.error("Failed to update notification preferences")
      }
    } catch (error) {
      console.error("Error updating notification preferences:", error)
      toast.error("Failed to update preferences. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const token = Cookies.get("auth_token")
      const response = await fetch("http://localhost:5000/api/notifications/test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        toast.success("Test notification sent successfully")
      } else {
        toast.error("Failed to send test notification")
      }
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast.error("Failed to send test notification. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        preferences,
        updatePreferences,
        sendTestNotification,
        isLoading,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
} 