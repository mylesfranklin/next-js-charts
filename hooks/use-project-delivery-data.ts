"use client"

import { useState, useEffect, useCallback } from "react"
import type { ProjectDelivery } from "@/components/project-delivery/project-delivery-table"

export function useProjectDeliveryData() {
  const [data, setData] = useState<ProjectDelivery[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/project-delivery")

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const projectData = await response.json()
      setData(projectData)
      setError(null)
    } catch (err) {
      console.error("Error fetching project delivery data:", err)
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
