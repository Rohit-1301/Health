"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileForm } from "@/components/profile/profile-form"
import { EmergencyContacts } from "@/components/profile/emergency-contacts"
import { HealthcareProviders } from "@/components/profile/healthcare-providers"
import { ProfileSecurity } from "@/components/profile/profile-security"

export function UserProfile() {
  const { user, loading, updateProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

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
        <DashboardHeader title="Profile" description="Manage your account settings and preferences" />

        <Tabs defaultValue="personal">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="providers">Healthcare Providers</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          <TabsContent value="personal" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="emergency" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <EmergencyContacts />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="providers" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <HealthcareProviders />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="pt-4">
            <Card>
              <CardContent className="p-6">
                <ProfileSecurity />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

