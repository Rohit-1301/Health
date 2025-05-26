"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"

export function HealthRisks() {
  const { insights } = useHealth()

  const risksData = insights?.healthRisks || [
    {
      id: "1",
      name: "Hypertension Risk",
      score: 35,
      description: "Based on your blood pressure readings and family history",
      severity: "low",
    },
    {
      id: "2",
      name: "Medication Interaction Risk",
      score: 15,
      description: "Your current medications have minimal interaction potential",
      severity: "low",
    },
    {
      id: "3",
      name: "Vitamin D Deficiency",
      score: 60,
      description: "Based on your medication adherence and reported symptoms",
      severity: "medium",
    },
    {
      id: "4",
      name: "Stress-Related Health Issues",
      score: 45,
      description: "Based on your reported symptoms and activity patterns",
      severity: "medium",
    },
  ]

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "low":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Info className="h-5 w-5 text-gray-500" />
    }
  }

  const getProgressColor = (score: number) => {
    if (score >= 70) return "bg-red-500"
    if (score >= 40) return "bg-yellow-500"
    return "bg-blue-500"
  }

  return (
    <div className="space-y-4">
      {risksData.map((risk) => (
        <Card key={risk.id}>
          <CardHeader className="flex flex-row items-start space-y-0 pb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{risk.name}</CardTitle>
                {getSeverityIcon(risk.severity)}
              </div>
              <CardDescription>{risk.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Score</span>
                <span className="text-sm text-muted-foreground">{risk.score}%</span>
              </div>
              <Progress value={risk.score} className="h-2" indicatorClassName={getProgressColor(risk.score)} />
              <p className="text-xs text-muted-foreground">
                {risk.score < 40
                  ? "Low risk - continue monitoring"
                  : risk.score < 70
                    ? "Moderate risk - consider preventive measures"
                    : "High risk - consult with healthcare provider"}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

