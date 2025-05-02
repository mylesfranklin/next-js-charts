import { createProjectDelivery, fetchProjectDeliveryData } from "@/lib/airtable"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const data = await fetchProjectDeliveryData()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in project delivery API route:", error)
    return NextResponse.json({ error: "Failed to fetch project delivery data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const projectData = await req.json()
    const newProject = await createProjectDelivery(projectData)
    return NextResponse.json(newProject)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json(
      { error: "Failed to create project", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
