import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">403</h1>
        <h2 className="text-2xl font-semibold">Unauthorized Access</h2>
        <p className="text-muted-foreground">
          You don&apos;t have permission to access this page.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <span>Return to Dashboard</span>
        </Link>
      </Button>
    </div>
  )
}
