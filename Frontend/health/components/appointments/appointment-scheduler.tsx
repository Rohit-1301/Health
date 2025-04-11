"use client"

import { useEffect, useState } from "react"
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
import { Plus } from "lucide-react"

export function AppointmentScheduler() {
  const { user, loading } = useAuth()
  const { fetchAppointments } = useHealth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      fetchAppointments()
    }
  }, [user, loading, router, fetchAppointments])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

