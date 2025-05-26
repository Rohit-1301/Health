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
import { ConditionForm } from "@/components/health-records/condition-form"
import { useState } from "react"
import { AlertCircle, Calendar, Edit } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ConditionDetailsProps {
  conditionId: string
  onClose: () => void
}

export function ConditionDetails({ conditionId, onClose }: ConditionDetailsProps) {
  const { conditions } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  const condition = conditions?.find((cond) => cond.id === conditionId)

  if (!condition) {
    return null
  }

  if (showEditForm) {
    return <ConditionForm conditionId={conditionId} onClose={() => setShowEditForm(false)} />
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className={`h-5 w-5 ${condition.type === "allergy" ? "text-red-500" : "text-primary"}`} />
            {condition.name}
          </DialogTitle>
          <DialogDescription>
            {condition.type === "allergy" ? "Allergy" : "Medical condition"} details
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
              <p className="capitalize">{condition.type}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Severity</h4>
              <p className="capitalize">{condition.severity}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
              <Badge variant={condition.isActive ? "default" : "outline"}>
                {condition.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            {condition.diagnosedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Diagnosed</h4>
                  <p>{new Date(condition.diagnosedDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>
          {condition.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="text-sm">{condition.notes}</p>
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

