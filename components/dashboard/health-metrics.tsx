"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useHealth } from "@/context/health-context"
import { Activity, Heart, Thermometer, Weight } from "lucide-react"

export function HealthMetrics() {
  const { dashboardData } = useHealth()

  const metrics = [
    {
      title: "Heart Rate",
      value: dashboardData?.heartRate || "75",
      unit: "bpm",
      icon: Heart,
      color: "text-red-500",
    },
    {
      title: "Blood Pressure",
      value: dashboardData?.bloodPressure || "120/80",
      unit: "mmHg",
      icon: Activity,
      color: "text-blue-500",
    },
    {
      title: "Weight",
      value: dashboardData?.weight || "68",
      unit: "kg",
      icon: Weight,
      color: "text-green-500",
    },
    {
      title: "Temperature",
      value: dashboardData?.temperature || "36.6",
      unit: "°C",
      icon: Thermometer,
      color: "text-orange-500",
    },
  ]

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metric.value}
              <span className="text-sm font-normal text-muted-foreground ml-1">{metric.unit}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

