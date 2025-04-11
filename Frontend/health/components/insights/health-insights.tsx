"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useHealth } from "@/context/health-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MedicationAdherence } from "@/components/insights/medication-adherence"
import { HealthTrends } from "@/components/insights/health-trends"
import { HealthRecommendations } from "@/components/insights/health-recommendations"
import { HealthRisks } from "@/components/insights/health-risks"

export function HealthInsights() {
  const { user, loading } = useAuth()
  const { fetchInsights } = useHealth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user) {
      fetchInsights()
    }
  }, [user, loading, router, fetchInsights])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-4 md:p-6">
        <DashboardHeader
          title="Health Insights"
          description="Analytics and recommendations based on your health data"
        />

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>Your health data analyzed for trends and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="adherence">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="adherence">Medication</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="risks">Risks</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              <TabsContent value="adherence" className="pt-4">
                <MedicationAdherence />
              </TabsContent>
              <TabsContent value="trends" className="pt-4">
                <HealthTrends />
              </TabsContent>
              <TabsContent value="risks" className="pt-4">
                <HealthRisks />
              </TabsContent>
              <TabsContent value="recommendations" className="pt-4">
                <HealthRecommendations />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

