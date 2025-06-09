"use client"

import { useEffect, useState } from "react"

interface DropdownItem {
  id: number
  nom?: string
  prenom?: string
  numero?: string
  libelle?: string
  email?: string
  specialite?: string
}

export function useDropdownData(endpoint: string) {
  const [data, setData] = useState<DropdownItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    if (!endpoint) {
      console.warn("No endpoint provided to useDropdownData")
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log(`Fetching data from: ${endpoint}`)
      const response = await fetch(endpoint)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      console.log(`Data received from ${endpoint}:`, result)

      // Handle different response formats
      let items: DropdownItem[] = []
      if (Array.isArray(result)) {
        items = result
      } else if (result && typeof result === "object" && Array.isArray(result.data)) {
        items = result.data
      } else if (result && typeof result === "object") {
        items = [result]
      }

      setData(items)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
      setError(errorMessage)
      console.error(`Error fetching data from ${endpoint}:`, err)
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [endpoint])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    isEmpty: data.length === 0 && !loading && !error,
  }
}

// Helper function to format dropdown options
export function formatDropdownOption(
  item: DropdownItem | null | undefined,
  type: "user" | "entity" = "entity",
): string {
  if (!item) return "Select an option"

  try {
    if (type === "user") {
      // For users (medecin, infirmier, technicien, patient)
      if (item.prenom && item.nom) {
        return `${item.prenom} ${item.nom}`
      }
      if (item.nom) {
        return item.nom
      }
      if (item.email) {
        return item.email
      }
    }

    // For entities (service, bloc, chambre)
    if (item.libelle) {
      return item.libelle
    }

    if (item.numero) {
      return `Room ${item.numero}`
    }

    if (item.nom) {
      return item.nom
    }

    return `Item ${item.id}`
  } catch (error) {
    console.error("Error formatting dropdown option:", error, item)
    return `Item ${item.id || "Unknown"}`
  }
}

// Helper function to get option value
export function getDropdownValue(item: DropdownItem | null | undefined): string {
  if (!item || !item.id) return ""
  return item.id.toString()
}
