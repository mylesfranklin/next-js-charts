import type { Metadata } from "next"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export const metadata: Metadata = {
  title: "Dashboard | Project Delivery System",
  description: "Overview of project delivery and order pickup schedules",
}

export default function DashboardPage() {
  return <DashboardOverview />
}
