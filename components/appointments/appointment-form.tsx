"use client"

import type React from "react"

import { useState } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface AppointmentFormProps {
  onClose: () => void
  appointmentId?: string
}

export function AppointmentForm({ onClose, appointmentId }: AppointmentFormProps) {
  const { appointments, addAppointment, updateAppointment } = useHealth()

  // Find appointment by either MongoDB _id or local id
  const existingAppointment = appointmentId 
    ? appointments?.find((appt) => appt.id === appointmentId || appt._id === appointmentId) 
    : null

  const [formData, setFormData] = useState({
    doctorName: existingAppointment?.doctorName || "",
    specialty: existingAppointment?.specialty || "",
    location: existingAppointment?.location || "",
    date: existingAppointment?.date || new Date().toISOString().split("T")[0],
    time: existingAppointment?.time || "09:00",
    duration: existingAppointment?.duration || "30",
    reason: existingAppointment?.reason || "",
    addToCalendar: existingAppointment ? existingAppointment.addToCalendar : true,
    setReminder: existingAppointment ? existingAppointment.setReminder : true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (appointmentId) {
      updateAppointment(appointmentId, formData)
    } else {
      addAppointment(formData)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointmentId ? "Edit Appointment" : "Schedule New Appointment"}</DialogTitle>
          <DialogDescription>Enter the details for your healthcare appointment.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Doctor Name</Label>
              <Input id="doctorName" name="doctorName" value={formData.doctorName} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Input id="specialty" name="specialty" value={formData.specialty} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" value={formData.time} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Visit</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Brief description of the reason for your appointment"
                className="min-h-[80px]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="addToCalendar">Add to Calendar</Label>
              <Switch
                id="addToCalendar"
                checked={formData.addToCalendar}
                onCheckedChange={(checked) => handleSwitchChange("addToCalendar", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="setReminder">Set Reminder</Label>
              <Switch
                id="setReminder"
                checked={formData.setReminder}
                onCheckedChange={(checked) => handleSwitchChange("setReminder", checked)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

