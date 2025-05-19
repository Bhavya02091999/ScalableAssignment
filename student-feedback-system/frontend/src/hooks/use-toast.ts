import * as React from "react"

import { useToast } from "@/components/ui/use-toast"

type FormErrors = Record<string, { message?: string } | undefined>

export function useFormErrors() {
  const { toast } = useToast()

  const handleFormErrors = React.useCallback(
    (errors: FormErrors) => {
      // Show the first error in a toast
      const firstError = Object.values(errors)[0]
      if (firstError?.message) {
        toast({
          variant: "destructive",
          title: "Error",
          description: firstError.message,
        })
      }
    },
    [toast]
  )

  const handleApiError = React.useCallback(
    (error: unknown, defaultMessage = "An error occurred") => {
      const message = error instanceof Error ? error.message : defaultMessage
      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      })
    },
    [toast]
  )

  const handleSuccess = React.useCallback(
    (message: string) => {
      toast({
        title: "Success",
        description: message,
      })
    },
    [toast]
  )

  return { handleFormErrors, handleApiError, handleSuccess }
}
