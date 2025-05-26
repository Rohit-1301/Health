"use client"

import { useEffect } from "react"
import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Calendar } from "lucide-react"

export function AppointmentSummary() {
  const { appointments, fetchAppointments } = useHealth()

  // Ensure appointments are loaded
  useEffect(() => {
    console.log("AppointmentSummary: Initial render, appointments count:", appointments?.length || 0);
    if (!appointments || appointments.length === 0) {
      console.log("AppointmentSummary: No appointments found, fetching appointments");
      fetchAppointments();
    }
  }, [appointments, fetchAppointments]);

  const now = new Date()
  console.log("AppointmentSummary: Current date for comparison:", now.toISOString());
  
  const upcomingAppointments = appointments
    ?.filter((appt) => {
      // Skip cancelled appointments
      if (appt.status === "cancelled") {
        return false;
      }
      
      // Safe date parsing - handle potential format issues
      try {
        // Ensure date is in YYYY-MM-DD format
        const dateParts = appt.date.split('-');
        if (dateParts.length !== 3) {
          console.warn(`AppointmentSummary: Invalid date format for appointment ${appt.id}: ${appt.date}`);
          return false;
        }
        
        // Use date only for comparison (ignoring time for simplicity)
        const apptDate = new Date(appt.date);
        apptDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log(`AppointmentSummary: Comparing appointment ${appt.id} date ${apptDate.toISOString()} with today ${today.toISOString()}`);
        
        return apptDate >= today;
      } catch (error) {
        console.error(`AppointmentSummary: Error parsing date for appointment ${appt.id}:`, error);
        return false;
      }
    })
    .sort((a, b) => {
      // Sort by date, then by time
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      
      // If same date, sort by time
      return a.time.localeCompare(b.time);
    })
    .slice(0, 3) || [];

  console.log("AppointmentSummary: Filtered upcoming appointments:", upcomingAppointments);

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
                <div key={appointment.id || appointment._id} className="flex items-start gap-3 p-2 border rounded-md">
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

