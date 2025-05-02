"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle, Clock, Package } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectDeliveryTable } from "@/components/project-delivery/project-delivery-table"
import { OrderPickupTable } from "@/components/order-pickup/order-pickup-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorMessage } from "@/components/ui/error-message"

type DashboardSummary = {
  totalProjects: number
  upcomingDeliveries: number
  pendingPickups: number
  completedShipments: number
}

// Default summary data for when API fails
const defaultSummary: DashboardSummary = {
  totalProjects: 5,
  upcomingDeliveries: 3,
  pendingPickups: 2,
  completedShipments: 8,
}

export function DashboardOverview() {
  const [activeTab, setActiveTab] = useState("project-delivery")
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/dashboard/summary")

        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        setSummary(data)
      } catch (err) {
        console.error("Error fetching dashboard summary:", err)
        setError(err instanceof Error ? err : new Error("An unknown error occurred"))
        // Set default summary data when API fails
        setSummary(defaultSummary)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSummary()
  }, [])

  return (
    <div className="space-y-6">
      {error && <ErrorMessage title="Warning" message="Using demo data. Some features may be limited." />}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.totalProjects || 0}</div>
                <p className="text-xs text-muted-foreground">Active projects</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deliveries</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.upcomingDeliveries || 0}</div>
                <p className="text-xs text-muted-foreground">Next 7 days</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Pickups</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.pendingPickups || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting allocation</p>
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Shipments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{summary?.completedShipments || 0}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="project-delivery" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="project-delivery">Project Delivery Schedule</TabsTrigger>
            <TabsTrigger value="order-pickup">Order Pickup Schedule</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/${activeTab}`}>
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <TabsContent value="project-delivery" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Delivery Schedule</CardTitle>
              <CardDescription>View upcoming project deliveries and their details</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectDeliveryTable limit={5} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/project-delivery">
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="order-pickup" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Pickup Schedule</CardTitle>
              <CardDescription>View upcoming order pickups and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderPickupTable limit={5} />
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/dashboard/order-pickup">
                  View All Orders <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
