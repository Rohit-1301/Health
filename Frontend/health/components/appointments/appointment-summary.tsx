"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar } from "lucide-react"

export function AppointmentSummary() {
  const { appointments } = useHealth()

  const now = new Date()
  const upcomingAppointments =
    appointments
      ?.filter((appt) => {
        const apptDate = new Date(appt.date + "T" + appt.time)
        return apptDate >= now
      })
      .sort((a, b) => {
        return new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime()
      })
      .slice(0, 3) || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Upcoming Appointments</CardTitle>
        <Link href="/dashboard/appointments" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-3 p-2 border rounded-md">
                  <div className="rounded-full p-2 bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{appointment.doctorName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                    </p>
                    <p className="text-xs text-muted-foreground">{appointment.specialty}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">No upcoming appointments</p>
              <Link href="/dashboard/appointments">
                <span className="text-sm text-primary hover:underline">Schedule one now</span>
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

