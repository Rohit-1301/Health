"use client"

import { useState, useEffect } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { Calendar, MoreVertical, X, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AppointmentListProps {
  type: "upcoming" | "past"
}

export function AppointmentList({ type }: AppointmentListProps) {
  const { appointments, cancelAppointment, fetchAppointments } = useHealth()
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load appointments if not already loaded
  useEffect(() => {
    console.log(`AppointmentList (${type}): Initial render, appointments count:`, appointments?.length || 0);
    
    if (!appointments || appointments.length === 0) {
      console.log(`AppointmentList (${type}): No appointments found, fetching...`);
      setIsLoading(true);
      try {
        fetchAppointments();
      } catch (err) {
        console.error(`AppointmentList (${type}): Error fetching appointments:`, err);
        setError("Failed to load appointments. Please refresh and try again.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [appointments, fetchAppointments, type]);

  const now = new Date()
  now.setHours(0, 0, 0, 0); // Compare dates only, not times
  
  console.log(`AppointmentList (${type}): Current date for comparison:`, now.toISOString());

  const filteredAppointments = appointments
    ?.filter((appt) => {
      try {
        // Skip appointments with cancelled status for upcoming list
        if (type === "upcoming" && appt.status === "cancelled") {
          return false;
        }
        
        // Parse date safely
        const apptDate = new Date(appt.date);
        apptDate.setHours(0, 0, 0, 0); // Reset time parts for date-only comparison
        
        const isUpcoming = apptDate >= now;
        console.log(`AppointmentList (${type}): Appointment ${appt.id} date ${apptDate.toISOString()} is ${isUpcoming ? 'upcoming' : 'past'}`);
        
        return type === "upcoming" ? isUpcoming : !isUpcoming;
      } catch (err) {
        console.error(`AppointmentList (${type}): Error processing appointment ${appt.id || appt._id}:`, err);
        return false;
      }
    }) || [];
    
  console.log(`AppointmentList (${type}): Filtered ${filteredAppointments.length} appointments`);

  const handleCancel = (id: string) => {
    try {
      cancelAppointment(id);
    } catch (err) {
      console.error(`AppointmentList (${type}): Error cancelling appointment ${id}:`, err);
      setError("Failed to cancel appointment. Please try again.");
    }
  }

  const handleViewDetails = (id: string) => {
    setSelectedAppointment(id);
  }
  
  const handleDismissError = () => {
    setError(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
          <Button variant="ghost" size="sm" onClick={handleDismissError} className="ml-auto">
            Dismiss
          </Button>
        </Alert>
      )}
    
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No {type} appointments found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAppointments.map((appointment) => (
            <div key={appointment._id || appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{appointment.doctorName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(appointment.date).toLocaleDateString()} • {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={appointment.status === "confirmed" ? "default" : "outline"}>{appointment.status}</Badge>
                {type === "upcoming" && appointment.status === "confirmed" && (
                  <Button size="sm" variant="outline" onClick={() => handleCancel(appointment._id || appointment.id)}>
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
                    <DropdownMenuItem onClick={() => handleViewDetails(appointment._id || appointment.id)}>View Details</DropdownMenuItem>
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

