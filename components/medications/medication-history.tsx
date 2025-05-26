"use client"

import { useState, useMemo } from "react"
import { useHealth } from "@/context/health-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Check, X, Clock } from "lucide-react"
import { format } from "date-fns"

export function MedicationHistory() {
  const { medications, medicationHistory } = useHealth()
  const [filter, setFilter] = useState<string>("all")
  
  // Create a combined history with medication details
  const historyWithDetails = useMemo(() => {
    if (!medicationHistory || !medications) return [];
    
    return medicationHistory.map(history => {
      const medication = medications.find(med => med.id === history.medicationId);
      
      return {
        ...history,
        medicationName: medication?.name || "Unknown Medication",
        medicationDosage: medication?.dosage || "",
        medicationType: medication?.type || "",
        date: new Date(history.date),
        formattedTime: history.time,
      };
    })
    // Sort by most recent first
    .sort((a, b) => b.date.getTime() - a.date.getTime());
    
  }, [medications, medicationHistory]);
  
  // Apply filter
  const filteredHistory = useMemo(() => {
    if (filter === "all") return historyWithDetails;
    return historyWithDetails.filter(history => history.status === filter);
  }, [historyWithDetails, filter]);
  
  // Group by date for better display
  const groupedHistory = useMemo(() => {
    const groups: Record<string, typeof filteredHistory> = {};
    
    filteredHistory.forEach(item => {
      const dateKey = item.date.toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(item);
    });
    
    return Object.entries(groups)
      .map(([dateString, items]) => ({
        date: new Date(dateString),
        items
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [filteredHistory]);

  // Status icon based on medication status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "taken":
        return <Check className="h-4 w-4 text-green-500" />;
      case "missed":
        return <X className="h-4 w-4 text-red-500" />;
      case "skipped":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };
  
  // Status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "taken":
        return <Badge variant="default" className="bg-green-500">{getStatusIcon(status)} Taken</Badge>;
      case "missed":
        return <Badge variant="destructive">{getStatusIcon(status)} Missed</Badge>;
      case "skipped":
        return <Badge variant="secondary">{getStatusIcon(status)} Skipped</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Medication History</h2>
        
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="taken">Taken</SelectItem>
            <SelectItem value="missed">Missed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {groupedHistory.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No medication history found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedHistory.map(group => (
            <div key={group.date.toISOString()} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                {format(group.date, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              <Card>
                <CardContent className="p-4 divide-y">
                  {group.items.map(item => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{item.medicationName}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.medicationDosage} • {item.formattedTime}
                          </div>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 