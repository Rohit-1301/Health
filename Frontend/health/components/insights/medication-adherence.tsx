"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function MedicationAdherence() {
  const { insights } = useHealth()

  const adherenceData = insights?.medicationAdherence || {
    overall: 85,
    weekly: [90, 100, 80, 70, 85, 90, 80],
    byMedication: [
      { name: "Aspirin", adherence: 95 },
      { name: "Vitamin D", adherence: 80 },
      { name: "Antibiotic", adherence: 70 },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Overall Adherence</CardTitle>
          <CardDescription>Your medication adherence over the past month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32">
                <circle
                  className="text-muted stroke-current"
                  strokeWidth="12"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
                <circle
                  className="text-primary stroke-current"
                  strokeWidth="12"
                  strokeDasharray={56 * 2 * Math.PI}
                  strokeDashoffset={56 * 2 * Math.PI * (1 - adherenceData.overall / 100)}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="56"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span className="absolute text-2xl font-bold">{adherenceData.overall}%</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You've taken {adherenceData.overall}% of your medications as prescribed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Adherence</CardTitle>
          <CardDescription>Your medication adherence for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day, index) => (
              <div key={day} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{day}</span>
                  <span className="text-sm text-muted-foreground">{adherenceData.weekly[index]}%</span>
                </div>
                <Progress value={adherenceData.weekly[index]} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Adherence by Medication</CardTitle>
          <CardDescription>How well you're taking each medication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {adherenceData.byMedication.map((med) => (
              <div key={med.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{med.name}</span>
                  <span className="text-sm text-muted-foreground">{med.adherence}%</span>
                </div>
                <Progress value={med.adherence} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {med.adherence >= 90
                    ? "Excellent adherence"
                    : med.adherence >= 80
                      ? "Good adherence"
                      : "Needs improvement"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

