"use client"

import { useState, useEffect, useRef } from "react"
import { useHealth } from "@/context/health-context"
import { EnhancedCalendar } from "@/components/shared/enhanced-calendar"
import { AppointmentDetails } from "@/components/appointments/appointment-details"
import { Calendar } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function AppointmentCalendar() {
  const { appointments, fetchAppointments } = useHealth()
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [viewType, setViewType] = useState<"all" | "upcoming" | "past">("all")
  const hasLoadedRef = useRef(false)

  // Fetch appointments on initial load - only once
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true
      fetchAppointments()
    }
    
    // Reset the ref on unmount
    return () => {
      hasLoadedRef.current = false
    }
  }, [fetchAppointments])

  // Convert appointments to calendar events
  useEffect(() => {
    if (appointments) {
      const events = appointments.map((appt) => {
        // Create a date for the appointment
        const apptDate = new Date(appt.date)
        
        // Determine if the appointment is in the past
        const isPast = apptDate < new Date() || 
          (apptDate.setHours(0,0,0,0) === new Date().setHours(0,0,0,0) && 
           appt.time < new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))

        return {
          id: appt.id || appt._id, // Use MongoDB ID
          title: appt.doctorName,
          time: `${apptDate.toLocaleDateString()} ${appt.time}`,
          type: "appointment",
          status: appt.status,
          details: `${appt.specialty} • ${appt.location}`,
          icon: Calendar,
          isPast: isPast || appt.status === "completed",
        }
      })

      // Filter events based on viewType
      let filteredEvents = events
      if (viewType === "upcoming") {
        filteredEvents = events.filter(event => !event.isPast)
      } else if (viewType === "past") {
        filteredEvents = events.filter(event => event.isPast)
      }

      // Only update state if events have changed
      const currentIds = calendarEvents.map(e => e.id).sort().join(',')
      const newIds = filteredEvents.map(e => e.id).sort().join(',')
      
      if (currentIds !== newIds) {
        setCalendarEvents(filteredEvents)
      }
    }
  }, [appointments, viewType, calendarEvents])

  // Handle appointment selection
  const handleAppointmentClick = (appointmentId: string) => {
    setSelectedAppointment(appointmentId)
  }

  // Get upcoming appointments
  const getUpcomingAppointments = () => {
    if (!appointments) return []
    
    const now = new Date()
    return appointments.filter(appt => {
      const apptDate = new Date(appt.date)
      return (
        appt.status !== "cancelled" && 
        appt.status !== "completed" && 
        (apptDate > now || 
         (apptDate.setHours(0,0,0,0) === now.setHours(0,0,0,0) && 
          appt.time > new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })))
      )
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Get past appointments
  const getPastAppointments = () => {
    if (!appointments) return []
    
    const now = new Date()
    return appointments.filter(appt => {
      const apptDate = new Date(appt.date)
      return (
        appt.status === "completed" || 
        apptDate < now || 
        (apptDate.setHours(0,0,0,0) === now.setHours(0,0,0,0) && 
         appt.time < new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
      )
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Most recent first
  }

  // Format the date and time
  const formatDateTime = (date: string, time: string) => {
    const appointmentDate = new Date(date)
    const formattedDate = appointmentDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
    return `${formattedDate} at ${time}`
  }

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const upcomingAppointments = getUpcomingAppointments()
  const pastAppointments = getPastAppointments()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex">
          <TabsList className="mb-4 md:mb-0">
            <TabsTrigger 
              value="all" 
              onClick={() => setViewType("all")}
              className={viewType === "all" ? "bg-primary text-primary-foreground" : ""}
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming" 
              onClick={() => setViewType("upcoming")}
              className={viewType === "upcoming" ? "bg-primary text-primary-foreground" : ""}
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="past" 
              onClick={() => setViewType("past")}
              className={viewType === "past" ? "bg-primary text-primary-foreground" : ""}
            >
              Past
            </TabsTrigger>
          </TabsList>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Appointment Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <EnhancedCalendar 
                events={calendarEvents} 
                onEventClick={handleAppointmentClick} 
              />
            </CardContent>
          </Card>

          {selectedAppointment && (
            <div className="mt-6">
              <AppointmentDetails 
                appointmentId={selectedAppointment} 
                onClose={() => setSelectedAppointment(null)} 
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Upcoming Appointments List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.slice(0, 3).map((appt) => (
                    <div 
                      key={appt.id || appt._id} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        const appointmentId = appt.id || appt._id;
                        if (appointmentId) {
                          setSelectedAppointment(appointmentId)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{appt.doctorName}</h3>
                        {getStatusBadge(appt.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                      <p className="text-sm mt-2">{formatDateTime(appt.date, appt.time)}</p>
                      <p className="text-sm text-muted-foreground">{appt.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No upcoming appointments</p>
                )}
                
                {upcomingAppointments.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setViewType("upcoming")}
                  >
                    View All ({upcomingAppointments.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Past Appointments List */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Past Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pastAppointments.length > 0 ? (
                  pastAppointments.slice(0, 3).map((appt) => (
                    <div 
                      key={appt.id || appt._id} 
                      className="border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        const appointmentId = appt.id || appt._id;
                        if (appointmentId) {
                          setSelectedAppointment(appointmentId)
                        }
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{appt.doctorName}</h3>
                        {getStatusBadge(appt.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{appt.specialty}</p>
                      <p className="text-sm mt-2">{formatDateTime(appt.date, appt.time)}</p>
                      <p className="text-sm text-muted-foreground">{appt.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No past appointments</p>
                )}
                
                {pastAppointments.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setViewType("past")}
                  >
                    View All ({pastAppointments.length})
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

