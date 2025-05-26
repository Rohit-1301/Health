"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { useHealth } from "@/context/health-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RecordsList } from "@/components/health-records/records-list"
import { RecordForm } from "@/components/health-records/record-form"
import { ConditionsList } from "@/components/health-records/conditions-list"
import { ConditionForm } from "@/components/health-records/condition-form"
import { Plus } from "lucide-react"

export function HealthRecords() {
  const { user, loading } = useAuth()
  const { fetchHealthRecords, healthRecords } = useHealth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("records")
  const [showRecordForm, setShowRecordForm] = useState(false)
  const [showConditionForm, setShowConditionForm] = useState(false)
  const dataFetchedRef = useRef(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    } else if (user && !dataFetchedRef.current) {
      dataFetchedRef.current = true
      fetchHealthRecords()
    }
  }, [user, loading, router, fetchHealthRecords])

  // Reset the fetch flag when component unmounts
  useEffect(() => {
    return () => {
      dataFetchedRef.current = false
    }
  }, [])

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
        <div className="flex items-center justify-between">
          <DashboardHeader title="Health Records" description="Manage your medical records and health conditions" />
          <Button onClick={() => (activeTab === "records" ? setShowRecordForm(true) : setShowConditionForm(true))}>
            <Plus className="mr-2 h-4 w-4" />
            Add {activeTab === "records" ? "Record" : "Condition"}
          </Button>
        </div>

        <Tabs defaultValue="records" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
            <TabsTrigger value="conditions">Conditions & Allergies</TabsTrigger>
          </TabsList>
          <TabsContent value="records">
            <Card>
              <CardContent className="p-6">
                <RecordsList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conditions">
            <Card>
              <CardContent className="p-6">
                <ConditionsList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {showRecordForm && <RecordForm onClose={() => setShowRecordForm(false)} />}
        {showConditionForm && <ConditionForm onClose={() => setShowConditionForm(false)} />}
      </div>
    </DashboardLayout>
  )
}

