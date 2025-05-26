"use client"

import { useState } from "react"
import { useHealth } from "@/context/health-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ConditionDetails } from "@/components/health-records/condition-details"
import { AlertCircle, MoreVertical } from "lucide-react"

export function ConditionsList() {
  const { conditions, deleteCondition } = useHealth()
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    deleteCondition(id)
  }

  const handleViewDetails = (id: string) => {
    setSelectedCondition(id)
  }

  return (
    <div className="space-y-4">
      {!conditions || conditions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No conditions or allergies found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-full p-2 ${condition.type === "allergy" ? "bg-red-100 text-red-600" : "bg-primary/10 text-primary"}`}
                >
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">{condition.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {condition.diagnosedDate
                      ? `Diagnosed: ${new Date(condition.diagnosedDate).toLocaleDateString()}`
                      : "Ongoing"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={condition.type === "allergy" ? "destructive" : "outline"}>
                  {condition.type === "allergy" ? "Allergy" : "Condition"}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(condition.id)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(condition.id)}>Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCondition && (
        <ConditionDetails conditionId={selectedCondition} onClose={() => setSelectedCondition(null)} />
      )}
    </div>
  )
}

