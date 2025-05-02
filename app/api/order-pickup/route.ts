import { fetchOrderPickupData } from "@/lib/airtable"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await fetchOrderPickupData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in order pickup API route:", error)
    return NextResponse.json({ error: "Failed to fetch order pickup data" }, { status: 500 })
  }
}
