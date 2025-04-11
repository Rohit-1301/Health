"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-context"
import { Activity, Calendar, FileText, Home, LogOut, Menu, PieChart, Pill, Settings, User } from "lucide-react"

interface MobileNavProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      title: "Dashboard",
    },
    {
      href: "/dashboard/medications",
      icon: Pill,
      title: "Medications",
    },
    {
      href: "/dashboard/health-records",
      icon: FileText,
      title: "Health Records",
    },
    {
      href: "/dashboard/appointments",
      icon: Calendar,
      title: "Appointments",
    },
    {
      href: "/dashboard/insights",
      icon: PieChart,
      title: "Insights",
    },
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Profile",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      title: "Settings",
    },
  ]

  return (
    <>
      <div className="flex items-center h-16 px-4 border-b bg-white dark:bg-gray-800">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <div className="p-4 border-b">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-lg">
                <Activity className="h-6 w-6 text-primary" />
                <span>Health Tracker</span>
              </Link>
            </div>
            <div className="flex-1 py-4">
              <nav className="grid gap-1 px-2">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      pathname === route.href
                        ? "bg-primary/10 text-primary"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                    )}
                    onClick={() => onOpenChange(false)}
                  >
                    <route.icon className="h-5 w-5" />
                    {route.title}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full justify-start" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <Activity className="h-5 w-5 text-primary" />
          <span>Health Tracker</span>
        </Link>
      </div>
    </>
  )
}

