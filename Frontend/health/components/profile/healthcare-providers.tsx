// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useAuth } from "@/context/auth-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { useToast } from "@/hooks/use-toast"
// import { Plus, Trash } from "lucide-react"

// export function HealthcareProviders() {
//   const { user, updateHealthcareProviders } = useAuth()
//   const { toast } = useToast()
//   const [showForm, setShowForm] = useState(false)
//   const [editIndex, setEditIndex] = useState<number | null>(null)
  
//   const [providers, setProviders] = useState(user?.healthcareProviders || [])
//   const [formData, setFormData] = useState({
//     name: "",
//     specialty: "",
//     phone: "",
//     email: "",
//     address: "",
//     notes: "",
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({ ...prev, [name]: value }))
//   }

//   const handleAddProvider = () => {
//     setFormData({
//       name: "",
//       specialty: "",
//       phone: "",
//       email: "",
//       address: "",
//       notes: "",
//     })
//     setEditIndex(null)
//     setShowForm(true)
//   }

//   const handleEditProvider = (index: number) => {
//     setFormData(providers[index])
//     setEditIndex(index)
//     setShowForm(true)
//   }

//   const handleDeleteProvider = (index: number) => {
//     const newProviders = [...providers]
//     newProviders.splice(index, 1)
//     setProviders(newProviders)
//     updateHealthcareProviders(newProviders)
//     toast({
//       title: "Provider deleted",
//       description: "Healthcare provider has been removed.",
//     })
//   }

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
    
//     const newProviders = [...providers]
    
//     if (editIndex !== null) {
//       newProviders[editIndex] = formData
//     } else {
//       newProviders.push(formData)
//     }
    
//     setProviders(newProviders)
//     updateHealthcareProviders(newProviders)
//     setShowForm(false)
    
//     toast({
//       title: editIndex !== null ? "Provider updated" : "Provider added",
//       description: editIndex !== null 
//         ? "Healthcare provider has been updated successfully." 
//         : "New healthcare provider has been added.",
//     })
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-medium">Healthcare Providers</h3>
//         <Button onClick={handleAddProvider}>
//           <Plus className="mr-2 h-4 w-4" />
//           Add Provider
//         </Button>
//       </div>
      
//       {providers.length === 0 ? (
//         <div className="text-center py-8 border rounded-md">
//           <p className="text-muted-foreground">No healthcare providers added yet</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {providers.map((provider, index) => (
//             <div key={index} className="p-4 border rounded-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h4 className="font-medium">{provider.name}</h4>
//                   <p className="text-sm text-muted-foreground">{provider.specialty}</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={() => handleEditProvider(index)}>
//                     Edit
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={() => handleDeleteProvider(index)}>
//                     <Trash className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//               <div className="mt-2 grid gap-1 text-sm">
//                 {provider.phone && <p>Phone: {provider.phone}</p>}
//                 {provider.email && <p>Email: {provider.email}</p>}
//                 {provider.address && <p>Address: {provider.address}</p>}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
      
//       <Dialog open={showForm} onOpenChange={setShowForm}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>{editIndex !== null ? "Edit Provider" : "Add Healthcare Provider"}</DialogTitle>
//             <DialogDescription>
//               Add information about your doctor or healthcare provider.
//             </DialogDescription>
//           </DialogHeader>
//           <form onSubmit={handleSubmit}>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Provider Name</Label>
//                   <Input
//                     id="name\

"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";

export function HealthcareProviders() {
  const { user, updateHealthcareProviders } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [providers, setProviders] = useState(user?.healthcareProviders || []);
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProvider = () => {
    setFormData({
      name: "",
      specialty: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setEditIndex(null);
    setShowForm(true);
  };

  const handleEditProvider = (index: number) => {
    setFormData(providers[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDeleteProvider = (index: number) => {
    const newProviders = [...providers];
    newProviders.splice(index, 1);
    setProviders(newProviders);
    updateHealthcareProviders(newProviders);
    toast({
      title: "Provider deleted",
      description: "Healthcare provider has been removed.",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newProviders = [...providers];

    if (editIndex !== null) {
      newProviders[editIndex] = formData;
    } else {
      newProviders.push(formData);
    }

    setProviders(newProviders);
    updateHealthcareProviders(newProviders);
    setShowForm(false);

    toast({
      title: editIndex !== null ? "Provider updated" : "Provider added",
      description:
        editIndex !== null
          ? "Healthcare provider has been updated successfully."
          : "New healthcare provider has been added.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Healthcare Providers</h3>
        <Button onClick={handleAddProvider}>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {providers.length === 0 ? (
        <div className="text-center py-8 border rounded-md">
          <p className="text-muted-foreground">
            No healthcare providers added yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {providers.map((provider, index) => (
            <div key={index} className="p-4 border rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{provider.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {provider.specialty}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditProvider(index)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProvider(index)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 grid gap-1 text-sm">
                {provider.phone && <p>Phone: {provider.phone}</p>}
                {provider.email && <p>Email: {provider.email}</p>}
                {provider.address && <p>Address: {provider.address}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Provider" : "Add Healthcare Provider"}
            </DialogTitle>
            <DialogDescription>
              Add information about your doctor or healthcare provider.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Provider Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter provider name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty</Label>
                  <Input
                    id="specialty"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    placeholder="Enter specialty"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes"
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {editIndex !== null ? "Update" : "Add"} Provider
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}