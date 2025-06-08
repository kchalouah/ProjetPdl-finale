"use client"

import { useState, useEffect } from "react"
import { isApiAvailable } from "@/lib/api-utils"
import { AlertCircle, CheckCircle } from "lucide-react"

export function ApiStatus() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkApiStatus = async () => {
    setIsChecking(true)
    try {
      const available = await isApiAvailable()
      setIsAvailable(available)
    } catch (error) {
      setIsAvailable(false)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkApiStatus()
    // Check API status every 30 seconds
    const interval = setInterval(checkApiStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  if (isAvailable === null) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-pulse h-2 w-2 rounded-full bg-gray-400"></div>
        Vérification de la connexion...
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}>
      {isAvailable ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {isAvailable ? "API connectée" : "API non disponible - mode simulation actif"}
      {isChecking && <div className="animate-pulse h-2 w-2 rounded-full bg-current ml-1"></div>}
      {!isAvailable && (
        <button onClick={checkApiStatus} className="text-xs underline ml-2" disabled={isChecking}>
          Réessayer
        </button>
      )}
    </div>
  )
}
