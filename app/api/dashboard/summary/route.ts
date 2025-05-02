import { fetchProjectDeliveryData, fetchOrderPickupData } from "@/lib/airtable"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const [projectData, orderData] = await Promise.all([fetchProjectDeliveryData(), fetchOrderPickupData()])

    // Calculate upcoming deliveries (next 7 days)
    const now = new Date()
    const sevenDaysLater = new Date(now)
    sevenDaysLater.setDate(now.getDate() + 7)

    const upcomingDeliveries = projectData.filter((project) => {
      if (!project.firstDate && !project.secondDate) return false

      const firstDate = project.firstDate ? new Date(project.firstDate) : null
      const secondDate = project.secondDate ? new Date(project.secondDate) : null

      return (
        (firstDate && firstDate >= now && firstDate <= sevenDaysLater) ||
        (secondDate && secondDate >= now && secondDate <= sevenDaysLater)
      )
    })

    // Calculate pending pickups (not yet allocated)
    const pendingPickups = orderData.filter((order) => !order.allocated)

    // Calculate completed shipments (this month)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const completedShipments = orderData.filter(
      (order) => order.shipped && order.deliveryDate && new Date(order.deliveryDate) >= startOfMonth,
    )

    return NextResponse.json({
      totalProjects: projectData.length,
      upcomingDeliveries: upcomingDeliveries.length,
      pendingPickups: pendingPickups.length,
      completedShipments: completedShipments.length,
    })
  } catch (error) {
    console.error("Error in dashboard summary API route:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard summary" }, { status: 500 })
  }
}
