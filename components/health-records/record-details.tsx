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
import { useState, useMemo } from "react"
import { Calendar, Download, Edit, FileText, Share, Trash2 } from "lucide-react"
import Cookies from 'js-cookie'

interface RecordDetailsProps {
  recordId: string
  onClose: () => void
}

export function RecordDetails({ recordId, onClose }: RecordDetailsProps) {
  const { healthRecords, shareHealthRecord, deleteHealthRecord } = useHealth()
  const [showEditForm, setShowEditForm] = useState(false)

  // Use useMemo to prevent unnecessary re-calculations of the record
  const record = useMemo(() => 
    healthRecords?.find((rec) => rec.id === recordId),
    [healthRecords, recordId]
  )

  if (!record) {
    return null
  }

  if (showEditForm) {
    return <RecordForm recordId={recordId} onClose={() => setShowEditForm(false)} />
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Handle file download
  const handleDownload = async () => {
    if (!record.file) return;
    
    try {
      // Get auth token
      const token = Cookies.get('auth-token');
      if (!token) {
        console.error("No auth token found");
        return;
      }
      
      // Create a temporary link and simulate click to download
      const link = document.createElement('a');
      link.href = record.file.url;
      link.setAttribute('download', record.file.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  
  // Handle share
  const handleShare = () => {
    shareHealthRecord(recordId);
  };
  
  // Handle delete
  const handleDelete = () => {
    deleteHealthRecord(recordId);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            {record.title}
          </DialogTitle>
          <DialogDescription>{record.type}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Date</h4>
              <p>{formatDate(record.date)}</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Healthcare Provider</h4>
            <p>{record.provider}</p>
          </div>
          {record.notes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
              <p className="text-sm">{record.notes}</p>
            </div>
          )}
          {record.file && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Attachment</h4>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{record.file.name}</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex flex-col sm:flex-row gap-2">
            {record.file && (
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowEditForm(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </div>
          <Button variant="outline" className="w-full sm:w-auto text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

