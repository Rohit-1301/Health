"use client"

import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AppointmentForm } from "@/components/appointments/appointment-form"
import { useState } from "react"
import { Calendar, Clock, Edit, MapPin, User, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AppointmentDetailsProps {
  appointmentId: string
  onClose: () => void
}

export function AppointmentDetails({ appointmentId, onClose }: AppointmentDetailsProps) {
  const { appointments, cancelAppointment } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  // Find appointment by either MongoDB _id or local id
  const appointment = appointments?.find((appt) => 
    (appt._id && appt._id === appointmentId) || appt.id === appointmentId
  )

  if (!appointment) {
    return null
  }

  if (showEditForm) {
    return <AppointmentForm appointmentId={appointmentId} onClose={() => setShowEditForm(false)} />
  }

  const handleCancel = () => {
    // Use MongoDB _id if available, fall back to local id
    cancelAppointment(appointment._id || appointment.id)
    onClose()
  }

  const isUpcoming = new Date(appointment.date + "T" + appointment.time) > new Date()
  const isConfirmed = appointment.status === "confirmed"

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Appointment Details
          </DialogTitle>
          <DialogDescription>
            {appointment.specialty} appointment with {appointment.doctorName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Doctor</h4>
              <p>{appointment.doctorName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <p>{appointment.location}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
                <p>{new Date(appointment.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Time</h4>
                <p>
                  {appointment.time} ({appointment.duration} min)
                </p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
            <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>{appointment.status}</Badge>
          </div>
          {appointment.reason && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Reason for Visit</h4>
              <p className="text-sm">{appointment.reason}</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {isUpcoming && isConfirmed && (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel Appointment
              </Button>
              <Button onClick={() => setShowEditForm(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

