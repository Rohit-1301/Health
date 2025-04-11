"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealth } from "@/context/health-context"
import { Calendar, FileText, Pill } from "lucide-react"

export function RecentActivities() {
  const { dashboardData } = useHealth()

  const activities = dashboardData?.recentActivities || [
    {
      id: "1",
      type: "medication",
      title: "Took Aspirin",
      time: "Today, 8:00 AM",
      icon: Pill,
    },
    {
      id: "2",
      type: "appointment",
      title: "Dr. Smith Appointment",
      time: "Yesterday, 2:30 PM",
      icon: Calendar,
    },
    {
      id: "3",
      type: "record",
      title: "Added Blood Test Results",
      time: "Mar 15, 10:15 AM",
      icon: FileText,
    },
    {
      id: "4",
      type: "medication",
      title: "Took Vitamin D",
      time: "Mar 15, 9:00 AM",
      icon: Pill,
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4">
              <div className="rounded-full p-2 bg-primary/10">
                <activity.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

