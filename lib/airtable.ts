import type { ProjectDelivery } from "@/components/project-delivery/project-delivery-table"
import type { OrderPickup } from "@/components/order-pickup/order-pickup-table"

// Mock data for development/preview
const mockProjectDeliveryData: ProjectDelivery[] = [
  {
    id: "rec1",
    storeNumber: "101",
    customer: "BB",
    location: "Downtown Store",
    address: "123 Main St, Anytown, USA",
    brkDate: "2024-05-15",
    firstDate: "2024-05-20",
    secondDate: "2024-05-25",
    package: "PROJECT",
    additionalInfo: "Priority project",
    additionalNotes: "Customer requested early delivery if possible",
    contract: "5",
  },
  {
    id: "rec2",
    storeNumber: "102",
    customer: "DJ",
    location: "Westside Mall",
    address: "456 West Ave, Anytown, USA",
    brkDate: "2024-05-18",
    firstDate: "2024-05-23",
    secondDate: null,
    package: "FULL",
    additionalInfo: "",
    additionalNotes: "",
    contract: "N/A",
  },
  {
    id: "rec3",
    storeNumber: "103",
    customer: "BB",
    location: "North Plaza",
    address: "789 North Blvd, Anytown, USA",
    brkDate: "2024-05-22",
    firstDate: "2024-05-27",
    secondDate: "2024-06-01",
    package: "RENO",
    additionalInfo: "Renovation project",
    additionalNotes: "Coordinate with store manager",
    contract: "5",
  },
  {
    id: "rec4",
    storeNumber: "104",
    customer: "DJ",
    location: "Eastside Center",
    address: "321 East St, Anytown, USA",
    brkDate: "2024-05-25",
    firstDate: "2024-05-30",
    secondDate: null,
    package: "PROJECT",
    additionalInfo: "",
    additionalNotes: "",
    contract: null,
  },
  {
    id: "rec5",
    storeNumber: "105",
    customer: "BB",
    location: "South Square",
    address: "654 South Ave, Anytown, USA",
    brkDate: "2024-05-28",
    firstDate: "2024-06-02",
    secondDate: "2024-06-07",
    package: "FULL",
    additionalInfo: "New store opening",
    additionalNotes: "High priority",
    contract: "5",
  },
]

// Field IDs from the Airtable schema
const FIELD_IDS = {
  STORE_NUMBER: "fldzQpjrnGDYtgA3R",
  CUSTOMER: "fldkF8mOSarAhE65X",
  LOCATION: "fld1MrdWAvr1W1vin",
  ADDRESS: "fldk3gQ9P2tbsrnVE",
  BRK_DATE: "fldhvj5P34IUbrrDD",
  FIRST_DATE: "fldSc55y974DfgyoZ",
  SECOND_DATE: "fldEIvuIgQz8TCkmx",
  PACKAGE: "fldR2kSYfrWhmtnYt",
  ADDITIONAL_INFO: "fldwKh59IdKMeEj9r",
  ADDITIONAL_NOTES: "fld2f8KA8wuT1rUpK",
  CONTRACT: "fldsqRzoTJw8IBkJb",
}

// Check if Airtable credentials are available
const areAirtableCredentialsAvailable = () => {
  const apiKey = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableId = process.env.AIRTABLE_PROJECT_DELIVERY_TABLE_ID

  return !!(apiKey && baseId && tableId)
}

// Airtable API integration
export async function fetchProjectDeliveryData(): Promise<ProjectDelivery[]> {
  try {
    // If Airtable credentials are not available, return mock data
    if (!areAirtableCredentialsAvailable()) {
      console.log("Using mock project delivery data")
      return mockProjectDeliveryData
    }

    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableId = process.env.AIRTABLE_PROJECT_DELIVERY_TABLE_ID

    if (!apiKey || !baseId || !tableId) {
      throw new Error("Missing Airtable API credentials")
    }

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}?view=Grid%20view`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return data.records.map((record: any) => ({
      id: record.id,
      storeNumber: record.fields[FIELD_IDS.STORE_NUMBER] || "",
      customer: record.fields[FIELD_IDS.CUSTOMER] || "",
      location: record.fields[FIELD_IDS.LOCATION] || "",
      address: record.fields[FIELD_IDS.ADDRESS] || "",
      brkDate: record.fields[FIELD_IDS.BRK_DATE] || null,
      firstDate: record.fields[FIELD_IDS.FIRST_DATE] || null,
      secondDate: record.fields[FIELD_IDS.SECOND_DATE] || null,
      package: record.fields[FIELD_IDS.PACKAGE] || "",
      additionalInfo: record.fields[FIELD_IDS.ADDITIONAL_INFO] || "",
      additionalNotes: record.fields[FIELD_IDS.ADDITIONAL_NOTES] || "",
      contract: record.fields[FIELD_IDS.CONTRACT] || null,
    }))
  } catch (error) {
    console.error("Error fetching project delivery data:", error)

    // Return mock data if there's an error
    console.log("Using mock project delivery data due to error")
    return mockProjectDeliveryData
  }
}

// For the Order Pickup data, we'll create a simulated version based on the Project Delivery data
// In a real implementation, you would have a separate table for Order Pickup data
export async function fetchOrderPickupData(): Promise<OrderPickup[]> {
  try {
    const projectData = await fetchProjectDeliveryData()

    // Transform project data into order pickup data
    return projectData.map((project) => {
      // Determine shipment type based on package
      let shipmentType: "BRK" | "Project" | "1st" | "2nd" | "Special Request"

      if (project.package === "PROJECT") {
        shipmentType = "Project"
      } else if (project.package === "FULL") {
        shipmentType = "1st"
      } else if (project.package === "RENO") {
        shipmentType = "2nd"
      } else {
        // Default fallback
        shipmentType = "BRK"
      }

      // Generate random status for demo purposes
      const built = Math.random() > 0.3
      const qc = built && Math.random() > 0.3
      const allocated = qc && Math.random() > 0.3
      const shipped = allocated && Math.random() > 0.3

      // Generate random shipping method
      const methods = ["SPRINTER VAN", "FLATBED", "BOX TRUCK"]
      const method = methods[Math.floor(Math.random() * methods.length)]

      // Generate random distance and cost based on method
      let distance = 0
      let cost = 0

      if (method === "SPRINTER VAN") {
        distance = Math.floor(Math.random() * 100) + 20
        cost = distance * 5 + 200
      } else if (method === "FLATBED") {
        distance = Math.floor(Math.random() * 200) + 50
        cost = distance * 8 + 400
      } else {
        distance = Math.floor(Math.random() * 150) + 30
        cost = distance * 6 + 300
      }

      return {
        id: project.id,
        storeNumber: project.storeNumber,
        location: project.location,
        shipmentType,
        pickupDate: project.brkDate,
        deliveryDate: project.firstDate,
        built,
        qc,
        allocated,
        shipped,
        method,
        distance,
        estimatedFreightCost: cost,
      }
    })
  } catch (error) {
    console.error("Error generating order pickup data:", error)
    return []
  }
}

// Function to create a new project in Airtable
export async function createProjectDelivery(project: Omit<ProjectDelivery, "id">): Promise<ProjectDelivery> {
  try {
    // If Airtable credentials are not available, return mock data with a generated ID
    if (!areAirtableCredentialsAvailable()) {
      console.log("Using mock project creation")
      const mockId = `rec${Date.now()}`
      return {
        id: mockId,
        ...project,
      }
    }

    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableId = process.env.AIRTABLE_PROJECT_DELIVERY_TABLE_ID

    if (!apiKey || !baseId || !tableId) {
      throw new Error("Missing Airtable API credentials")
    }

    // Transform the project data to Airtable format using field IDs
    const fields: Record<string, any> = {
      [FIELD_IDS.STORE_NUMBER]: project.storeNumber,
      [FIELD_IDS.CUSTOMER]: project.customer,
      [FIELD_IDS.LOCATION]: project.location,
      [FIELD_IDS.ADDRESS]: project.address,
      [FIELD_IDS.PACKAGE]: project.package,
    }

    // Only add dates if they exist
    if (project.brkDate) fields[FIELD_IDS.BRK_DATE] = project.brkDate
    if (project.firstDate) fields[FIELD_IDS.FIRST_DATE] = project.firstDate
    if (project.secondDate) fields[FIELD_IDS.SECOND_DATE] = project.secondDate

    // Add optional text fields if they exist
    if (project.additionalInfo) fields[FIELD_IDS.ADDITIONAL_INFO] = project.additionalInfo
    if (project.additionalNotes) fields[FIELD_IDS.ADDITIONAL_NOTES] = project.additionalNotes
    if (project.contract) fields[FIELD_IDS.CONTRACT] = project.contract

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ fields }],
        typecast: true, // Enable typecast to handle single select fields
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const record = data.records[0]

    return {
      id: record.id,
      storeNumber: record.fields[FIELD_IDS.STORE_NUMBER] || "",
      customer: record.fields[FIELD_IDS.CUSTOMER] || "",
      location: record.fields[FIELD_IDS.LOCATION] || "",
      address: record.fields[FIELD_IDS.ADDRESS] || "",
      brkDate: record.fields[FIELD_IDS.BRK_DATE] || null,
      firstDate: record.fields[FIELD_IDS.FIRST_DATE] || null,
      secondDate: record.fields[FIELD_IDS.SECOND_DATE] || null,
      package: record.fields[FIELD_IDS.PACKAGE] || "",
      additionalInfo: record.fields[FIELD_IDS.ADDITIONAL_INFO] || "",
      additionalNotes: record.fields[FIELD_IDS.ADDITIONAL_NOTES] || "",
      contract: record.fields[FIELD_IDS.CONTRACT] || null,
    }
  } catch (error) {
    console.error("Error creating project delivery:", error)
    throw error
  }
}

// Function to update an existing project in Airtable
export async function updateProjectDelivery(id: string, updates: Partial<ProjectDelivery>): Promise<ProjectDelivery> {
  try {
    // If Airtable credentials are not available, return mock data
    if (!areAirtableCredentialsAvailable()) {
      console.log("Using mock project update")
      const existingProjects = await fetchProjectDeliveryData()
      const projectIndex = existingProjects.findIndex((p) => p.id === id)

      if (projectIndex === -1) {
        throw new Error("Project not found")
      }

      const updatedProject = {
        ...existingProjects[projectIndex],
        ...updates,
      }

      return updatedProject
    }

    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableId = process.env.AIRTABLE_PROJECT_DELIVERY_TABLE_ID

    if (!apiKey || !baseId || !tableId) {
      throw new Error("Missing Airtable API credentials")
    }

    // Transform the updates to Airtable format using field IDs
    const fields: Record<string, any> = {}

    if (updates.storeNumber !== undefined) fields[FIELD_IDS.STORE_NUMBER] = updates.storeNumber
    if (updates.customer !== undefined) fields[FIELD_IDS.CUSTOMER] = updates.customer
    if (updates.location !== undefined) fields[FIELD_IDS.LOCATION] = updates.location
    if (updates.address !== undefined) fields[FIELD_IDS.ADDRESS] = updates.address
    if (updates.brkDate !== undefined) fields[FIELD_IDS.BRK_DATE] = updates.brkDate
    if (updates.firstDate !== undefined) fields[FIELD_IDS.FIRST_DATE] = updates.firstDate
    if (updates.secondDate !== undefined) fields[FIELD_IDS.SECOND_DATE] = updates.secondDate
    if (updates.package !== undefined) fields[FIELD_IDS.PACKAGE] = updates.package
    if (updates.additionalInfo !== undefined) fields[FIELD_IDS.ADDITIONAL_INFO] = updates.additionalInfo
    if (updates.additionalNotes !== undefined) fields[FIELD_IDS.ADDITIONAL_NOTES] = updates.additionalNotes
    if (updates.contract !== undefined) fields[FIELD_IDS.CONTRACT] = updates.contract

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [{ id, fields }],
        typecast: true, // Enable typecast to handle single select fields
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${response.status} ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    const record = data.records[0]

    return {
      id: record.id,
      storeNumber: record.fields[FIELD_IDS.STORE_NUMBER] || "",
      customer: record.fields[FIELD_IDS.CUSTOMER] || "",
      location: record.fields[FIELD_IDS.LOCATION] || "",
      address: record.fields[FIELD_IDS.ADDRESS] || "",
      brkDate: record.fields[FIELD_IDS.BRK_DATE] || null,
      firstDate: record.fields[FIELD_IDS.FIRST_DATE] || null,
      secondDate: record.fields[FIELD_IDS.SECOND_DATE] || null,
      package: record.fields[FIELD_IDS.PACKAGE] || "",
      additionalInfo: record.fields[FIELD_IDS.ADDITIONAL_INFO] || "",
      additionalNotes: record.fields[FIELD_IDS.ADDITIONAL_NOTES] || "",
      contract: record.fields[FIELD_IDS.CONTRACT] || null,
    }
  } catch (error) {
    console.error("Error updating project delivery:", error)
    throw error
  }
}

// Function to delete a project from Airtable
export async function deleteProjectDelivery(id: string): Promise<void> {
  try {
    // If Airtable credentials are not available, just return
    if (!areAirtableCredentialsAvailable()) {
      console.log("Using mock project deletion")
      return
    }

    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID
    const tableId = process.env.AIRTABLE_PROJECT_DELIVERY_TABLE_ID

    if (!apiKey || !baseId || !tableId) {
      throw new Error("Missing Airtable API credentials")
    }

    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Airtable API error: ${response.status} ${JSON.stringify(errorData)}`)
    }
  } catch (error) {
    console.error("Error deleting project delivery:", error)
    throw error
  }
}
