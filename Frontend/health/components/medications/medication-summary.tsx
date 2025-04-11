"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Clock, X } from "lucide-react"
import Link from "next/link"

export function MedicationSummary() {
  const { medications } = useHealth()

  const totalMedications = medications?.length || 0
  const takenMedications = medications?.filter((med) => med.status === "taken").length || 0
  const dueMedications = medications?.filter((med) => med.status === "due").length || 0
  const missedMedications = medications?.filter((med) => med.status === "missed").length || 0

  const adherenceRate = totalMedications > 0 ? Math.round((takenMedications / totalMedications) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Medication Summary</CardTitle>
        <Link href="/dashboard/medications" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Adherence Rate</span>
              <span className="text-sm font-medium">{adherenceRate}%</span>
            </div>
            <Progress value={adherenceRate} className="h-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-2 border rounded-md">
              <div className="rounded-full p-1.5 bg-green-100 text-green-600">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold mt-1">{takenMedications}</span>
              <span className="text-xs text-muted-foreground">Taken</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-md">
              <div className="rounded-full p-1.5 bg-amber-100 text-amber-600">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold mt-1">{dueMedications}</span>
              <span className="text-xs text-muted-foreground">Due</span>
            </div>
            <div className="flex flex-col items-center p-2 border rounded-md">
              <div className="rounded-full p-1.5 bg-red-100 text-red-600">
                <X className="h-4 w-4" />
              </div>
              <span className="text-2xl font-bold mt-1">{missedMedications}</span>
              <span className="text-xs text-muted-foreground">Missed</span>
            </div>
          </div>

          {medications && medications.length > 0 ? (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Upcoming Medications</h4>
              <div className="space-y-2">
                {medications
                  .filter((med) => med.status === "due")
                  .slice(0, 2)
                  .map((medication) => (
                    <div key={medication.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                        <medication.icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{medication.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{medication.reminderTime}</span>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-muted-foreground">No medications added yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

