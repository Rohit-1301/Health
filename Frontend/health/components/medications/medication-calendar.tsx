"use client"

import { useState, useEffect } from "react"
import { useHealth } from "@/context/health-context"
import { EnhancedCalendar } from "@/components/shared/enhanced-calendar"
import { MedicationDetails } from "@/components/medications/medication-details"
import { Pill } from "lucide-react"

export function MedicationCalendar() {
  const { medications } = useHealth()
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])

  // Convert medications to calendar events
  useEffect(() => {
    if (medications) {
      const events = medications.map((med) => {
        // Create a date for the medication based on start date
        const startDate = new Date(med.startDate)

        return {
          id: med.id,
          title: med.name,
          time: `${startDate.toLocaleDateString()} ${med.reminderTime}`,
          type: "medication",
          status: med.status,
          details: `${med.dosage} • ${med.frequency}`,
          icon: med.icon || Pill,
        }
      })

      setCalendarEvents(events)
    }
  }, [medications])

  // Handle medication selection
  const handleMedicationClick = (medicationId: string) => {
    setSelectedMedication(medicationId)
  }

  return (
    <div className="space-y-4">
      <EnhancedCalendar events={calendarEvents} onEventClick={handleMedicationClick} />

      {selectedMedication && (
        <MedicationDetails medicationId={selectedMedication} onClose={() => setSelectedMedication(null)} />
      )}
    </div>
  )
}

