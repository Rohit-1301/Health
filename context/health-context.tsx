"use client"

import { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/context/auth-context"
import { Pill, PillIcon as Capsule, FileText, Droplet, Syringe } from "lucide-react"
import Cookies from "js-cookie"

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
  _id?: string // MongoDB ID
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
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([])
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistory[]>([])
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>([])
  const [conditions, setConditions] = useState<Condition[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [insights, setInsights] = useState<Insights | null>(null)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Helper function for medication icons - memoize to prevent unnecessary re-creation
  const getIconForType = useCallback((type: string) => {
    switch (type) {
      case "pill":
        return Pill;
      case "capsule":
        return Capsule;
      case "liquid":
        return Droplet;
      case "injection":
        return Syringe;
      default:
        return Pill;
    }
  }, []);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData(MOCK_DASHBOARD_DATA)
    }, 500)
  }, []);

  // Fetch medications
  const fetchMedications = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Fetch medications from API
      const response = await fetch('http://localhost:5000/api/medications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      
      const data = await response.json();
      
      // Transform API data to match our frontend format
      const transformedMedications = data.map((med: any) => ({
        id: med._id,
        name: med.name,
        dosage: med.dosage,
        frequency: med.frequency,
        type: med.type,
        instructions: med.instructions,
        startDate: med.startDate,
        endDate: med.endDate,
        reminderTime: med.reminderTime,
        status: med.status,
        active: med.active,
        icon: getIconForType(med.type)
      }));
      
      setMedications(transformedMedications);
      
      // Fetch medication history
      const historyResponse = await fetch('http://localhost:5000/api/medications/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        
        // Transform history data
        const transformedHistory = historyData.map((item: any) => ({
          id: item._id,
          medicationId: item.medicationId._id,
          date: item.date,
          time: item.time,
          status: item.status
        }));
        
        setMedicationHistory(transformedHistory);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch medications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, getIconForType]);

  // Fetch medications when user changes
  useEffect(() => {
    if (user) {
      fetchMedications();
    }
  }, [user, fetchMedications]);

  // Fetch health records
  const fetchHealthRecordsRef = useRef<boolean>(false);

  const fetchHealthRecords = async () => {
    if (!user) return;
    
    // Add a mechanism to avoid unnecessary fetches
    // Check if we have a pending request
    if (fetchHealthRecordsRef.current) {
      console.log("fetchHealthRecords: Fetch already in progress, skipping");
      return;
    }
    
    // Set the ref to indicate a request is in progress
    fetchHealthRecordsRef.current = true;
    
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        // Set mock data as fallback when no token
        setHealthRecords(MOCK_HEALTH_RECORDS);
        setConditions(MOCK_CONDITIONS);
        return;
      }
      
      console.log("fetchHealthRecords: Attempting to fetch records for user:", user.id);
      
      // Fetch health records from API
      const recordsResponse = await fetch('http://localhost:5000/api/health-records', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!recordsResponse.ok) {
        console.error("fetchHealthRecords: Server responded with error status:", recordsResponse.status);
        const errorText = await recordsResponse.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to fetch health records: ${recordsResponse.status} ${errorText}`);
      }
      
      const recordsData = await recordsResponse.json();
      console.log("fetchHealthRecords: Received data:", recordsData);
      
      // Transform API data to match frontend format
      const transformedRecords = recordsData.map((record: any) => ({
        id: record._id,
        title: record.title,
        type: record.type,
        provider: record.provider,
        date: record.date,
        notes: record.notes,
        file: record.fileUrl ? {
          name: record.fileName,
          url: `http://localhost:5000${record.fileUrl}`,
          size: record.fileSize,
          type: record.fileType
        } : null
      }));
      
      setHealthRecords(transformedRecords);
      
      // Fetch conditions from API
      const conditionsResponse = await fetch('http://localhost:5000/api/conditions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (conditionsResponse.ok) {
        const conditionsData = await conditionsResponse.json();
        
        // Transform conditions data
        const transformedConditions = conditionsData.map((condition: any) => ({
          id: condition._id,
          name: condition.name,
          type: condition.type,
          severity: condition.severity,
          diagnosedDate: condition.diagnosedDate,
          isActive: condition.isActive,
          notes: condition.notes
        }));
        
        setConditions(transformedConditions);
      }
    } catch (error) {
      console.error("Error fetching health records:", error);
      toast({
        title: "Error",
        description: "Failed to fetch health records. Using mock data instead.",
        variant: "destructive",
      });
      
      // Set mock data for development fallback
      setHealthRecords(MOCK_HEALTH_RECORDS);
      setConditions(MOCK_CONDITIONS);
    } finally {
      setLoading(false);
      // Reset the ref to indicate request is complete
      fetchHealthRecordsRef.current = false;
    }
  };

  // Fetch appointments
  const fetchAppointmentsRef = useRef<boolean>(false);

  const fetchAppointments = async () => {
    try {
      // Only fetch if user exists
      if (!user) {
        console.log("fetchAppointments: No user logged in, skipping fetch");
        return;
      }
      
      console.log("fetchAppointments: Attempting to fetch appointments for user:", user.id);
      
      // Add a mechanism to avoid unnecessary fetches
      // Check if we have a pending request
      if (fetchAppointmentsRef.current) {
        console.log("fetchAppointments: Fetch already in progress, skipping");
        return;
      }
      
      // Set the ref to indicate a request is in progress
      fetchAppointmentsRef.current = true;
      
      const response = await fetch(`http://localhost:5000/api/appointments/${user.id}`);
      
      if (!response.ok) {
        console.error("fetchAppointments: Server responded with error status:", response.status);
        throw new Error("Failed to fetch appointments");
      }
      
      const data = await response.json();
      console.log("fetchAppointments: Received data from server:", data);
      
      // Map MongoDB data to our Appointment type
      const mappedAppointments: Appointment[] = data.map((appointment: any) => ({
        id: appointment._id, // Use MongoDB ID as our ID
        _id: appointment._id, // Keep the original MongoDB ID
        doctorName: appointment.doctorName,
        specialty: appointment.specialty,
        location: appointment.location || "",
        date: appointment.date || new Date().toISOString().split("T")[0],
        time: appointment.time || "09:00",
        duration: appointment.duration || "30",
        reason: appointment.reason || "",
        status: appointment.status || "confirmed",
        addToCalendar: appointment.addToCalendar || false,
        setReminder: appointment.setReminder || false,
      }));
      
      console.log("fetchAppointments: Mapped appointments:", mappedAppointments);
      
      // Compare to prevent unnecessary state updates
      const currentIds = appointments.map(a => a.id).sort().join(',');
      const newIds = mappedAppointments.map(a => a.id).sort().join(',');
      
      if (currentIds !== newIds) {
        console.log("fetchAppointments: Updating appointments state with new data");
        setAppointments(mappedAppointments);
      } else {
        console.log("fetchAppointments: No change in appointments, skipping state update");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive",
      });
      
      // Fall back to mock data in case of error
      if (appointments.length === 0) {
        console.log("fetchAppointments: Falling back to mock data");
        setAppointments(MOCK_APPOINTMENTS);
      }
    } finally {
      // Reset the ref to indicate request is complete
      fetchAppointmentsRef.current = false;
    }
  };

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
  const addMedication = useCallback(async (data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send data to API
      const response = await fetch('http://localhost:5000/api/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          type: data.type,
          instructions: data.instructions,
          startDate: data.startDate,
          endDate: data.endDate,
          reminderTime: data.reminderTime
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add medication');
      }
      
      const newMed = await response.json();
      
      // Add to state with icon
      const newMedication: Medication = {
        id: newMed._id,
        name: newMed.name,
        dosage: newMed.dosage,
        frequency: newMed.frequency,
        type: newMed.type,
        instructions: newMed.instructions,
        startDate: newMed.startDate,
        endDate: newMed.endDate,
        reminderTime: newMed.reminderTime,
        status: newMed.status,
        active: newMed.active,
        icon: getIconForType(newMed.type)
      };
      
      setMedications(prev => [...prev, newMedication]);
      
      toast({
        title: "Medication added",
        description: `${data.name} has been added to your medications.`,
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, getIconForType]);

  // Update medication
  const updateMedication = async (id: string, data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send update to API
      const response = await fetch(`http://localhost:5000/api/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          dosage: data.dosage,
          frequency: data.frequency,
          type: data.type,
          instructions: data.instructions,
          startDate: data.startDate,
          endDate: data.endDate,
          reminderTime: data.reminderTime
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update medication');
      }
      
      const updatedMed = await response.json();
      
      // Update in state with icon
      setMedications(prev => prev.map(med => 
        med.id === id 
          ? {
              ...updatedMed,
              id: updatedMed._id,
              icon: getIconForType(updatedMed.type)
            } 
          : med
      ));
      
      toast({
        title: "Medication updated",
        description: `${data.name} has been updated.`,
      });
    } catch (error) {
      console.error("Error updating medication:", error);
      toast({
        title: "Error",
        description: "Failed to update medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete medication
  const deleteMedication = async (id: string) => {
    try {
      const medication = medications.find(med => med.id === id);
      
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send delete request to API
      const response = await fetch(`http://localhost:5000/api/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete medication');
      }
      
      // Remove from state
      setMedications(prev => prev.filter(med => med.id !== id));
      
      toast({
        title: "Medication deleted",
        description: medication
          ? `${medication.name} has been removed from your medications.`
          : "Medication has been removed.",
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        title: "Error",
        description: "Failed to delete medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mark medication as taken
  const markMedicationTaken = useCallback(async (id: string) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send taken status to API
      const response = await fetch(`http://localhost:5000/api/medications/${id}/taken`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark medication as taken');
      }
      
      const data = await response.json();
      
      // Update medication in state
      setMedications(prev => prev.map(med => 
        med.id === id 
          ? { 
              ...med, 
              status: "taken" as const 
            } 
          : med
      ));
      
      // Add to history
      const newHistoryEntry: MedicationHistory = {
        id: data.history._id,
        medicationId: id,
        date: data.history.date,
        time: data.history.time,
        status: "taken",
      };
      
      setMedicationHistory(prev => [...prev, newHistoryEntry]);
      
      const medication = medications.find(med => med.id === id);
      
      toast({
        title: "Medication taken",
        description: medication ? `${medication.name} marked as taken.` : "Medication marked as taken.",
      });
    } catch (error) {
      console.error("Error marking medication as taken:", error);
      toast({
        title: "Error",
        description: "Failed to mark medication as taken. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [medications, toast]);

  // Add health record
  const addHealthRecord = async (data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        toast({
          title: "Error",
          description: "Authentication required. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("addHealthRecord: Preparing to add record with data:", {
        title: data.title,
        type: data.type,
        provider: data.provider,
        date: data.date,
        hasNotes: !!data.notes,
        hasFile: !!data.file
      });
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('provider', data.provider);
      formData.append('date', data.date);
      if (data.notes) formData.append('notes', data.notes);
      if (data.file) formData.append('file', data.file);
      
      // IMPORTANT: When sending FormData, do NOT include Content-Type header
      // The browser will automatically set the correct multipart/form-data boundary
      // Send data to API
      const response = await fetch('http://localhost:5000/api/health-records', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set 'Content-Type' here - browser sets it with boundary for FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        console.error("addHealthRecord: Server responded with error status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to add health record: ${response.status} ${errorText}`);
      }
      
      const newRecord = await response.json();
      console.log("addHealthRecord: Record added successfully:", newRecord);
      
      // Add to state
      const transformedRecord = {
        id: newRecord._id,
        title: newRecord.title,
        type: newRecord.type,
        provider: newRecord.provider,
        date: newRecord.date,
        notes: newRecord.notes,
        file: newRecord.fileUrl ? {
          name: newRecord.fileName,
          url: `http://localhost:5000${newRecord.fileUrl}`,
          size: newRecord.fileSize,
          type: newRecord.fileType
        } : null
      };
      
      setHealthRecords(prev => [...prev, transformedRecord]);
      
      toast({
        title: "Record added",
        description: `${data.title} has been added to your health records.`,
      });
      
      return transformedRecord;
    } catch (error) {
      console.error("Error adding health record:", error);
      toast({
        title: "Error",
        description: "Failed to add health record. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update health record
  const updateHealthRecord = async (id: string, data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        toast({
          title: "Error",
          description: "Authentication required. Please log in again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("updateHealthRecord: Preparing to update record:", {
        id,
        title: data.title,
        type: data.type,
        provider: data.provider,
        date: data.date,
        hasNotes: !!data.notes,
        hasFile: !!(data.file && data.file instanceof File)
      });
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('type', data.type);
      formData.append('provider', data.provider);
      formData.append('date', data.date);
      if (data.notes) formData.append('notes', data.notes);
      if (data.file && data.file instanceof File) formData.append('file', data.file);
      
      // Send update to API
      const response = await fetch(`http://localhost:5000/api/health-records/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
          // Do NOT set 'Content-Type' here - browser sets it with boundary for FormData
        },
        body: formData
      });
      
      if (!response.ok) {
        console.error("updateHealthRecord: Server responded with error status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to update health record: ${response.status} ${errorText}`);
      }
      
      const updatedRecord = await response.json();
      console.log("updateHealthRecord: Record updated successfully:", updatedRecord);
      
      // Update in state
      setHealthRecords(prev => prev.map(record => 
        record.id === id 
          ? {
              id: updatedRecord._id,
              title: updatedRecord.title,
              type: updatedRecord.type,
              provider: updatedRecord.provider,
              date: updatedRecord.date,
              notes: updatedRecord.notes,
              file: updatedRecord.fileUrl ? {
                name: updatedRecord.fileName,
                url: `http://localhost:5000${updatedRecord.fileUrl}`,
                size: updatedRecord.fileSize,
                type: updatedRecord.fileType
              } : null
            } 
          : record
      ));
      
      toast({
        title: "Record updated",
        description: `${data.title} has been updated.`,
      });
      
      return true;
    } catch (error) {
      console.error("Error updating health record:", error);
      toast({
        title: "Error",
        description: "Failed to update health record. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete health record
  const deleteHealthRecord = async (id: string) => {
    try {
      const record = healthRecords.find(rec => rec.id === id);
      
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        toast({
          title: "Error",
          description: "Authentication required. Please log in again.",
          variant: "destructive",
        });
        return false;
      }
      
      console.log("deleteHealthRecord: Attempting to delete record:", id);
      
      // Send delete request to API
      const response = await fetch(`http://localhost:5000/api/health-records/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        console.error("deleteHealthRecord: Server responded with error status:", response.status);
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to delete health record: ${response.status} ${errorText}`);
      }
      
      console.log("deleteHealthRecord: Record deleted successfully");
      
      // Remove from state
      setHealthRecords(prev => prev.filter(rec => rec.id !== id));
      
      toast({
        title: "Record deleted",
        description: record
          ? `${record.title} has been removed from your health records.`
          : "Record has been removed.",
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting health record:", error);
      toast({
        title: "Error",
        description: "Failed to delete health record. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

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
  const addCondition = async (data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send data to API
      const response = await fetch('http://localhost:5000/api/conditions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          severity: data.severity,
          diagnosedDate: data.diagnosedDate,
          isActive: data.isActive,
          notes: data.notes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add condition');
      }
      
      const newCondition = await response.json();
      
      // Add to state
      const transformedCondition = {
        id: newCondition._id,
        name: newCondition.name,
        type: newCondition.type,
        severity: newCondition.severity,
        diagnosedDate: newCondition.diagnosedDate,
        isActive: newCondition.isActive,
        notes: newCondition.notes
      };
      
      setConditions(prev => [...prev, transformedCondition]);
      
      toast({
        title: "Condition added",
        description: `${data.name} has been added to your health conditions.`,
      });
    } catch (error) {
      console.error("Error adding condition:", error);
      toast({
        title: "Error",
        description: "Failed to add condition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Update condition
  const updateCondition = async (id: string, data: any) => {
    try {
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send update to API
      const response = await fetch(`http://localhost:5000/api/conditions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: data.name,
          type: data.type,
          severity: data.severity,
          diagnosedDate: data.diagnosedDate,
          isActive: data.isActive,
          notes: data.notes
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update condition');
      }
      
      const updatedCondition = await response.json();
      
      // Update in state
      setConditions(prev => prev.map(condition => 
        condition.id === id 
          ? {
              id: updatedCondition._id,
              name: updatedCondition.name,
              type: updatedCondition.type,
              severity: updatedCondition.severity,
              diagnosedDate: updatedCondition.diagnosedDate,
              isActive: updatedCondition.isActive,
              notes: updatedCondition.notes
            } 
          : condition
      ));
      
      toast({
        title: "Condition updated",
        description: `${data.name} has been updated.`,
      });
    } catch (error) {
      console.error("Error updating condition:", error);
      toast({
        title: "Error",
        description: "Failed to update condition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete condition
  const deleteCondition = async (id: string) => {
    try {
      const condition = conditions.find(cond => cond.id === id);
      
      setLoading(true);
      
      // Get auth token from cookies
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Send delete request to API
      const response = await fetch(`http://localhost:5000/api/conditions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete condition');
      }
      
      // Remove from state
      setConditions(prev => prev.filter(cond => cond.id !== id));
      
      toast({
        title: "Condition deleted",
        description: condition
          ? `${condition.name} has been removed from your health conditions.`
          : "Condition has been removed.",
      });
    } catch (error) {
      console.error("Error deleting condition:", error);
      toast({
        title: "Error",
        description: "Failed to delete condition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add appointment
  const addAppointment = async (data: any) => {
    try {
      // Only add if user exists
      if (!user) return;
      
      const newAppointment: Appointment = {
        id: `appt-${Date.now()}`, // Temp ID that will be replaced by MongoDB's _id
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
      };
      
      // Add to local state optimistically
      setAppointments((prev) => [...prev, newAppointment]);
      
      // Send to server
      const response = await fetch(`http://localhost:5000/api/appointments/${user.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }
      
      // Get the saved appointment with proper MongoDB ID
      const savedAppointment = await response.json();
      
      // Update the state with the correct ID from MongoDB
      setAppointments((prev) => 
        prev.map((appt) => 
          appt.id === newAppointment.id ? { ...appt, id: savedAppointment._id } : appt
        )
      );
      
      toast({
        title: "Appointment scheduled",
        description: `Appointment with ${data.doctorName} has been scheduled.`,
      });
      
      // Refresh appointments to get the latest data
      fetchAppointments();
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Error",
        description: "Failed to schedule appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update appointment
  const updateAppointment = async (id: string, data: any) => {
    try {
      const appointment = appointments.find((appt) => appt.id === id || appt._id === id);
      
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      // Get the MongoDB ID
      const mongoId = appointment._id || id;
      
      // Update locally first for immediate UI feedback
      setAppointments((prev) => prev.map((appt) => 
        (appt.id === id || appt._id === id) ? { ...appt, ...data } : appt
      ));
      
      // Send to server
      const response = await fetch(`http://localhost:5000/api/appointments/${mongoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update appointment");
      }
      
      toast({
        title: "Appointment updated",
        description: `Appointment with ${data.doctorName} has been updated.`,
      });
      
      // Refresh appointments to get the latest data
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        title: "Error",
        description: "Failed to update appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Cancel appointment
  const cancelAppointment = async (id: string) => {
    try {
      const appointment = appointments.find((appt) => appt.id === id || appt._id === id);
      
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      // Get the MongoDB ID
      const mongoId = appointment._id || id;
      
      // Update locally first for immediate UI feedback
      setAppointments((prev) => 
        prev.map((appt) => (appt.id === id || appt._id === id ? { ...appt, status: "cancelled" as const } : appt))
      );
      
      // Send to server
      const response = await fetch(`http://localhost:5000/api/appointments/${mongoId}/cancel`, {
        method: "PATCH",
      });
      
      if (!response.ok) {
        throw new Error("Failed to cancel appointment");
      }
      
      toast({
        title: "Appointment cancelled",
        description: appointment
          ? `Appointment with ${appointment.doctorName} has been cancelled.`
          : "Appointment has been cancelled.",
      });
      
      // Refresh appointments to get the latest data
      fetchAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
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
  }), [
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
  ]);

  return (
    <HealthContext.Provider value={contextValue}>
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

