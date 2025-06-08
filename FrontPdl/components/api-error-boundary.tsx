"use client"

import { useState, useEffect, type ReactNode } from "react"
import { ApiUnavailable } from "@/components/api-unavailable"

interface ApiErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

export function ApiErrorBoundary({ children, fallback }: ApiErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Only catch API-related errors
      if (event.message.includes("API") || event.message.includes("fetch") || event.message.includes("network")) {
        setHasError(true)
        // Prevent the error from propagating
        event.preventDefault()
      }
    }

    window.addEventListener("error", handleError)
    return () => window.removeEventListener("error", handleError)
  }, [])

  const handleRetry = () => {
    setHasError(false)
    window.location.reload()
  }

  if (hasError) {
    return (
      fallback || (
        <ApiUnavailable
          title="Erreur de connexion"
          description="Une erreur s'est produite lors de la communication avec le serveur. Veuillez réessayer."
          onRetry={handleRetry}
        />
      )
    )
  }

  return <>{children}</>
}
