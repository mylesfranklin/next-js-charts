import type React from "react"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

const claudeThemeVars = `
  :root {
    --background: #faf9f5;
    --foreground: #3d3929;
    --card: #faf9f5;
    --card-foreground: #141413;
    --popover: #ffffff;
    --popover-foreground: #28261b;
    --primary: #c96442;
    --primary-foreground: #ffffff;
    --secondary: #e9e6dc;
    --secondary-foreground: #535146;
    --muted: #ede9de;
    --muted-foreground: #83827d;
    --accent: #e9e6dc;
    --accent-foreground: #28261b;
    --destructive: #141413;
    --destructive-foreground: #ffffff;
    --border: #dad9d4;
    --input: #b4b2a7;
    --ring: #207fde;
    --chart-1: #b05730;
    --chart-2: #9c87f5;
    --chart-3: #ded8c4;
    --chart-4: #dbd3f0;
    --chart-5: #b4552d;
    --sidebar: #f5f4ee;
    --sidebar-foreground: #3d3d3a;
    --sidebar-primary: #c96442;
    --sidebar-primary-foreground: #fbfbfb;
    --sidebar-accent: #e9e6dc;
    --sidebar-accent-foreground: #343434;
    --sidebar-border: #ebebeb;
    --sidebar-ring: #b5b5b5;
    --radius: 0.5rem;
  }
`;

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
    <>
      <style>{claudeThemeVars}</style>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <div className="flex min-h-screen flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}
