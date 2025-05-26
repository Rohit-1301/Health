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
import { MedicationList } from "@/components/medications/medication-list"
import { MedicationForm } from "@/components/medications/medication-form"
import { MedicationCalendar } from "@/components/medications/medication-calendar"
import { MedicationHistory } from "@/components/medications/medication-history"
import { Plus } from "lucide-react"

export function MedicationTracker() {
  const { user, loading } = useAuth()
  const { fetchMedications } = useHealth()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      fetchMedications()
    }
  }, [user, loading, router, fetchMedications])

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
          <DashboardHeader title="Medication Tracker" description="Manage your medications and set reminders" />
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current Medications</TabsTrigger>
            <TabsTrigger value="history">Medication History</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <Card>
              <CardContent className="p-6">
                <MedicationList type="current" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history">
            <Card>
              <CardContent className="p-6">
                <MedicationHistory />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar">
            <Card>
              <CardContent className="p-6">
                <MedicationCalendar />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showForm && <MedicationForm onClose={() => setShowForm(false)} />}
      </div>
    </DashboardLayout>
  )
}

