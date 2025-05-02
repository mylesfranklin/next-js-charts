"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { OrderPickup } from "@/components/order-pickup/order-pickup-table"
import { CheckCircle, XCircle } from "lucide-react"

interface OrderPickupDialogProps {
  order: OrderPickup | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OrderPickupDialog({ order, open, onOpenChange }: OrderPickupDialogProps) {
  if (!order) return null

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not scheduled"
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "Not specified"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order Details - Store #{order.storeNumber}
            <Badge
              className={
                order.shipmentType === "BRK"
                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                  : order.shipmentType === "Project"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                    : order.shipmentType === "1st"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : order.shipmentType === "2nd"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              }
            >
              {order.shipmentType}
            </Badge>
          </DialogTitle>
          <DialogDescription>Detailed information about this order pickup</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>Basic order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Location/Job</h4>
                <p>{order.location}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Shipment Method</h4>
                <p>{order.method}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Distance (Miles)</h4>
                <p>{order.distance !== null ? `${order.distance} miles` : "Not specified"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Estimated Freight Cost</h4>
                <p>{formatCurrency(order.estimatedFreightCost)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Schedule</CardTitle>
              <CardDescription>Pickup and delivery dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Pickup Date</h4>
                <p>{formatDate(order.pickupDate)}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Delivery Date</h4>
                <p>{formatDate(order.deliveryDate)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="py-4">
          <h3 className="mb-4 text-lg font-medium">Status</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {order.built ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <p className="mt-2 text-center font-medium">Built</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {order.qc ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <p className="mt-2 text-center font-medium">Q.C.</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {order.allocated ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <p className="mt-2 text-center font-medium">Allocated</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                {order.shipped ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500" />
                )}
                <p className="mt-2 text-center font-medium">Shipped</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
