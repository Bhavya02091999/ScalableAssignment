import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6 p-4 text-center">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tighter">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Button asChild className="w-full">
        <Link href="/">
          <span>Return Home</span>
        </Link>
      </Button>
    </div>
  )
}
