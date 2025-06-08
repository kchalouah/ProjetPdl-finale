"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface ApiUnavailableProps {
  title?: string
  description?: string
  onRetry?: () => void
}

export function ApiUnavailable({
  title = "API non disponible",
  description = "Impossible de se connecter au serveur. Les données affichées peuvent être simulées.",
  onRetry,
}: ApiUnavailableProps) {
  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-yellow-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-yellow-700">{description}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Réessayer
          </Button>
        </CardContent>
      )}
    </Card>
  )
}
