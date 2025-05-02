"use client"

import type React from "react"

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
import { ChevronDown, Filter, MoreHorizontal, Plus, Trash2 } from "lucide-react"

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
import { ProjectDeliveryDialog } from "@/components/project-delivery/project-delivery-dialog"
import { ProjectDeliveryFilters } from "@/components/project-delivery/project-delivery-filters"
import { ProjectDeliveryForm } from "@/components/project-delivery/project-delivery-form"
import { useProjectDeliveryData } from "@/hooks/use-project-delivery-data"
import { ErrorMessage } from "@/components/ui/error-message"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export type ProjectDelivery = {
  id: string
  storeNumber: string
  customer: "BB" | "DJ"
  location: string
  address: string
  brkDate: string | null
  firstDate: string | null
  secondDate: string | null
  package: "PROJECT" | "FULL" | "RENO"
  additionalInfo: string
  additionalNotes: string
  contract: string | null
}

export function ProjectDeliveryTable({ limit }: { limit?: number }) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [selectedProject, setSelectedProject] = useState<ProjectDelivery | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // Fetch data from our custom hook
  const { data, isLoading, error, mutate } = useProjectDeliveryData()

  // Define columns for the table
  const columns: ColumnDef<ProjectDelivery>[] = [
    {
      accessorKey: "storeNumber",
      header: "Store #",
      cell: ({ row }) => <div className="font-medium">{row.getValue("storeNumber")}</div>,
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const customer = row.getValue("customer") as string
        return <Badge variant="outline">{customer}</Badge>
      },
    },
    {
      accessorKey: "location",
      header: "Location/Job",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("location")}</div>,
    },
    {
      accessorKey: "brkDate",
      header: "BRK Date",
      cell: ({ row }) => {
        const date = row.getValue("brkDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "firstDate",
      header: "1st Date",
      cell: ({ row }) => {
        const date = row.getValue("firstDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "secondDate",
      header: "2nd Date",
      cell: ({ row }) => {
        const date = row.getValue("secondDate") as string | null
        return date ? new Date(date).toLocaleDateString() : "-"
      },
    },
    {
      accessorKey: "package",
      header: "Package",
      cell: ({ row }) => {
        const packageType = row.getValue("package") as string
        return (
          <Badge
            className={
              packageType === "PROJECT"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : packageType === "FULL"
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
            }
          >
            {packageType}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const project = row.original

        const handleDelete = async (e: React.MouseEvent) => {
          e.stopPropagation()

          if (!confirm("Are you sure you want to delete this project?")) {
            return
          }

          try {
            const response = await fetch(`/api/project-delivery/${project.id}`, {
              method: "DELETE",
            })

            if (!response.ok) {
              throw new Error("Failed to delete project")
            }

            toast({
              title: "Success",
              description: "Project deleted successfully",
            })

            // Refresh data
            mutate()
          } catch (error) {
            console.error("Error deleting project:", error)
            toast({
              title: "Error",
              description: "Failed to delete project",
              variant: "destructive",
            })
          }
        }

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
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedProject(project)
                  setIsDialogOpen(true)
                }}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  // Edit functionality would go here
                  toast({
                    title: "Edit",
                    description: "Edit functionality coming soon",
                  })
                }}
              >
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete project
              </DropdownMenuItem>
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
  const handleRowClick = (project: ProjectDelivery) => {
    setSelectedProject(project)
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading project delivery data...</div>
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
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Project
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
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Project
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

      {/* Project Details Dialog */}
      <ProjectDeliveryDialog project={selectedProject} open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      {/* Filters Dialog */}
      <ProjectDeliveryFilters open={isFiltersOpen} onOpenChange={setIsFiltersOpen} table={table} />

      {/* Add Project Form */}
      <ProjectDeliveryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          mutate()
          toast({
            title: "Success",
            description: "Project created successfully",
          })
        }}
      />
    </div>
  )
}
