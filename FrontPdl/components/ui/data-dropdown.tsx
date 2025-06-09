"use client"

import { useDropdownData, formatDropdownOption, getDropdownValue } from "@/hooks/use-dropdown-data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataDropdownProps {
  endpoint: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  type?: "user" | "entity"
  disabled?: boolean
  className?: string
}

export function DataDropdown({
  endpoint,
  placeholder = "Select an option",
  value,
  onValueChange,
  type = "entity",
  disabled = false,
  className,
}: DataDropdownProps) {
  const { data, loading, error, refetch, isEmpty } = useDropdownData(endpoint)

  if (loading) {
    return <Skeleton className="h-10 w-full" />
  }

  if (error) {
    return (
      <div className="space-y-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load options: {error}</span>
            <Button variant="outline" size="sm" onClick={refetch} className="ml-2">
              <RefreshCw className="h-3 w-3" />
            </Button>
          </AlertDescription>
        </Alert>
        <Select disabled>
          <SelectTrigger className={className}>
            <SelectValue placeholder="Error loading options" />
          </SelectTrigger>
        </Select>
      </div>
    )
  }

  if (isEmpty) {
    return (
      <Select disabled>
        <SelectTrigger className={className}>
          <SelectValue placeholder="No options available" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {data.map((item) => (
          <SelectItem key={item.id} value={getDropdownValue(item)}>
            {formatDropdownOption(item, type)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
