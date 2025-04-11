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
import { RecordForm } from "@/components/health-records/record-form"
import { useState } from "react"
import { Calendar, Download, Edit, FileText, Share } from "lucide-react"

interface RecordDetailsProps {
  recordId: string
  onClose: () => void
}

export function RecordDetails({ recordId, onClose }: RecordDetailsProps) {
  const { healthRecords, shareHealthRecord } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  const record = healthRecords?.find((rec) => rec.id === recordId)

  if (!record) {
    return null
  }

  if (showEditForm) {
    return <RecordForm recordId={recordId} onClose={() => setShowEditForm(false)} />
  }

  const handleShare = () => {
    shareHealthRecord(recordId)
  }

  const handleDownload = () => {
    // In a real app, this would download the file
    alert("Downloading record...")
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {record.title}
          </DialogTitle>
          <DialogDescription>Health record details</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
              <p className="capitalize">{record.type.replace("-", " ")}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Provider</h4>
              <p>{record.provider}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
              <p>{new Date(record.date).toLocaleDateString()}</p>
            </div>
          </div>
          {record.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="text-sm">{record.notes}</p>
            </div>
          )}
          {record.file && (
            <div className="border rounded-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm">Document</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between gap-2">
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
          <Button onClick={() => setShowEditForm(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

