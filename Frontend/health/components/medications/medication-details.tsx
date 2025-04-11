"use client"

import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MedicationForm } from "@/components/medications/medication-form"
import { useState } from "react"
import { Calendar, Clock, Edit } from "lucide-react"

interface MedicationDetailsProps {
  medicationId: string
  onClose: () => void
}

export function MedicationDetails({ medicationId, onClose }: MedicationDetailsProps) {
  const { medications } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  const medication = medications?.find((med) => med.id === medicationId)

  if (!medication) {
    return null
  }

  if (showEditForm) {
    return <MedicationForm medicationId={medicationId} onClose={() => setShowEditForm(false)} />
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <medication.icon className="h-5 w-5 text-primary" />
            {medication.name}
          </DialogTitle>
          <DialogDescription>Medication details and history</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Dosage</h4>
              <p>{medication.dosage}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
              <p className="capitalize">{medication.type}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Frequency</h4>
              <p className="capitalize">{medication.frequency.replace("-", " ")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <p className="capitalize">{medication.status}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Start Date</h4>
                <p>{new Date(medication.startDate).toLocaleDateString()}</p>
              </div>
            </div>
            {medication.endDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">End Date</h4>
                  <p>{new Date(medication.endDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Reminder Time</h4>
              <p>{medication.reminderTime}</p>
            </div>
          </div>
          {medication.instructions && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Instructions</h4>
              <p className="text-sm">{medication.instructions}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

