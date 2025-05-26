"use client"

import { useState } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RecordDetails } from "@/components/health-records/record-details"
import { FileText, MoreVertical, Share } from "lucide-react"

export function RecordsList() {
  const { healthRecords, deleteHealthRecord, shareHealthRecord } = useHealth()
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    deleteHealthRecord(id)
  }

  const handleShare = (id: string) => {
    shareHealthRecord(id)
  }

  const handleViewDetails = (id: string) => {
    setSelectedRecord(id)
  }

  return (
    <div className="space-y-4">
      {!healthRecords || healthRecords.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No health records found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {healthRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-2 bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{record.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString()} • {record.provider}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{record.type}</Badge>
                <Button size="sm" variant="outline" onClick={() => handleShare(record.id)}>
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(record.id)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(record.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecord && <RecordDetails recordId={selectedRecord} onClose={() => setSelectedRecord(null)} />}
    </div>
  )
}

