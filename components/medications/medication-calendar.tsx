"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useHealth } from "@/context/health-context"
import { EnhancedCalendar } from "@/components/shared/enhanced-calendar"
import { MedicationDetails } from "@/components/medications/medication-details"
import { Pill, Calendar as CalendarIcon } from "lucide-react"
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format, isToday, isTomorrow, addDays } from "date-fns"

// Define CalendarEvent type to match what EnhancedCalendar expects
type CalendarEvent = {
  id: string
  title: string
  time: string
  type: "medication" | "appointment" | "checkup"
  status: string
  details: string
  icon: any
}

export function MedicationCalendar() {
  const { medications, medicationHistory, markMedicationTaken } = useHealth()
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  
  // Convert medications to calendar events with useMemo to avoid unnecessary re-renders
  const calendarEvents = useMemo<CalendarEvent[]>(() => {
    if (!medications || medications.length === 0) {
      return [];
    }
    
    // Create an array to hold all events
    const events: CalendarEvent[] = [];
    
    // For each medication, generate events for daily doses
    medications.forEach((med) => {
      // Get start date and end date (if exists)
      const startDate = new Date(med.startDate);
      const endDate = med.endDate ? new Date(med.endDate) : addDays(new Date(), 30); // Default to 30 days from now
      
      // Generate event for each day from start to end date
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Check if this medication has been taken on this date
        const isTaken = medicationHistory?.some(
          history => 
            history.medicationId === med.id && 
            history.date === currentDate.toISOString().split('T')[0]
        );
        
        // Create the event
        events.push({
          id: `${med.id}-${currentDate.toISOString().split('T')[0]}`,
          title: med.name,
          time: `${format(currentDate, 'MM/dd/yyyy')} ${med.reminderTime}`,
          type: "medication" as const,
          status: isTaken ? "taken" : "due",
          details: `${med.dosage} • ${med.frequency}`,
          icon: med.icon || Pill,
        });
        
        // Move to next day
        currentDate = addDays(currentDate, 1);
      }
    });
    
    return events;
  }, [medications, medicationHistory]);

  // Handle medication selection with useCallback
  const handleMedicationClick = useCallback((eventId: string) => {
    // Extract medication ID from event ID (format: "med-id-date")
    const medicationId = eventId.split('-')[0];
    setSelectedMedication(medicationId);
  }, []);
  
  // Handle date selection
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);
  
  // Get medications for today
  const todaysMedications = useMemo(() => {
    if (!medications) return [];
    
    const today = new Date();
    return medications.filter(med => {
      const startDate = new Date(med.startDate);
      const endDate = med.endDate ? new Date(med.endDate) : null;
      
      return (
        startDate <= today && 
        (!endDate || endDate >= today)
      );
    });
  }, [medications]);
  
  // Handle "Take Medication" button click
  const handleTakeMedication = useCallback((id: string) => {
    markMedicationTaken(id);
  }, [markMedicationTaken]);

  return (
    <div className="space-y-6">
      {/* Today's medications summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
            Today's Medications
          </CardTitle>
          <CardDescription>
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaysMedications.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No medications scheduled for today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysMedications.map(med => {
                const isTaken = medicationHistory?.some(
                  history => 
                    history.medicationId === med.id && 
                    history.date === new Date().toISOString().split('T')[0]
                );
                
                return (
                  <div key={med.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full p-2 bg-primary/10">
                        <med.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage} • {med.reminderTime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isTaken ? "default" : "outline"}>
                        {isTaken ? "Taken" : "Due"}
                      </Badge>
                      {!isTaken && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleTakeMedication(med.id)}
                        >
                          Take
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Calendar view */}
      <EnhancedCalendar 
        events={calendarEvents} 
        onEventClick={handleMedicationClick} 
        onDateSelect={handleDateSelect}
      />

      {/* Medication details dialog */}
      {selectedMedication && (
        <MedicationDetails 
          medicationId={selectedMedication} 
          onClose={() => setSelectedMedication(null)} 
        />
      )}
    </div>
  )
}

