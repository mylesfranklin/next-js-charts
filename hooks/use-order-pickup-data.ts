"use client"

import { useState, useEffect, useCallback } from "react"
import type { OrderPickup } from "@/components/order-pickup/order-pickup-table"

export function useOrderPickupData() {
  const [data, setData] = useState<OrderPickup[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/order-pickup")

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const orderData = await response.json()
      setData(orderData)
      setError(null)
    } catch (err) {
      console.error("Error fetching order pickup data:", err)
      setError(err instanceof Error ? err : new Error("An unknown error occurred"))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const mutate = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, isLoading, error, mutate }
}
