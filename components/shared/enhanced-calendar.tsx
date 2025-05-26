"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, Clock, Pill, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: string
  title: string
  time?: string
  type: "medication" | "appointment" | "checkup"
  status?: string
  details?: string
  icon?: any
}

interface EnhancedCalendarProps {
  events: CalendarEvent[]
  onEventClick?: (eventId: string) => void
  onDateSelect?: (date: Date) => void
  initialDate?: Date
  className?: string
}

export function EnhancedCalendar({
  events = [],
  onEventClick,
  onDateSelect,
  initialDate = new Date(),
  className,
}: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [selectedDate, setSelectedDate] = useState(initialDate)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [selectedDateEvents, setSelectedDateEvents] = useState<CalendarEvent[]>([])

  // Generate calendar days for the current month view
  useEffect(() => {
    const days: Date[] = []
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    // Get the first day of the month
    const firstDay = new Date(year, month, 1)
    // Get the last day of the month
    const lastDay = new Date(year, month + 1, 0)

    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay()

    // Add days from previous month to fill the first week
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevMonthDay = new Date(year, month, 1 - i)
      days.push(prevMonthDay)
    }

    // Add all days of the current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i))
    }

    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    setCalendarDays(days)
  }, [currentDate])

  // Update selected date events when selected date changes
  useEffect(() => {
    if (selectedDate && events && events.length > 0) {
      const dateEvents = events.filter((event) => {
        try {
          // Try to safely parse the event date from the time string
          const timeString = event.time || '';
          let eventDate;
          
          // Check if time contains a date part
          if (timeString.includes(' ')) {
            // Format: "MM/DD/YYYY HH:MM"
            eventDate = new Date(timeString.split(' ')[0]);
          } else {
            // If no date in time string, event might not have proper date format
            // Skip this event to avoid parsing errors
            return false;
          }

          // Check if date is valid
          if (isNaN(eventDate.getTime())) {
            return false;
          }
          
          // Compare the dates
          return (
            eventDate.getDate() === selectedDate.getDate() &&
            eventDate.getMonth() === selectedDate.getMonth() &&
            eventDate.getFullYear() === selectedDate.getFullYear()
          );
        } catch (error) {
          console.error("Error parsing event date:", error);
          return false; // Skip events with invalid dates
        }
      });
      
      // Only update state if the events have actually changed
      // Use JSON.stringify for deep comparison of the arrays
      const currentEventsJSON = JSON.stringify(selectedDateEvents.map(e => e.id));
      const newEventsJSON = JSON.stringify(dateEvents.map(e => e.id));
      
      if (currentEventsJSON !== newEventsJSON) {
        setSelectedDateEvents(dateEvents);
      }
      
      if (onDateSelect) {
        onDateSelect(selectedDate);
      }
    } else if (selectedDateEvents.length > 0) {
      // Clear events if no events or no selected date
      setSelectedDateEvents([]);
    }
  }, [selectedDate, events, onDateSelect]);

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  // Navigate to today
  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Check if a date has events
  const hasEvents = (date: Date) => {
    if (!events || events.length === 0) return false;
    
    return events.some((event) => {
      try {
        // Try to safely parse the event date from the time string
        const timeString = event.time || '';
        let eventDate;
        
        // Check if time contains a date part
        if (timeString.includes(' ')) {
          // Format: "MM/DD/YYYY HH:MM"
          eventDate = new Date(timeString.split(' ')[0]);
        } else {
          // If no date in time string, skip this event
          return false;
        }

        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          return false;
        }
        
        // Compare the dates
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      } catch (error) {
        console.error("Error parsing event date:", error);
        return false; // Skip events with invalid dates
      }
    });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    if (!events || events.length === 0) return [];
    
    return events.filter((event) => {
      try {
        // Try to safely parse the event date from the time string
        const timeString = event.time || '';
        let eventDate;
        
        // Check if time contains a date part
        if (timeString.includes(' ')) {
          // Format: "MM/DD/YYYY HH:MM"
          eventDate = new Date(timeString.split(' ')[0]);
        } else {
          // If no date in time string, skip this event
          return false;
        }

        // Check if date is valid
        if (isNaN(eventDate.getTime())) {
          return false;
        }
        
        // Compare the dates
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      } catch (error) {
        console.error("Error parsing event date:", error);
        return false; // Skip events with invalid dates
      }
    });
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Get icon for event type
  const getEventIcon = (event: CalendarEvent) => {
    if (event.icon) return event.icon

    switch (event.type) {
      case "medication":
        return Pill
      case "appointment":
        return Clock
      default:
        return Info
    }
  }

  // Get color for event type
  const getEventColor = (event: CalendarEvent) => {
    switch (event.type) {
      case "medication":
        return "bg-blue-100 text-blue-800"
      case "appointment":
        return "bg-purple-100 text-purple-800"
      case "checkup":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Day names for the calendar header
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className={cn("space-y-4", className)}>
      {/* Calendar header with navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="rounded-lg border bg-card">
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-px border-b bg-muted">
          {dayNames.map((day) => (
            <div key={day} className="py-2 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-muted">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
            const isToday = day.toDateString() === new Date().toDateString()
            const isSelected = day.toDateString() === selectedDate?.toDateString()
            const dayEvents = getEventsForDate(day)
            const hasEvent = dayEvents.length > 0

            return (
              <button
                key={index}
                className={cn(
                  "h-14 p-2 relative flex flex-col items-center justify-start hover:bg-muted/50 transition-colors",
                  isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground",
                  isToday && "font-bold text-primary",
                  isSelected && "bg-primary/10",
                  hasEvent && "font-medium",
                )}
                onClick={() => setSelectedDate(day)}
              >
                <span
                  className={cn(
                    "text-sm",
                    isSelected &&
                      "h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center",
                  )}
                >
                  {day.getDate()}
                </span>
                {hasEvent && (
                  <div className="absolute bottom-1 flex justify-center space-x-0.5">
                    {dayEvents.length > 2 ? (
                      <Badge variant="outline" className="h-1.5 w-1.5 rounded-full p-0">
                        <span className="sr-only">{dayEvents.length} events</span>
                      </Badge>
                    ) : (
                      dayEvents.slice(0, 2).map((event, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className={cn(
                            "h-1.5 w-1.5 rounded-full p-0",
                            event.status === "taken" || event.status === "confirmed" ? "bg-primary" : "",
                          )}
                        >
                          <span className="sr-only">{event.title}</span>
                        </Badge>
                      ))
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected date events */}
      <div className="space-y-4">
        <h3 className="font-medium">{selectedDate ? formatDate(selectedDate) : "Select a date"}</h3>

        {selectedDateEvents.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No events scheduled for this day
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {selectedDateEvents.map((event) => {
              const EventIcon = getEventIcon(event)

              return (
                <Card
                  key={event.id}
                  className={cn("cursor-pointer hover:bg-muted/50 transition-colors", onEventClick && "cursor-pointer")}
                  onClick={() => onEventClick && onEventClick(event.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("rounded-full p-2", getEventColor(event))}>
                          <EventIcon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{event.title}</p>
                          {event.time && <p className="text-sm text-muted-foreground">{event.time}</p>}
                          {event.details && <p className="text-sm text-muted-foreground mt-1">{event.details}</p>}
                        </div>
                      </div>
                      {event.status && (
                        <Badge
                          variant={event.status === "taken" || event.status === "confirmed" ? "default" : "outline"}
                        >
                          {event.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

