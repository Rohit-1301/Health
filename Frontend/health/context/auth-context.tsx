"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

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

// Mock user data for demo purposes
const MOCK_USER: User = {
  id: "user-1",
  name: "Rohit Gupta",
  email: "rohit@gmail.com",
  avatar: "/placeholder.svg?height=100&width=100",
  phone: "+91-9322266657",
  dateOfBirth: "2005-01-13",
  gender: "male",
  bloodType: "O+",
  height: "165",
  weight: "62",
  allergies: "Penicillin, Peanuts",
  medicalNotes: "Previous surgery in 2018 for appendicitis.",
  emergencyContacts: [
    {
      name: "Surendra Gupta",
      relationship: "parents",
      phone: "+91-8779878924",
      email: "surendra@gmail.com",
    },
  ],
  healthcareProviders: [
    {
      name: "Dr. Shreyas",
      specialty: "Primary Care Physician",
      phone: "+91-7304064582",
      email: "dr.shreyas@gmail.com",
      address: "1/2, Wadala Colony,Wadala, Mumbai, Maharashtra 400031",
    },
  ],
}

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Simulate checking for existing session on mount
  useEffect(() => {
    // In a real app, this would check for a token in localStorage or cookies
    // and validate it with the backend
    const checkAuth = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // For demo purposes, we'll just set the user to null initially
        setUser(null)
      } catch (error) {
        console.error("Auth check failed:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any credentials and use mock data
      setUser(MOCK_USER)

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
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, create a new user based on mock data
      const newUser: User = {
        ...MOCK_USER,
        id: `user-${Date.now()}`,
        name,
        email,
        emergencyContacts: [],
        healthcareProviders: [],
      }

      setUser(newUser)

      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Registration failed:", error)
      toast({
        title: "Registration failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // Clear user data
    setUser(null)

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

