"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealth } from "@/context/health-context"
import { Calendar, Clock, Pill } from "lucide-react"

export function UpcomingReminders() {
  const { dashboardData } = useHealth()

  const reminders = dashboardData?.upcomingReminders || [
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
          {reminders.map((reminder) => (
            <div key={reminder.id} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <reminder.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{reminder.title}</p>
                <p className="text-xs text-muted-foreground">{reminder.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

