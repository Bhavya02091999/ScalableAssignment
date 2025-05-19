"use client"

import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useUser } from "@/hooks/use-auth"

export default function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: string
}) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/auth/login")
      } else if (requiredRole && user.role !== requiredRole) {
        router.push("/unauthorized")
      }
    }
  }, [user, isLoading, router, requiredRole])

  if (isLoading || !user || (requiredRole && user.role !== requiredRole)) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <>{children}</>
}

export function withAuth(
  Component: React.ComponentType<any>,
  requiredRole?: string
) {
  return function WithAuthWrapper(props: any) {
    return (
      <ProtectedRoute requiredRole={requiredRole}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
