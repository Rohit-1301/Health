"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function NotificationSettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    medicationReminders: true,
    appointmentReminders: true,
    missedMedications: true,
    healthTips: false,
    appUpdates: false,
    email: true,
    push: true,
    sms: false,
  })

  const handleToggle = (key: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="medicationReminders">Medication Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive reminders for your medications</p>
            </div>
            <Switch
              id="medicationReminders"
              checked={settings.medicationReminders}
              onCheckedChange={() => handleToggle("medicationReminders")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appointmentReminders">Appointment Reminders</Label>
              <p className="text-sm text-muted-foreground">Receive reminders for upcoming appointments</p>
            </div>
            <Switch
              id="appointmentReminders"
              checked={settings.appointmentReminders}
              onCheckedChange={() => handleToggle("appointmentReminders")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="missedMedications">Missed Medication Alerts</Label>
              <p className="text-sm text-muted-foreground">Get alerts when you miss taking medications</p>
            </div>
            <Switch
              id="missedMedications"
              checked={settings.missedMedications}
              onCheckedChange={() => handleToggle("missedMedications")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="healthTips">Health Tips & Insights</Label>
              <p className="text-sm text-muted-foreground">Receive personalized health tips and insights</p>
            </div>
            <Switch id="healthTips" checked={settings.healthTips} onCheckedChange={() => handleToggle("healthTips")} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="appUpdates">App Updates & News</Label>
              <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
            </div>
            <Switch id="appUpdates" checked={settings.appUpdates} onCheckedChange={() => handleToggle("appUpdates")} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch id="email" checked={settings.email} onCheckedChange={() => handleToggle("email")} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch id="push" checked={settings.push} onCheckedChange={() => handleToggle("push")} />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="sms">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
            </div>
            <Switch id="sms" checked={settings.sms} onCheckedChange={() => handleToggle("sms")} />
          </div>
        </div>
      </div>

      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  )
}

