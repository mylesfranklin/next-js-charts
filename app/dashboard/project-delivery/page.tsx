import type { Metadata } from "next"
import { ProjectDeliveryTable } from "@/components/project-delivery/project-delivery-table"

export const metadata: Metadata = {
  title: "Project Delivery Schedule | Project Delivery System",
  description: "View and manage project delivery schedules",
}

export default function ProjectDeliveryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Project Delivery Schedule</h1>
      <ProjectDeliveryTable />
    </div>
  )
}
