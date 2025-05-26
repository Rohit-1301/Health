"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useHealth } from "@/context/health-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { Plus, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function AppointmentScheduler() {
  const { user, loading: authLoading } = useAuth()
  const { fetchAppointments, appointments } = useHealth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    if (!authLoading && !user) {
      console.log("AppointmentScheduler: No user logged in, redirecting to login");
      router.push("/login")
    } else if (user && !hasLoadedRef.current) {
      console.log("AppointmentScheduler: User logged in, fetching appointments");
      hasLoadedRef.current = true
      setLoading(true)
      
      try {
        // Call fetchAppointments directly - it doesn't return a Promise
        fetchAppointments()
        console.log("AppointmentScheduler: Appointments fetch initiated");
        
        // Set a timeout to give the fetch time to complete or fail
        setTimeout(() => {
          if (appointments && appointments.length > 0) {
            console.log("AppointmentScheduler: Appointments loaded successfully");
          } else {
            console.log("AppointmentScheduler: No appointments found after fetch");
          }
          setLoading(false)
        }, 2000);
      } catch (error: unknown) {
        console.error("AppointmentScheduler: Error during appointments fetch:", error);
        setError("An error occurred while loading appointments.");
        setLoading(false)
      }
    }
    
    // Reset the ref on unmount
    return () => {
      hasLoadedRef.current = false
    }
  }, [user, authLoading, router, fetchAppointments, appointments])

  const handleDismissError = () => {
    setError(null);
  }

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <DashboardHeader
            title="Appointment Scheduler"
            description="Schedule and manage your healthcare appointments"
          />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
            <Button variant="ghost" size="sm" onClick={handleDismissError} className="ml-auto">
              Dismiss
            </Button>
          </Alert>
        )}

        <Tabs defaultValue="upcoming">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Card>
              <CardContent className="p-6">
                <AppointmentList type="upcoming" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="past">
            <Card>
              <CardContent className="p-6">
                <AppointmentList type="past" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-6">
                <AppointmentCalendar />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showForm && <AppointmentForm onClose={() => setShowForm(false)} />}
      </div>
    </DashboardLayout>
  )
}

