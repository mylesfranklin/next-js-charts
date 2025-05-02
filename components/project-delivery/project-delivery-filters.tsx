"use client"

import type { Table } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { ProjectDelivery } from "@/components/project-delivery/project-delivery-table"

interface ProjectDeliveryFiltersProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<ProjectDelivery>
}

export function ProjectDeliveryFilters({ open, onOpenChange, table }: ProjectDeliveryFiltersProps) {
  const handleCustomerChange = (value: string) => {
    table.getColumn("customer")?.setFilterValue(value === "all" ? undefined : value)
  }

  const handlePackageChange = (value: string) => {
    table.getColumn("package")?.setFilterValue(value === "all" ? undefined : value)
  }

  const resetFilters = () => {
    table.resetColumnFilters()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Filter project delivery data by various criteria</SheetDescription>
        </SheetHeader>
        <div className="grid gap-6 py-6">
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select onValueChange={handleCustomerChange} defaultValue="all">
              <SelectTrigger id="customer">
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="BB">BB</SelectItem>
                <SelectItem value="DJ">DJ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="package">Package Type</Label>
            <Select onValueChange={handlePackageChange} defaultValue="all">
              <SelectTrigger id="package">
                <SelectValue placeholder="Select package type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="PROJECT">PROJECT</SelectItem>
                <SelectItem value="FULL">FULL</SelectItem>
                <SelectItem value="RENO">RENO</SelectItem>
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
