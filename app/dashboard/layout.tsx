import type React from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if we're in development mode and if there's a bypass query parameter
  const isDev = process.env.NODE_ENV === "development"
  const headersList = headers()
  const url = new URL(headersList.get("x-url") || "http://localhost:3000")
  const bypassAuth = url.searchParams.get("bypass_auth") === "true"

  // If we're not bypassing auth, check for a session
  if (!(isDev && bypassAuth)) {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
