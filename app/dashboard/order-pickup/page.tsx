import type { Metadata } from "next"
import { OrderPickupTable } from "@/components/order-pickup/order-pickup-table"

export const metadata: Metadata = {
  title: "Order Pickup Schedule | Project Delivery System",
  description: "View and manage order pickup schedules",
}

export default function OrderPickupPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">Order Pickup Schedule</h1>
      <OrderPickupTable />
    </div>
  )
}
