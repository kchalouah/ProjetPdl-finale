"use client"

import { useEffect, useState } from "react"

interface DropdownItem {
  id: number
  nom?: string
  prenom?: string
  numero?: string
  libelle?: string
  email?: string
}

interface DropdownDataFetcherProps {
  endpoint: string
  onDataLoaded?: (data: DropdownItem[]) => void
  onError?: (error: string) => void
}

export function DropdownDataFetcher({ endpoint, onDataLoaded, onError }: DropdownDataFetcherProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(endpoint)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`)
        }

        const data = await response.json()

        // Ensure data is an array
        const items = Array.isArray(data) ? data : []

        // Only call onDataLoaded if it's provided and is a function
        if (onDataLoaded && typeof onDataLoaded === "function") {
          onDataLoaded(items)
        }
      } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error)
        const errorMessage = error instanceof Error ? error.message : "Unknown error"

        // Only call onError if it's provided and is a function
        if (onError && typeof onError === "function") {
          onError(errorMessage)
        }

        // Only call onDataLoaded if it's provided and is a function
        if (onDataLoaded && typeof onDataLoaded === "function") {
          onDataLoaded([]) // Provide empty array as fallback
        }
      } finally {
        setLoading(false)
      }
    }

    if (endpoint) {
      fetchData()
    }
  }, [endpoint, onDataLoaded, onError])

  return null // This is a utility component, no UI
}

// Helper function to format dropdown options
export function formatDropdownOption(item: DropdownItem, type: "user" | "entity" = "entity"): string {
  if (!item) return "Unknown"

  if (type === "user") {
    if (item.nom && item.prenom) {
      return `${item.prenom} ${item.nom}`
    }
    if (item.email) {
      return item.email
    }
  }

  if (item.libelle) {
    return item.libelle
  }

  if (item.numero) {
    return `${item.numero}`
  }

  if (item.nom) {
    return item.nom
  }

  return `Item ${item.id || "Unknown"}`
}

// Hook for easier dropdown data management
export function useDropdownData(endpoint: string) {
  const [data, setData] = useState<DropdownItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!endpoint) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`)
      }

      const result = await response.json()
      const items = Array.isArray(result) ? result : []
      setData(items)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      console.error(`Error fetching data from ${endpoint}:`, err)
      setData([]) // Provide empty array as fallback
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  return { data, loading, error, refetch: fetchData }
}
