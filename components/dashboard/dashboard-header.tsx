"use client"

import { usePathname, useRouter } from "next/navigation"
import { Bell, LogOut, Menu, Settings, UserIcon } from "lucide-react"
import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/app/actions/auth"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
}

export function DashboardHeader() {
  const { isMobile } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

          setUser({
            id: user.id,
            email: user.email || "",
            full_name: profile?.full_name || null,
            avatar_url: profile?.avatar_url || null,
          })
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [supabase])

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/dashboard/project-delivery") return "Project Delivery Schedule"
    if (pathname === "/dashboard/order-pickup") return "Order Pickup Schedule"
    if (pathname === "/dashboard/reports") return "Reports"
    if (pathname === "/dashboard/settings") return "Settings"
    return "Dashboard"
  }

  // Check if we're in development mode with bypass_auth
  const isDev = process.env.NODE_ENV === "development"
  const url = new URL(window.location.href)
  const bypassAuth = url.searchParams.get("bypass_auth") === "true"

  // Use a placeholder user for development mode
  const userInitials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : isDev && bypassAuth
      ? "DEV"
      : "U"

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
      {isMobile && (
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      )}

      <div className="flex-1">
        <h1 className="text-lg font-semibold md:text-xl">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.full_name || ""} />
                ) : (
                  <AvatarFallback>{userInitials}</AvatarFallback>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuLabel className="font-normal text-xs text-muted-foreground">
              {isDev && bypassAuth ? "dev@example.com" : user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!(isDev && bypassAuth) && (
              <DropdownMenuItem asChild>
                <form action={signOut}>
                  <button className="flex w-full items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </form>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
