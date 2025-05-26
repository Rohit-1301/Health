"use client"

import { useHealth } from "@/context/health-context"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Apple, Bed, Brain, Heart } from "lucide-react"

export function HealthRecommendations() {
  const { insights } = useHealth()

  const recommendationsData = insights?.recommendations || [
    {
      id: "1",
      category: "exercise",
      title: "Increase Physical Activity",
      description: "Based on your heart rate patterns, we recommend increasing your daily physical activity.",
      priority: "high",
      icon: Activity,
    },
    {
      id: "2",
      category: "nutrition",
      title: "Improve Vitamin D Intake",
      description:
        "Your medication adherence for Vitamin D is lower than recommended. Consider dietary changes or better adherence.",
      priority: "medium",
      icon: Apple,
    },
    {
      id: "3",
      category: "sleep",
      title: "Improve Sleep Schedule",
      description: "Your health data suggests irregular sleep patterns. Try to maintain a consistent sleep schedule.",
      priority: "medium",
      icon: Bed,
    },
    {
      id: "4",
      category: "heart",
      title: "Monitor Blood Pressure",
      description:
        "Your blood pressure readings show slight elevation. Continue monitoring and consider lifestyle changes.",
      priority: "low",
      icon: Heart,
    },
    {
      id: "5",
      category: "mental",
      title: "Stress Management",
      description: "Consider incorporating stress management techniques into your daily routine.",
      priority: "low",
      icon: Brain,
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {recommendationsData.map((recommendation) => (
        <Card key={recommendation.id} className="cursor-pointer hover:bg-muted/50">
          <CardHeader className="flex flex-row items-start space-y-0 pb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-base">{recommendation.title}</CardTitle>
                <Badge className={getPriorityColor(recommendation.priority)}>{recommendation.priority}</Badge>
              </div>
              <CardDescription>{recommendation.description}</CardDescription>
            </div>
            <div className="rounded-full p-2 bg-primary/10">
              <recommendation.icon className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

