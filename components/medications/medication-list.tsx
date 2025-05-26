"use client"

import { useState } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { MedicationDetails } from "@/components/medications/medication-details"
import { Check, Clock, MoreVertical } from "lucide-react"

interface MedicationListProps {
  type: "current" | "history"
}

export function MedicationList({ type }: MedicationListProps) {
  const { medications, markMedicationTaken, deleteMedication } = useHealth()
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)

  const filteredMedications = medications?.filter((med) => (type === "current" ? med.active : !med.active)) || []

  const handleMarkTaken = (id: string) => {
    markMedicationTaken(id)
  }

  const handleDelete = (id: string) => {
    deleteMedication(id)
  }

  const handleViewDetails = (id: string) => {
    setSelectedMedication(id)
  }

  return (
    <div className="space-y-4">
      {filteredMedications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No medications found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredMedications.map((medication) => (
            <div key={medication.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <medication.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{medication.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {medication.dosage} • {medication.frequency}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {type === "current" && (
                  <>
                    <Badge variant={medication.status === "due" ? "destructive" : "outline"}>
                      {medication.status === "due" ? (
                        <Clock className="mr-1 h-3 w-3" />
                      ) : (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {medication.status}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => handleMarkTaken(medication.id)}>
                      Take
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(medication.id)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(medication.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMedication && (
        <MedicationDetails medicationId={selectedMedication} onClose={() => setSelectedMedication(null)} />
      )}
    </div>
  )
}

