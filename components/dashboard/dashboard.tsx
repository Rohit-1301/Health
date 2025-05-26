"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useHealth } from "@/context/health-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MedicationSummary } from "@/components/medications/medication-summary"
import { AppointmentSummary } from "@/components/appointments/appointment-summary"
import { HealthMetrics } from "@/components/dashboard/health-metrics"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders"

export function Dashboard() {
  const { user, loading } = useAuth()
  const { fetchDashboardData, fetchAppointments, dashboardData } = useHealth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      console.log("Dashboard: No user logged in, redirecting to login page");
      router.push("/login")
    } else if (user) {
      console.log("Dashboard: User logged in, fetching dashboard data and appointments");
      fetchDashboardData()
      fetchAppointments()
    }
  }, [user, loading, router, fetchDashboardData, fetchAppointments])

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
        <DashboardHeader title="Dashboard" description="Overview of your health metrics and activities" />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <HealthMetrics />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <MedicationSummary />
          <AppointmentSummary />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <UpcomingReminders />
          <RecentActivities />
        </div>
      </div>
    </DashboardLayout>
  )
}

