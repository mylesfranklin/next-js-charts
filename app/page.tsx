import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  // Check if we're in development mode
  const isDev = process.env.NODE_ENV === "development"

  if (isDev) {
    redirect("/dev-login")
  }

  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  } else {
    redirect("/dashboard")
  }
}
