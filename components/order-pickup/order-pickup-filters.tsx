"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { OrderPickup } from "@/components/order-pickup/order-pickup-table"

interface OrderPickupFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<OrderPickup>
}

export function OrderPickupFilters({ open, onOpenChange, table }: OrderPickupFiltersProps) {
  const handleShipmentTypeChange = (value: string) => {
    table.getColumn("shipmentType")?.setFilterValue(value === "all" ? undefined : value)
  }

  const handleMethodChange = (value: string) => {
    table.getColumn("method")?.setFilterValue(value === "all" ? undefined : value)
  }

  const resetFilters = () => {
    table.resetColumnFilters()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Filter order pickup data by various criteria</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="shipmentType">Shipment Type</Label>
            <Select onValueChange={handleShipmentTypeChange} defaultValue="all">
              <SelectTrigger id="shipmentType">
                <SelectValue placeholder="Select shipment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BRK">BRK</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="1st">1st</SelectItem>
                <SelectItem value="2nd">2nd</SelectItem>
                <SelectItem value="Special Request">Special Request</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Shipment Method</Label>
            <Select onValueChange={handleMethodChange} defaultValue="all">
              <SelectTrigger id="method">
                <SelectValue placeholder="Select shipment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="SPRINTER VAN">SPRINTER VAN</SelectItem>
                <SelectItem value="FLATBED">FLATBED</SelectItem>
                <SelectItem value="BOX TRUCK">BOX TRUCK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={resetFilters}>
              Reset Filters
            </Button>
            <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
