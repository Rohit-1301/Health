"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUp, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface RecordFormProps {
  onClose: () => void
  recordId?: string
}

export function RecordForm({ onClose, recordId }: RecordFormProps) {
  const { healthRecords, addHealthRecord, updateHealthRecord } = useHealth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const existingRecord = recordId ? healthRecords?.find((record) => record.id === recordId) : null

  const [formData, setFormData] = useState({
    title: existingRecord?.title || "",
    type: existingRecord?.type || "lab-result",
    provider: existingRecord?.provider || "",
    date: existingRecord?.date || new Date().toISOString().split("T")[0],
    notes: existingRecord?.notes || "",
    file: null as File | null,
  })

  const [existingFile, setExistingFile] = useState(existingRecord?.file || null)
  const [fileName, setFileName] = useState(existingRecord?.file?.name || "")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFormData((prev) => ({ ...prev, file: selectedFile }))
      setFileName(selectedFile.name)
      setExistingFile(null) // Clear existing file if a new one is selected
    }
  }

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, file: null }))
    setFileName("")
    setExistingFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (recordId) {
        // If updating and keeping the existing file
        const dataToSubmit = {
          ...formData,
          file: formData.file || (existingFile ? undefined : null) 
        }
        console.log("Updating health record:", recordId, dataToSubmit);
        await updateHealthRecord(recordId, dataToSubmit)
      } else {
        console.log("Adding new health record:", formData);
        await addHealthRecord(formData)
      }
      // Only close if we get here without errors
      onClose()
    } catch (error) {
      console.error("Error submitting health record:", error)
      toast({
        title: "Error",
        description: "There was a problem saving the record. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getFileSize = (size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{recordId ? "Edit Health Record" : "Add Health Record"}</DialogTitle>
          <DialogDescription>Upload and manage your medical records and test results.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Record Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Record Type</Label>
                <Select value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lab-result">Lab Result</SelectItem>
                    <SelectItem value="prescription">Prescription</SelectItem>
                    <SelectItem value="imaging">Imaging</SelectItem>
                    <SelectItem value="discharge">Discharge Summary</SelectItem>
                    <SelectItem value="vaccination">Vaccination</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Healthcare Provider</Label>
              <Input id="provider" name="provider" value={formData.provider} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Upload Document</Label>
              <div className="flex flex-col gap-2">
                <Input 
                  id="file" 
                  name="file" 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    {fileName || existingFile ? "Change File" : "Select File"}
                  </Button>
                  {(fileName || existingFile) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveFile}
                      className="h-8 w-8 text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {(fileName || existingFile) && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1 p-2 border rounded-md">
                    <FileUp className="h-4 w-4" />
                    <div className="truncate">
                      <span className="font-medium">{fileName || existingFile?.name}</span>
                      {formData.file && (
                        <span className="text-xs ml-2">({getFileSize(formData.file.size)})</span>
                      )}
                      {existingFile?.size && !formData.file && (
                        <span className="text-xs ml-2">({getFileSize(existingFile.size)})</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional information about this record"
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

