'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Plus, X, Loader2, Save, Calendar as CalendarIcon } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function CreateElectionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 1. Separate State for Dates and Times
  const [startDate, setStartDate] = useState<Date>()
  const [startTime, setStartTime] = useState("08:00") // Default 8:00 AM
  
  const [endDate, setEndDate] = useState<Date>()
  const [endTime, setEndTime] = useState("17:00") // Default 5:00 PM

  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const title = formData.get('title') as string
    const description = formData.get('description') as string

    // 2. Validation: Ensure user picked dates
    if (!startDate || !endDate) {
      setError("Please select both start and end dates.")
      setLoading(false)
      return
    }

    // 3. Combine Date + Time into ISO String for Supabase
    // Result looks like: "2025-12-09T08:00:00"
    const startIso = `${format(startDate, 'yyyy-MM-dd')}T${startTime}:00`
    const endIso = `${format(endDate, 'yyyy-MM-dd')}T${endTime}:00`

    if (new Date(startIso) >= new Date(endIso)) {
      setError("End time must be after start time.")
      setLoading(false)
      return
    }

    // 4. Send to Database
    const { data, error: insertError } = await supabase
      .from('election_sessions')
      .insert({
        title,
        description,
        start_date: startIso,
        end_date: endIso,
        status: 'draft'
      })
      .select()
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      setIsOpen(false)
      router.push(`/admin/elections/${data.id}`)
      router.refresh()
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
      >
        <Plus size={16} />
        Create New Election
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-border bg-muted">
              <h2 className="text-lg md:text-xl font-semibold text-foreground">Create New Election</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-5">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded text-sm border border-red-100 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input 
                  name="title" 
                  required 
                  placeholder="e.g. 2025 CS Council" 
                  className="w-full border border-input bg-background text-foreground rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              {/* START DATE & TIME ROW */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">Start Date & Time</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  {/* Time Picker */}
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm w-full sm:w-[130px] focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              {/* END DATE & TIME ROW */}
              <div className="space-y-1">
                <label className="block text-sm font-medium text-foreground">End Date & Time</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Date Picker */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>

                  {/* Time Picker */}
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-input bg-background text-foreground rounded-md px-3 py-2 text-sm w-full sm:w-[130px] focus:ring-2 focus:ring-green-500 outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea 
                  name="description" 
                  rows={3} 
                  className="w-full border border-input bg-background text-foreground rounded-md p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground hover:bg-accent rounded-md w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 w-full sm:w-auto"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}