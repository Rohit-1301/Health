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

interface ConditionFormProps {
  onClose: () => void
  conditionId?: string
}

export function ConditionForm({ onClose, conditionId }: ConditionFormProps) {
  const { conditions, addCondition, updateCondition } = useHealth()

  const existingCondition = conditionId ? conditions?.find((condition) => condition.id === conditionId) : null

  const [formData, setFormData] = useState({
    name: existingCondition?.name || "",
    type: existingCondition?.type || "condition",
    severity: existingCondition?.severity || "moderate",
    diagnosedDate: existingCondition?.diagnosedDate || "",
    isActive: existingCondition ? existingCondition.isActive : true,
    notes: existingCondition?.notes || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isActive: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (conditionId) {
      updateCondition(conditionId, formData)
    } else {
      addCondition(formData)
    }

    onClose()
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{conditionId ? "Edit Condition" : "Add Condition or Allergy"}</DialogTitle>
          <DialogDescription>Record your health conditions and allergies.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="condition">Medical Condition</SelectItem>
                    <SelectItem value="allergy">Allergy</SelectItem>
                    <SelectItem value="chronic">Chronic Disease</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <Select value={formData.severity} onValueChange={(value) => handleSelectChange("severity", value)}>
                  <SelectTrigger id="severity">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagnosedDate">Diagnosed Date (Optional)</Label>
              <Input
                id="diagnosedDate"
                name="diagnosedDate"
                type="date"
                value={formData.diagnosedDate}
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Currently Active</Label>
              <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Symptoms, treatments, or other relevant information"
                className="min-h-[100px]"
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

