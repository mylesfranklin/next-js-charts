"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DevLoginPage() {
  const router = useRouter()

  const handleBypassAuth = () => {
    router.push("/dashboard?bypass_auth=true")
  }

  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Development Mode</CardTitle>
          <CardDescription>Access the dashboard without authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This option is only available in development mode and allows you to bypass authentication to view the
            dashboard.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBypassAuth} className="w-full">
            Access Dashboard (Dev Mode)
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
