"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ProjectDelivery } from "@/components/project-delivery/project-delivery-table"

interface ProjectDeliveryDialogProps {
  project: ProjectDelivery | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDeliveryDialog({ project, open, onOpenChange }: ProjectDeliveryDialogProps) {
  if (!project) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Project Details - Store #{project.storeNumber}
            <Badge
              className={
                project.package === "PROJECT"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : project.package === "FULL"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
              }
            >
              {project.package}
            </Badge>
          </DialogTitle>
          <DialogDescription>Detailed information about this project delivery</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Project Information</CardTitle>
              <CardDescription>Basic project details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Customer</h4>
                <p>{project.customer}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Location/Job</h4>
                <p>{project.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                <p className="whitespace-pre-line">{project.address}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Contract</h4>
                <p>{project.contract || "Not specified"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Schedule</CardTitle>
              <CardDescription>Scheduled delivery dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">BRK Date</h4>
                <p>{formatDate(project.brkDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">1st Delivery</h4>
                <p>{formatDate(project.firstDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">2nd Delivery</h4>
                <p>{formatDate(project.secondDate)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="space-y-4 py-4">
          <div>
            <h3 className="text-lg font-medium">Additional Information</h3>
            <p className="mt-2 whitespace-pre-line">
              {project.additionalInfo || "No additional information provided."}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Notes</h3>
            <p className="mt-2 whitespace-pre-line">{project.additionalNotes || "No notes available."}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
