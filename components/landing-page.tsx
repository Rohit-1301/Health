"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Activity, Calendar, Clock, FileText, PieChart, Pill } from "lucide-react"

export function LandingPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <Activity className="h-6 w-6 text-primary" />
          <span>MediBuddy</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary/5">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Your Personal Health Companion</h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Track medications, manage health records, and schedule appointments all in one place.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/register">
                    <Button size="lg" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button size="lg" variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto grid max-w-[350px] gap-6 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 bg-white shadow-sm">
                  <Pill className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Medicine Tracker</h3>
                  <p className="text-sm text-center text-gray-500">
                    Never miss a dose with reminders and medication management
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 bg-white shadow-sm">
                  <FileText className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Health Records</h3>
                  <p className="text-sm text-center text-gray-500">Store and access your medical history securely</p>
                </div>
                <div className="flex flex-col items-center space-y-2 border rounded-lg p-4 bg-white shadow-sm">
                  <Calendar className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-bold">Appointments</h3>
                  <p className="text-sm text-center text-gray-500">Schedule and manage your doctor appointments</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Key Features</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to manage your health effectively
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <Pill className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Medicine Tracker</h3>
                <p className="text-sm text-gray-500">
                  Add medications, set reminders, track dosage history, and categorize by type
                </p>
              </div>
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <FileText className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Health Records</h3>
                <p className="text-sm text-gray-500">
                  Store medical records, maintain digital records of conditions, and share securely
                </p>
              </div>
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <Calendar className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Appointment Scheduler</h3>
                <p className="text-sm text-gray-500">Schedule appointments, sync with calendars, and set reminders</p>
              </div>
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <Clock className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Notifications</h3>
                <p className="text-sm text-gray-500">
                  Customizable reminders for medications, checkups, and appointments
                </p>
              </div>
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <PieChart className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Insights & Analytics</h3>
                <p className="text-sm text-gray-500">Generate reports on medication adherence and health progress</p>
              </div>
              <div className="flex flex-col items-start space-y-2 border rounded-lg p-6 bg-white shadow-sm">
                <Activity className="h-10 w-10 text-primary" />
                <h3 className="text-xl font-bold">Health Monitoring</h3>
                <p className="text-sm text-gray-500">Track vital signs and get personalized health recommendations</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2024 Health Tracker. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

