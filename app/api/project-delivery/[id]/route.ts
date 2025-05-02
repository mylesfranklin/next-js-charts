import { updateProjectDelivery, deleteProjectDelivery } from "@/lib/airtable"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const updates = await req.json()
    const updatedProject = await updateProjectDelivery(id, updates)
    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error("Error updating project:", error)
    return NextResponse.json(
      { error: "Failed to update project", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await deleteProjectDelivery(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json(
      { error: "Failed to delete project", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
