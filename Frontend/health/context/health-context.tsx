"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { Pill, PillIcon as Capsule, FileText } from "lucide-react"

// Types
type Medication = {
  id: string
  name: string
  dosage: string
  frequency: string
  type: string
  instructions?: string
  startDate: string
  endDate?: string
  reminderTime: string
  status: "due" | "taken" | "missed"
  active: boolean
  icon: any // Lucide icon component
}

type MedicationHistory = {
  id: string
  medicationId: string
  date: string
  time: string
  status: "taken" | "missed" | "skipped"
}

type HealthRecord = {
  id: string
  title: string
  type: string
  provider: string
  date: string
  notes?: string
  file: any // File object or URL
}

type Condition = {
  id: string
  name: string
  type: string
  severity: string
  diagnosedDate?: string
  isActive: boolean
  notes?: string
}

type Appointment = {
  id: string
  doctorName: string
  specialty: string
  location: string
  date: string
  time: string
  duration: string
  reason?: string
  status: "confirmed" | "pending" | "cancelled" | "completed"
  addToCalendar: boolean
  setReminder: boolean
}

type DashboardData = {
  heartRate: string
  bloodPressure: string
  weight: string
  temperature: string
  recentActivities: any[]
  upcomingReminders: any[]
}

type Insights = {
  medicationAdherence: {
    overall: number
    weekly: number[]
    byMedication: { name: string; adherence: number }[]
  }
  healthTrends: {
    bloodPressure: { date: string; value: string }[]
    weight: { date: string; value: number }[]
    heartRate: { date: string; value: number }[]
  }
  healthRisks: {
    id: string
    name: string
    score: number
    description: string
    severity: string
  }[]
  recommendations: {
    id: string
    category: string
    title: string
    description: string
    priority: string
    icon: any
  }[]
}

type HealthContextType = {
  medications: Medication[]
  medicationHistory: MedicationHistory[]
  healthRecords: HealthRecord[]
  conditions: Condition[]
  appointments: Appointment[]
  dashboardData: DashboardData | null
  insights: Insights | null
  fetchDashboardData: () => void
  fetchMedications: () => void
  fetchHealthRecords: () => void
  fetchAppointments: () => void
  fetchInsights: () => void
  addMedication: (data: any) => void
  updateMedication: (id: string, data: any) => void
  deleteMedication: (id: string) => void
  markMedicationTaken: (id: string) => void
  addHealthRecord: (data: any) => void
  updateHealthRecord: (id: string, data: any) => void
  deleteHealthRecord: (id: string) => void
  shareHealthRecord: (id: string) => void
  addCondition: (data: any) => void
  updateCondition: (id: string, data: any) => void
  deleteCondition: (id: string) => void
  addAppointment: (data: any) => void
  updateAppointment: (id: string, data: any) => void
  cancelAppointment: (id: string) => void
}

// Create context
const HealthContext = createContext<HealthContextType | undefined>(undefined)

// Mock data for demo purposes
const MOCK_MEDICATIONS: Medication[] = [
  {
    id: "med-1",
    name: "Aspirin",
    dosage: "100mg",
    frequency: "daily",
    type: "pill",
    instructions: "Take with food",
    startDate: "2023-03-01",
    reminderTime: "08:00",
    status: "taken",
    active: true,
    icon: Pill,
  },
  {
    id: "med-2",
    name: "Vitamin D",
    dosage: "1000 IU",
    frequency: "daily",
    type: "capsule",
    startDate: "2023-02-15",
    reminderTime: "09:00",
    status: "due",
    active: true,
    icon: Capsule,
  },
  {
    id: "med-3",
    name: "Antibiotic",
    dosage: "500mg",
    frequency: "twice-daily",
    type: "pill",
    instructions: "Take until finished",
    startDate: "2023-03-10",
    endDate: "2023-03-20",
    reminderTime: "08:00",
    status: "due",
    active: true,
    icon: Pill,
  },
]

const MOCK_MEDICATION_HISTORY: MedicationHistory[] = [
  {
    id: "hist-1",
    medicationId: "med-1",
    date: "2023-03-15",
    time: "08:05",
    status: "taken",
  },
  {
    id: "hist-2",
    medicationId: "med-2",
    date: "2023-03-15",
    time: "09:10",
    status: "taken",
  },
  {
    id: "hist-3",
    medicationId: "med-1",
    date: "2023-03-14",
    time: "08:00",
    status: "taken",
  },
]

const MOCK_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: "rec-1",
    title: "Annual Physical Results",
    type: "lab-result",
    provider: "Dr. Smith",
    date: "2023-02-15",
    notes: "All results within normal range",
    file: null,
  },
  {
    id: "rec-2",
    title: "Chest X-Ray",
    type: "imaging",
    provider: "City Hospital",
    date: "2023-01-10",
    file: null,
  },
  {
    id: "rec-3",
    title: "Vaccination Record",
    type: "vaccination",
    provider: "Community Clinic",
    date: "2023-03-05",
    notes: "COVID-19 booster",
    file: null,
  },
]

const MOCK_CONDITIONS: Condition[] = [
  {
    id: "cond-1",
    name: "Hypertension",
    type: "condition",
    severity: "moderate",
    diagnosedDate: "2022-05-10",
    isActive: true,
    notes: "Controlled with medication",
  },
  {
    id: "cond-2",
    name: "Peanut Allergy",
    type: "allergy",
    severity: "severe",
    isActive: true,
    notes: "Carry EpiPen at all times",
  },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    doctorName: "Dr. Smith",
    specialty: "Primary Care",
    location: "123 Medical Center",
    date: "2023-04-15",
    time: "10:00",
    duration: "30",
    reason: "Annual checkup",
    status: "confirmed",
    addToCalendar: true,
    setReminder: true,
  },
  {
    id: "appt-2",
    doctorName: "Dr. Johnson",
    specialty: "Cardiology",
    location: "Heart Health Clinic",
    date: "2023-04-22",
    time: "14:30",
    duration: "45",
    reason: "Follow-up appointment",
    status: "confirmed",
    addToCalendar: true,
    setReminder: true,
  },
  {
    id: "appt-3",
    doctorName: "Dr. Williams",
    specialty: "Dermatology",
    location: "Skin Care Center",
    date: "2023-03-10",
    time: "09:15",
    duration: "30",
    status: "completed",
    addToCalendar: false,
    setReminder: false,
  },
]

const MOCK_DASHBOARD_DATA: DashboardData = {
  heartRate: "75",
  bloodPressure: "120/80",
  weight: "70",
  temperature: "36.6",
  recentActivities: [
    {
      id: "1",
      type: "medication",
      title: "Took Aspirin",
      time: "Today, 8:00 AM",
      icon: Pill,
    },
    {
      id: "2",
      type: "appointment",
      title: "Dr. Smith Appointment",
      time: "Yesterday, 2:30 PM",
      icon: FileText,
    },
  ],
  upcomingReminders: [
    {
      id: "1",
      type: "medication",
      title: "Take Aspirin",
      time: "Today, 8:00 PM",
      icon: Pill,
    },
    {
      id: "2",
      type: "medication",
      title: "Take Vitamin D",
      time: "Tomorrow, 9:00 AM",
      icon: Pill,
    },
  ],
}

// Provider component
export function HealthProvider({ children }: { children: ReactNode }) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [insights, setInsights] = useState<Insights | null>(null)
  const { toast } = useToast()

  // Fetch dashboard data
  const fetchDashboardData = () => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA)
    }, 500)
  }

  // Fetch medications
  const fetchMedications = () => {
    // Simulate API call
    setTimeout(() => {
      setMedications(MOCK_MEDICATIONS)
      setMedicationHistory(MOCK_MEDICATION_HISTORY)
    }, 500)
  }

  // Fetch health records
  const fetchHealthRecords = () => {
    // Simulate API call
    setTimeout(() => {
      setHealthRecords(MOCK_HEALTH_RECORDS)
      setConditions(MOCK_CONDITIONS)
    }, 500)
  }

  // Fetch appointments
  const fetchAppointments = () => {
    // Simulate API call
    setTimeout(() => {
      setAppointments(MOCK_APPOINTMENTS)
    }, 500)
  }

  // Fetch insights
  const fetchInsights = () => {
    // Simulate API call
    setTimeout(() => {
      setInsights({
        medicationAdherence: {
          overall: 85,
          weekly: [90, 100, 80, 70, 85, 90, 80],
          byMedication: [
            { name: "Aspirin", adherence: 95 },
            { name: "Vitamin D", adherence: 80 },
            { name: "Antibiotic", adherence: 70 },
          ],
        },
        healthTrends: {
          bloodPressure: [
            { date: "2023-03-01", value: "120/80" },
            { date: "2023-03-08", value: "118/78" },
            { date: "2023-03-15", value: "122/82" },
            { date: "2023-03-22", value: "119/79" },
            { date: "2023-03-29", value: "121/81" },
          ],
          weight: [
            { date: "2023-03-01", value: 68 },
            { date: "2023-03-08", value: 67.5 },
            { date: "2023-03-15", value: 67.8 },
            { date: "2023-03-22", value: 67.2 },
            { date: "2023-03-29", value: 67 },
          ],
          heartRate: [
            { date: "2023-03-01", value: 72 },
            { date: "2023-03-08", value: 75 },
            { date: "2023-03-15", value: 70 },
            { date: "2023-03-22", value: 73 },
            { date: "2023-03-29", value: 71 },
          ],
        },
        healthRisks: [
          {
            id: "1",
            name: "Hypertension Risk",
            score: 35,
            description: "Based on your blood pressure readings and family history",
            severity: "low",
          },
          {
            id: "2",
            name: "Medication Interaction Risk",
            score: 15,
            description: "Your current medications have minimal interaction potential",
            severity: "low",
          },
        ],
        recommendations: [
          {
            id: "1",
            category: "exercise",
            title: "Increase Physical Activity",
            description: "Based on your heart rate patterns, we recommend increasing your daily physical activity.",
            priority: "high",
            icon: FileText,
          },
          {
            id: "2",
            category: "nutrition",
            title: "Improve Vitamin D Intake",
            description:
              "Your medication adherence for Vitamin D is lower than recommended. Consider dietary changes or better adherence.",
            priority: "medium",
            icon: FileText,
          },
        ],
      })
    }, 500)
  }

  // Add medication
  const addMedication = (data: any) => {
    const newMedication: Medication = {
      id: `med-${Date.now()}`,
      name: data.name,
      dosage: data.dosage,
      frequency: data.frequency,
      type: data.type,
      instructions: data.instructions,
      startDate: data.startDate,
      endDate: data.endDate,
      reminderTime: data.reminderTime,
      status: "due",
      active: true,
      icon: data.icon || Pill,
    }

    setMedications((prev) => [...prev, newMedication])

    toast({
      title: "Medication added",
      description: `${data.name} has been added to your medications.`,
    })
  }

  // Update medication
  const updateMedication = (id: string, data: any) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, ...data } : med)))

    toast({
      title: "Medication updated",
      description: `${data.name} has been updated.`,
    })
  }

  // Delete medication
  const deleteMedication = (id: string) => {
    const medication = medications.find((med) => med.id === id)

    setMedications((prev) => prev.filter((med) => med.id !== id))

    toast({
      title: "Medication deleted",
      description: medication
        ? `${medication.name} has been removed from your medications.`
        : "Medication has been removed.",
    })
  }

  // Mark medication as taken
  const markMedicationTaken = (id: string) => {
    setMedications((prev) => prev.map((med) => (med.id === id ? { ...med, status: "taken" as const } : med)))

    const medication = medications.find((med) => med.id === id)

    // Add to history
    const newHistoryEntry: MedicationHistory = {
      id: `hist-${Date.now()}`,
      medicationId: id,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toTimeString().split(" ")[0].substring(0, 5),
      status: "taken",
    }

    setMedicationHistory((prev) => [...prev, newHistoryEntry])

    toast({
      title: "Medication taken",
      description: medication ? `${medication.name} marked as taken.` : "Medication marked as taken.",
    })
  }

  // Add health record
  const addHealthRecord = (data: any) => {
    const newRecord: HealthRecord = {
      id: `rec-${Date.now()}`,
      title: data.title,
      type: data.type,
      provider: data.provider,
      date: data.date,
      notes: data.notes,
      file: data.file,
    }

    setHealthRecords((prev) => [...prev, newRecord])

    toast({
      title: "Record added",
      description: `${data.title} has been added to your health records.`,
    })
  }

  // Update health record
  const updateHealthRecord = (id: string, data: any) => {
    setHealthRecords((prev) => prev.map((rec) => (rec.id === id ? { ...rec, ...data } : rec)))

    toast({
      title: "Record updated",
      description: `${data.title} has been updated.`,
    })
  }

  // Delete health record
  const deleteHealthRecord = (id: string) => {
    const record = healthRecords.find((rec) => rec.id === id)

    setHealthRecords((prev) => prev.filter((rec) => rec.id !== id))

    toast({
      title: "Record deleted",
      description: record ? `${record.title} has been removed from your health records.` : "Record has been removed.",
    })
  }

  // Share health record
  const shareHealthRecord = (id: string) => {
    const record = healthRecords.find((rec) => rec.id === id)

    // In a real app, this would open a sharing dialog or generate a shareable link

    toast({
      title: "Record shared",
      description: record ? `${record.title} has been shared.` : "Record has been shared.",
    })
  }

  // Add condition
  const addCondition = (data: any) => {
    const newCondition: Condition = {
      id: `cond-${Date.now()}`,
      name: data.name,
      type: data.type,
      severity: data.severity,
      diagnosedDate: data.diagnosedDate,
      isActive: data.isActive,
      notes: data.notes,
    }

    setConditions((prev) => [...prev, newCondition])

    toast({
      title: "Condition added",
      description: `${data.name} has been added to your health conditions.`,
    })
  }

  // Update condition
  const updateCondition = (id: string, data: any) => {
    setConditions((prev) => prev.map((cond) => (cond.id === id ? { ...cond, ...data } : cond)))

    toast({
      title: "Condition updated",
      description: `${data.name} has been updated.`,
    })
  }

  // Delete condition
  const deleteCondition = (id: string) => {
    const condition = conditions.find((cond) => cond.id === id)

    setConditions((prev) => prev.filter((cond) => cond.id !== id))

    toast({
      title: "Condition deleted",
      description: condition
        ? `${condition.name} has been removed from your health conditions.`
        : "Condition has been removed.",
    })
  }

  // Add appointment
  const addAppointment = (data: any) => {
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      doctorName: data.doctorName,
      specialty: data.specialty,
      location: data.location,
      date: data.date,
      time: data.time,
      duration: data.duration,
      reason: data.reason,
      status: "confirmed",
      addToCalendar: data.addToCalendar,
      setReminder: data.setReminder,
    }

    setAppointments((prev) => [...prev, newAppointment])

    toast({
      title: "Appointment scheduled",
      description: `Appointment with ${data.doctorName} has been scheduled.`,
    })
  }

  // Update appointment
  const updateAppointment = (id: string, data: any) => {
    setAppointments((prev) => prev.map((appt) => (appt.id === id ? { ...appt, ...data } : appt)))

    toast({
      title: "Appointment updated",
      description: `Appointment with ${data.doctorName} has been updated.`,
    })
  }

  // Cancel appointment
  const cancelAppointment = (id: string) => {
    setAppointments((prev) => prev.map((appt) => (appt.id === id ? { ...appt, status: "cancelled" as const } : appt)))

    const appointment = appointments.find((appt) => appt.id === id)

    toast({
      title: "Appointment cancelled",
      description: appointment
        ? `Appointment with ${appointment.doctorName} has been cancelled.`
        : "Appointment has been cancelled.",
    })
  }

  return (
    <HealthContext.Provider
      value={{
        medications,
        medicationHistory,
        healthRecords,
        conditions,
        appointments,
        dashboardData,
        insights,
        fetchDashboardData,
        fetchMedications,
        fetchHealthRecords,
        fetchAppointments,
        fetchInsights,
        addMedication,
        updateMedication,
        deleteMedication,
        markMedicationTaken,
        addHealthRecord,
        updateHealthRecord,
        deleteHealthRecord,
        shareHealthRecord,
        addCondition,
        updateCondition,
        deleteCondition,
        addAppointment,
        updateAppointment,
        cancelAppointment,
      }}
    >
      {children}
    </HealthContext.Provider>
  )
}

// Custom hook for using the health context
export function useHealth() {
  const context = useContext(HealthContext)
  if (context === undefined) {
    throw new Error("useHealth must be used within a HealthProvider")
  }
  return context
}

