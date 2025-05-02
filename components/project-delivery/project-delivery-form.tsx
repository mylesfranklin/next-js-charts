"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface ProjectDeliveryFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProjectDeliveryForm({ open, onOpenChange, onSuccess }: ProjectDeliveryFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [storeNumber, setStoreNumber] = useState("")
  const [customer, setCustomer] = useState<"BB" | "DJ" | "">("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [brkDate, setBrkDate] = useState<Date | null>(null)
  const [firstDate, setFirstDate] = useState<Date | null>(null)
  const [secondDate, setSecondDate] = useState<Date | null>(null)
  const [packageType, setPackageType] = useState<"PROJECT" | "FULL" | "RENO" | "">("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [contract, setContract] = useState<"5" | "N/A" | "">("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!storeNumber || !customer || !location || !packageType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/project-delivery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeNumber,
          customer,
          location,
          address,
          brkDate: brkDate ? format(brkDate, "yyyy-MM-dd") : null,
          firstDate: firstDate ? format(firstDate, "yyyy-MM-dd") : null,
          secondDate: secondDate ? format(secondDate, "yyyy-MM-dd") : null,
          package: packageType,
          additionalInfo,
          additionalNotes,
          contract,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create project")
      }

      toast({
        title: "Success",
        description: "Project created successfully",
      })

      // Reset form
      setStoreNumber("")
      setCustomer("")
      setLocation("")
      setAddress("")
      setBrkDate(null)
      setFirstDate(null)
      setSecondDate(null)
      setPackageType("")
      setAdditionalInfo("")
      setAdditionalNotes("")
      setContract("")

      // Close dialog
      onOpenChange(false)

      // Refresh data
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Create a new project delivery record. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeNumber">Store # *</Label>
              <Input
                id="storeNumber"
                value={storeNumber}
                onChange={(e) => setStoreNumber(e.target.value)}
                placeholder="e.g. 109R"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={customer} onValueChange={(value: "BB" | "DJ") => setCustomer(value)} required>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BB">BB</SelectItem>
                  <SelectItem value="DJ">DJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Job *</Label>
            <Textarea
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location or job description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brkDate">BRK Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !brkDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {brkDate ? format(brkDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={brkDate} onSelect={setBrkDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstDate">1st Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !firstDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {firstDate ? format(firstDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={firstDate} onSelect={setFirstDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondDate">2nd Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !secondDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {secondDate ? format(secondDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={secondDate} onSelect={setSecondDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="packageType">Package *</Label>
              <Select
                value={packageType}
                onValueChange={(value: "PROJECT" | "FULL" | "RENO") => setPackageType(value)}
                required
              >
                <SelectTrigger id="packageType">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROJECT">PROJECT</SelectItem>
                  <SelectItem value="FULL">FULL</SelectItem>
                  <SelectItem value="RENO">RENO</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contract">Contract</Label>
              <Select value={contract} onValueChange={(value: "5" | "N/A") => setContract(value)}>
                <SelectTrigger id="contract">
                  <SelectValue placeholder="Select contract" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="N/A">N/A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Info</Label>
            <Textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Enter additional information"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Enter additional notes"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
