import { MainNav } from "@/components/layout/MainNav"
import { UserNav } from "@/components/layout/UserNav"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <MainNav />
            <div className="flex flex-1 items-center justify-end space-x-4">
              <UserNav />
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </ProtectedRoute>
  )
}
