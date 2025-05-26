"use client"

import { useState, useMemo } from "react"
import { useHealth } from "@/context/health-context"
import { MedicationForm } from "@/components/medications/medication-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ChevronRight, Check, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MedicationDetailsProps {
  medicationId: string
  onClose: () => void
}

export function MedicationDetails({ medicationId, onClose }: MedicationDetailsProps) {
  const { medications, medicationHistory, markMedicationTaken, deleteMedication } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  const medication = medications?.find((med) => med.id === medicationId)

  // Get history for this medication
  const history = useMemo(() => {
    if (!medicationHistory) return [];
    
    return medicationHistory
      .filter(item => item.medicationId === medicationId)
      .sort((a, b) => {
        // Sort by date (newest first)
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB.getTime() - dateA.getTime();
      });
  }, [medicationId, medicationHistory]);

  if (!medication) {
    return null
  }

  if (showEditForm) {
    return <MedicationForm medicationId={medicationId} onClose={() => setShowEditForm(false)} />
  }
  
  // Function to handle the mark as taken action
  const handleMarkTaken = () => {
    markMedicationTaken(medicationId);
  };
  
  // Function to handle delete
  const handleDelete = () => {
    deleteMedication(medicationId);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <medication.icon className="h-5 w-5 text-primary" />
            {medication.name}
          </DialogTitle>
          <DialogDescription>Medication details and history</DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="details">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="space-y-4">
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
                <p className="capitalize">
                  <Badge variant={medication.status === "due" ? "outline" : "default"}>
                    {medication.status}
                  </Badge>
                </p>
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
                <p>{medication.instructions}</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history">
            {history.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No history found for this medication</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {history.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(item.date), 'MMMM d, yyyy')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <Badge variant={item.status === "taken" ? "default" : "outline"}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {medication.status === "due" && (
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleMarkTaken}>
              <Check className="mr-2 h-4 w-4" /> Mark as Taken
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" className="w-full sm:w-auto" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

