"use client"

import { useState, useEffect } from "react"
import { useHealth } from "@/context/health-context"
import { EnhancedCalendar } from "@/components/shared/enhanced-calendar"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { Calendar } from "lucide-react"

export function AppointmentCalendar() {
  const { appointments } = useHealth()
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])

  // Convert appointments to calendar events
  useEffect(() => {
    if (appointments) {
      const events = appointments.map((appt) => {
        // Create a date for the appointment
        const apptDate = new Date(appt.date)

        return {
          id: appt.id,
          title: appt.doctorName,
          time: `${apptDate.toLocaleDateString()} ${appt.time}`,
          type: "appointment",
          status: appt.status,
          details: `${appt.specialty} • ${appt.location}`,
          icon: Calendar,
        }
      })

      setCalendarEvents(events)
    }
  }, [appointments])

  // Handle appointment selection
  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
  }

  return (
    <div className="space-y-4">
      <EnhancedCalendar events={calendarEvents} onEventClick={handleAppointmentClick} />

      {selectedAppointment && (
        <AppointmentDetails appointmentId={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </div>
  )
}

