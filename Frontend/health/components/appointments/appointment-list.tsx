"use client"

import { useState } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { Calendar, MoreVertical, X } from "lucide-react"

interface AppointmentListProps {
  type: "upcoming" | "past"
}

export function AppointmentList({ type }: AppointmentListProps) {
  const { appointments, cancelAppointment } = useHealth()
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  const now = new Date()
  const filteredAppointments =
    appointments?.filter((appt) => {
      const apptDate = new Date(appt.date + "T" + appt.time)
      return type === "upcoming" ? apptDate >= now : apptDate < now
    }) || []

  const handleCancel = (id: string) => {
    cancelAppointment(id)
  }

  const handleViewDetails = (id: string) => {
    setSelectedAppointment(id)
  }

  return (
    <div className="space-y-4">
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No {type} appointments found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{appointment.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {appointment.date} • {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>{appointment.status}</Badge>
                {type === "upcoming" && (
                  <Button size="sm" variant="outline" onClick={() => handleCancel(appointment.id)}>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(appointment.id)}>View Details</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedAppointment && (
        <AppointmentDetails appointmentId={selectedAppointment} onClose={() => setSelectedAppointment(null)} />
      )}
    </div>
  )
}

