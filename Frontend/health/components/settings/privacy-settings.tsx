"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

export function PrivacySettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    shareHealthData: false,
    allowAnonymousAnalytics: true,
    showProfileToOthers: false,
    storeDataLocally: true,
    enableBackup: true,
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
      description: "Your privacy preferences have been updated.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Privacy Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="shareHealthData">Share Health Data</Label>
              <p className="text-sm text-muted-foreground">Allow sharing your health data with healthcare providers</p>
            </div>
            <Switch
              id="shareHealthData"
              checked={settings.shareHealthData}
              onCheckedChange={() => handleToggle("shareHealthData")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="allowAnonymousAnalytics">Anonymous Analytics</Label>
              <p className="text-sm text-muted-foreground">Allow anonymous usage data to improve the app</p>
            </div>
            <Switch
              id="allowAnonymousAnalytics"
              checked={settings.allowAnonymousAnalytics}
              onCheckedChange={() => handleToggle("allowAnonymousAnalytics")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="showProfileToOthers">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your profile information</p>
            </div>
            <Switch
              id="showProfileToOthers"
              checked={settings.showProfileToOthers}
              onCheckedChange={() => handleToggle("showProfileToOthers")}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="storeDataLocally">Local Storage</Label>
              <p className="text-sm text-muted-foreground">Store data locally on your device</p>
            </div>
            <Switch
              id="storeDataLocally"
              checked={settings.storeDataLocally}
              onCheckedChange={() => handleToggle("storeDataLocally")}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="enableBackup">Cloud Backup</Label>
              <p className="text-sm text-muted-foreground">Enable automatic backup to secure cloud storage</p>
            </div>
            <Switch
              id="enableBackup"
              checked={settings.enableBackup}
              onCheckedChange={() => handleToggle("enableBackup")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Button onClick={handleSave}>Save Changes</Button>
        <div className="pt-4">
          <Button variant="outline" className="text-red-500 hover:text-red-600 hover:bg-red-50">
            Delete All My Data
          </Button>
        </div>
      </div>
    </div>
  )
}

