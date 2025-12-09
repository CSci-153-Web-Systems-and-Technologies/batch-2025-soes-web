"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  label: string
  name: string // The name attribute for the form
}

export function DateTimePicker({ label, name }: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date>()
  const [time, setTime] = React.useState("08:00") // Default to 8 AM

  // Combine Date + Time into an ISO string for the backend
  // The backend needs: "YYYY-MM-DDTHH:mm"
  const hiddenValue = React.useMemo(() => {
    if (!date) return ""
    const dateStr = format(date, "yyyy-MM-dd")
    return `${dateStr}T${time}`
  }, [date, time])

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      
      {/* 1. The Visible Inputs */}
      <div className="flex gap-2">
        
        {/* Date Picker (Shadcn) */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Time Picker (Simple styled input) */}
        <div className="relative w-[120px]">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full h-10 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-black/5 bg-transparent"
          />
          <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* 2. The Hidden Input for FormData */}
      {/* This ensures your existing handleSubmit works! */}
      <input type="hidden" name={name} value={hiddenValue} required />
    </div>
  )
}