"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { OrderPickupDialog } from "@/components/order-pickup/order-pickup-dialog"
import { OrderPickupFilters } from "@/components/order-pickup/order-pickup-filters"
import { useOrderPickupData } from "@/hooks/use-order-pickup-data"
import { ErrorMessage } from "@/components/ui/error-message"

export type OrderPickup = {
  id: string
  storeNumber: string
  location: string
  shipmentType: "BRK" | "Project" | "1st" | "2nd" | "Special Request"
  pickupDate: string | null
  deliveryDate: string | null
  built: boolean
  qc: boolean
  allocated: boolean
  shipped: boolean
  method: "SPRINTER VAN" | "FLATBED" | "BOX TRUCK" | string
  distance: number | null
  estimatedFreightCost: number | null
}

export function OrderPickupTable({ limit }: { limit?: number }) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedOrder, setSelectedOrder] = useState<OrderPickup | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Fetch data from our custom hook
  const { data, isLoading, error } = useOrderPickupData()

  // Define columns for the table
  const columns: ColumnDef<OrderPickup>[] = [
    {
      accessorKey: "storeNumber",
      header: "Store #",
      cell: ({ row }) => <div className="font-medium">{row.getValue("storeNumber")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location/Job",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("location")}</div>,
    },
    {
      accessorKey: "shipmentType",
      header: "Shipment Type",
      cell: ({ row }) => {
        const shipmentType = row.getValue("shipmentType") as string
        return (
          <Badge
            className={
              shipmentType === "BRK"
                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                : shipmentType === "Project"
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  : shipmentType === "1st"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : shipmentType === "2nd"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }
          >
            {shipmentType}
          </Badge>
        )
      },
    },
    {
      accessorKey: "pickupDate",
      header: "Pickup Date",
      cell: ({ row }) => {
        const date = row.getValue("pickupDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery Date",
      cell: ({ row }) => {
        const date = row.getValue("deliveryDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "built",
      header: "Built",
      cell: ({ row }) => {
        const isBuilt = row.getValue("built") as boolean
        return <Checkbox checked={isBuilt} disabled />
      },
    },
    {
      accessorKey: "qc",
      header: "Q.C.",
      cell: ({ row }) => {
        const isQC = row.getValue("qc") as boolean
        return <Checkbox checked={isQC} disabled />
      },
    },
    {
      accessorKey: "allocated",
      header: "Allocated",
      cell: ({ row }) => {
        const isAllocated = row.getValue("allocated") as boolean
        return <Checkbox checked={isAllocated} disabled />
      },
    },
    {
      accessorKey: "shipped",
      header: "Shipped",
      cell: ({ row }) => {
        const isShipped = row.getValue("shipped") as boolean
        return <Checkbox checked={isShipped} disabled />
      },
    },
    {
      accessorKey: "method",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("method") as string
        return <div>{method}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const order = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedOrder(order)
                  setIsDialogOpen(true)
                }}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Edit order</DropdownMenuItem>
              <DropdownMenuItem>Update status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Create table instance
  const table = useReactTable({
    data: limit ? data.slice(0, limit) : data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  // Handle row click to open details dialog
  const handleRowClick = (order: OrderPickup) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading order pickup data...</div>
  }

  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage title="Notice" message="Using demo data. Some features may be limited." variant="default" />

        {/* Continue rendering the table with mock data */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Input
              placeholder="Filter by store #..."
              value={(table.getColumn("storeNumber")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("storeNumber")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline" size="icon" onClick={() => setIsFiltersOpen(true)}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.id !== "actions")
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Order
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <Input
            placeholder="Filter by store #..."
            value={(table.getColumn("storeNumber")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("storeNumber")?.setFilterValue(event.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon" onClick={() => setIsFiltersOpen(true)}>
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.id !== "actions")
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Order
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {!limit && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
            selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <OrderPickupDialog order={selectedOrder} open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Dialog */}
      <OrderPickupFilters open={isFiltersOpen} onOpenChange={setIsFiltersOpen} table={table} />
    </div>
  )
}
