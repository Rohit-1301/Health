"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash } from "lucide-react"

export function EmergencyContacts() {
  const { user, updateEmergencyContacts } = useAuth()
  const { toast } = useToast()
  const [showForm, setShowForm] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const [contacts, setContacts] = useState(user?.emergencyContacts || [])
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, relationship: value }))
  }

  const handleAddContact = () => {
    setFormData({
      name: "",
      relationship: "",
      phone: "",
      email: "",
    })
    setEditIndex(null)
    setShowForm(true)
  }

  const handleEditContact = (index: number) => {
    setFormData(contacts[index])
    setEditIndex(index)
    setShowForm(true)
  }

  const handleDeleteContact = (index: number) => {
    const newContacts = [...contacts]
    newContacts.splice(index, 1)
    setContacts(newContacts)
    updateEmergencyContacts(newContacts)
    toast({
      title: "Contact deleted",
      description: "Emergency contact has been removed.",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newContacts = [...contacts]

    if (editIndex !== null) {
      newContacts[editIndex] = formData
    } else {
      newContacts.push(formData)
    }

    setContacts(newContacts)
    updateEmergencyContacts(newContacts)
    setShowForm(false)

    toast({
      title: editIndex !== null ? "Contact updated" : "Contact added",
      description:
        editIndex !== null
          ? "Emergency contact has been updated successfully."
          : "New emergency contact has been added.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Emergency Contacts</h3>
        <Button onClick={handleAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">No emergency contacts added yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-md">
              <div>
                <h4 className="font-medium">{contact.name}</h4>
                <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                <p className="text-sm">{contact.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditContact(index)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteContact(index)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editIndex !== null ? "Edit Contact" : "Add Emergency Contact"}</DialogTitle>
            <DialogDescription>Add someone who can be contacted in case of emergency.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="relationship">Relationship</Label>
                <Select value={formData.relationship} onValueChange={handleSelectChange}>
                  <SelectTrigger id="relationship">
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

