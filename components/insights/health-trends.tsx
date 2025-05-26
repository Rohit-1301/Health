"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export function HealthTrends() {
  const { insights } = useHealth()
  const [timeRange, setTimeRange] = useState("month")

  const trendsData = insights?.healthTrends || {
    bloodPressure: [
      { date: "2023-03-01", value: "120/80" },
      { date: "2023-03-08", value: "118/78" },
      { date: "2023-03-15", value: "122/82" },
      { date: "2023-03-22", value: "119/79" },
      { date: "2023-03-29", value: "121/81" },
    ],
    weight: [
      { date: "2023-03-01", value: 68 },
      { date: "2023-03-08", value: 67.5 },
      { date: "2023-03-15", value: 67.8 },
      { date: "2023-03-22", value: 67.2 },
      { date: "2023-03-29", value: 67 },
    ],
    heartRate: [
      { date: "2023-03-01", value: 72 },
      { date: "2023-03-08", value: 75 },
      { date: "2023-03-15", value: 70 },
      { date: "2023-03-22", value: 73 },
      { date: "2023-03-29", value: 71 },
    ],
  }

  // Function to render a simple line chart
  const renderLineChart = (data: any[], valueKey: string, color: string) => {
    const values = data.map((item) =>
      typeof item.value === "string" ? Number.parseInt(item.value.split("/")[0]) : item.value,
    )
    const max = Math.max(...values) * 1.1
    const min = Math.min(...values) * 0.9
    const range = max - min

    return (
      <div className="h-40 flex items-end space-x-2">
        {values.map((value, index) => {
          const height = ((value - min) / range) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-full rounded-t-sm ${color}`} style={{ height: `${height}%` }}></div>
              <span className="text-xs mt-1">{data[index].date.split("-")[2]}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="quarter">Last Quarter</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure</CardTitle>
            <CardDescription>Systolic/Diastolic measurements over time</CardDescription>
          </CardHeader>
          <CardContent>{renderLineChart(trendsData.bloodPressure, "value", "bg-blue-500")}</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weight</CardTitle>
            <CardDescription>Weight measurements in kg over time</CardDescription>
          </CardHeader>
          <CardContent>{renderLineChart(trendsData.weight, "value", "bg-green-500")}</CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Heart Rate</CardTitle>
            <CardDescription>Resting heart rate in bpm over time</CardDescription>
          </CardHeader>
          <CardContent>{renderLineChart(trendsData.heartRate, "value", "bg-red-500")}</CardContent>
        </Card>
      </div>
    </div>
  )
}

