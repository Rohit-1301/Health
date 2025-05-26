"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Cookies from 'js-cookie'

// Types
type User = {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  height?: string
  weight?: string
  allergies?: string
  medicalNotes?: string
  emergencyContacts?: EmergencyContact[]
  healthcareProviders?: HealthcareProvider[]
}

type EmergencyContact = {
  name: string
  relationship: string
  phone: string
  email?: string
}

type HealthcareProvider = {
  name: string
  specialty: string
  phone: string
  email?: string
  address?: string
  notes?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updateEmergencyContacts: (contacts: EmergencyContact[]) => void
  updateHealthcareProviders: (providers: HealthcareProvider[]) => void
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = Cookies.get('auth-token')
      
      if (token) {
        try {
          // Validate token with backend
          const response = await fetch('http://localhost:5000/api/auth/validate-token', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
  
          if (response.ok) {
            const userData = await response.json()
            
            // Map backend user data to our User type
            setUser({
              id: userData._id,
              name: userData.name,
              email: userData.email,
              // Set default values for other fields that may not be in the backend yet
              emergencyContacts: [],
              healthcareProviders: []
            })
          } else {
            // Token is invalid, remove it
            Cookies.remove('auth-token')
          }
        } catch (error) {
          console.error('Token validation error:', error)
          Cookies.remove('auth-token')
        }
      }
      
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('Login failed')
      }
      
      const data = await response.json()
      
      console.log('Login response:', {
        userId: data.user._id,
        userData: data.user
      });
      
      // Map backend user data to our User type
      const userData: User = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        // Set default values for other fields
        emergencyContacts: [],
        healthcareProviders: []
      }
      
      setUser(userData)
      
      // Store token in cookie
      if (data.token) {
        Cookies.set('auth-token', data.token, { expires: 7 }) // Expires in 7 days
      }
      
      toast({
        title: "Login successful",
        description: "Welcome back to Health Tracker!",
      })
      
      router.push("/dashboard")
    } catch (error) {
      console.error("Login failed:", error)
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please log in.",
      })
      
      router.push("/login")
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear user data and remove token
    setUser(null)
    Cookies.remove('auth-token')

    // Redirect to login page
    router.push("/login")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const updateEmergencyContacts = (contacts: EmergencyContact[]) => {
    if (user) {
      setUser({ ...user, emergencyContacts: contacts })
    }
  }

  const updateHealthcareProviders = (providers: HealthcareProvider[]) => {
    if (user) {
      setUser({ ...user, healthcareProviders: providers })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateEmergencyContacts,
        updateHealthcareProviders,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

