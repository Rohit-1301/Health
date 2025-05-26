"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealth } from "@/context/health-context"
import { useAuth } from "@/context/auth-context"
import { Calendar, Clock, Pill } from "lucide-react"

// Helper to format dates for display
const formatReminderDate = (dateStr: string, timeStr: string) => {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  const appointmentDate = new Date(dateStr)
  
  // Check if it's today
  if (
    appointmentDate.getDate() === today.getDate() &&
    appointmentDate.getMonth() === today.getMonth() &&
    appointmentDate.getFullYear() === today.getFullYear()
  ) {
    return `Today, ${timeStr}`
  }
  
  // Check if it's tomorrow
  if (
    appointmentDate.getDate() === tomorrow.getDate() &&
    appointmentDate.getMonth() === tomorrow.getMonth() &&
    appointmentDate.getFullYear() === tomorrow.getFullYear()
  ) {
    return `Tomorrow, ${timeStr}`
  }
  
  // Otherwise return formatted date
  return `${appointmentDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })}, ${timeStr}`
}

export function UpcomingReminders() {
  const { dashboardData, appointments, fetchAppointments } = useHealth()
  const { user } = useAuth()
  const [generatedReminders, setGeneratedReminders] = useState<any[]>([])
  const hasLoadedRef = useRef(false)
  
  // Fetch appointments on component mount - only once
  useEffect(() => {
    if (user && !hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchAppointments()
    }
  }, [user, fetchAppointments])
  
  // Reset the ref when user changes
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false
    }
  }, [user])
  
  // Generate reminders from appointments and medications
  useEffect(() => {
    if (appointments) {
      // Get current date for comparison
      const now = new Date()
      
      // Filter upcoming appointments with reminders enabled
      const upcomingAppointmentsWithReminders = appointments
        .filter(appt => {
          // Only include appointments in the next 7 days with reminders enabled
          const apptDate = new Date(appt.date)
          const sevenDaysFromNow = new Date(now)
          sevenDaysFromNow.setDate(now.getDate() + 7)
          
          return (
            appt.setReminder && 
            appt.status !== "cancelled" &&
            appt.status !== "completed" &&
            apptDate <= sevenDaysFromNow &&
            apptDate >= now
          )
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5) // Limit to 5 reminders
        .map(appt => ({
          id: appt.id || appt._id,
          type: "appointment",
          title: `${appt.doctorName} Appointment`,
          time: formatReminderDate(appt.date, appt.time),
          icon: Calendar,
          appt: appt // Store the full appointment for reference
        }))
      
      // Combine with mock medication reminders for now
      // In a real app, you'd fetch medications with reminders too
      const mockMedicationReminders = dashboardData?.upcomingReminders?.filter(r => r.type === "medication") || [
        {
          id: "medication-1",
          type: "medication",
          title: "Take Aspirin",
          time: "Today, 8:00 PM",
          icon: Pill,
        },
        {
          id: "medication-2",
          type: "medication",
          title: "Take Vitamin D",
          time: "Tomorrow, 9:00 AM",
          icon: Pill,
        }
      ]
      
      // Combine and sort all reminders
      const allReminders = [...upcomingAppointmentsWithReminders, ...mockMedicationReminders]
      
      // Only update state if reminders changed to prevent re-renders
      const currentIds = generatedReminders.map(r => r.id).sort().join(',')
      const newIds = allReminders.map(r => r.id).sort().join(',')
      
      if (currentIds !== newIds) {
        setGeneratedReminders(allReminders)
      }
    }
  }, [appointments, dashboardData, generatedReminders])
  
  // Fallback to mock data if no generated reminders yet
  const reminders = generatedReminders.length > 0 
    ? generatedReminders 
    : dashboardData?.upcomingReminders || [
        {
          id: "1",
          type: "medication",
          title: "Take Aspirin",
          time: "Today, 8:00 PM",
          icon: Pill,
        },
        {
          id: "2",
          type: "medication",
          title: "Take Vitamin D",
          time: "Tomorrow, 9:00 AM",
          icon: Pill,
        },
        {
          id: "3",
          type: "appointment",
          title: "Dr. Johnson Appointment",
          time: "Mar 20, 10:30 AM",
          icon: Calendar,
        },
        {
          id: "4",
          type: "checkup",
          title: "Blood Pressure Check",
          time: "Mar 21, 9:00 AM",
          icon: Clock,
        },
      ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reminders.length > 0 ? (
            reminders.map((reminder) => (
              <div key={reminder.id} className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <reminder.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">{reminder.title}</p>
                  <p className="text-xs text-muted-foreground">{reminder.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-muted-foreground py-4">
              No upcoming reminders
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

