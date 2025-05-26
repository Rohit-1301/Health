"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { Activity, Calendar, FileText, Home, LogOut, PieChart, Pill, Settings, User } from "lucide-react"

export function Sidebar() {
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
    <div className="hidden md:flex flex-col w-64 border-r bg-white dark:bg-gray-800">
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
    </div>
  )
}

