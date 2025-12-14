/**
 * Example: Refactored CreateElectionModal using new utilities
 * This demonstrates best practices with useModal, validation schemas, and error handling
 */

"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Plus, X, Loader2, Save, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Import new utilities
import { useModal } from "@/hooks/use-modal";
import { CreateElectionSchema } from "@/lib/schemas";
import {
  getErrorMessage,
  logError,
  ValidationError,
} from "@/lib/error-handler";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ELECTION_STATUS,
} from "@/lib/constants";
import { z } from "zod";

export default function CreateElectionModalRefactored() {
  // Use the custom modal hook instead of useState
  const modal = useModal();
  const [loading, setLoading] = useState(false);

  // Separate state for dates and times
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("08:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("17:00");

  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;

      // Validate dates are selected
      if (!startDate || !endDate) {
        throw new ValidationError(ERROR_MESSAGES.VALIDATION_FAILED, {
          dates: "Please select both start and end dates.",
        });
      }

      // Combine date + time into ISO strings
      const startIso = `${format(startDate, "yyyy-MM-dd")}T${startTime}:00`;
      const endIso = `${format(endDate, "yyyy-MM-dd")}T${endTime}:00`;

      // Validate the input using Zod schema
      const validationResult = CreateElectionSchema.safeParse({
        title,
        description,
        start_date: startIso,
        end_date: endIso,
      });

      if (!validationResult.success) {
        const flattened = validationResult.error.flatten();
        const fieldErrors = Object.values(flattened.fieldErrors);
        const firstError = fieldErrors[0];
        const errorMessage =
          (Array.isArray(firstError) && firstError[0]) || "Validation failed";
        throw new ValidationError(
          errorMessage,
          flattened.fieldErrors as Record<string, string>
        );
      }

      // Insert into database
      const { data, error: insertError } = await supabase
        .from("election_sessions")
        .insert({
          title: validationResult.data.title,
          description: validationResult.data.description,
          start_date: validationResult.data.start_date,
          end_date: validationResult.data.end_date,
          status: ELECTION_STATUS.DRAFT,
        })
        .select()
        .single();

      if (insertError) {
        throw new Error(insertError.message);
      }

      // Success!
      toast.success(SUCCESS_MESSAGES.ELECTION_CREATED);
      modal.close();
      router.push(`/admin/elections/${data.id}`);
      router.refresh();
    } catch (error) {
      // Centralized error handling
      logError(error, { action: "create_election" });

      if (error instanceof z.ZodError) {
        const flattened = error.flatten();
        const fieldErrorsArray = Object.values(flattened.fieldErrors);
        const firstError = fieldErrorsArray[0];
        const message =
          (Array.isArray(firstError) && firstError[0]) || "Validation failed";
        toast.error(message);
      } else {
        toast.error(
          getErrorMessage(error) || ERROR_MESSAGES.ELECTION_CREATE_FAILED
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={modal.isOpen}
      onOpenChange={(open) => (open ? modal.open() : modal.close())}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs md:text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Create Election
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Election</DialogTitle>
          <DialogDescription>
            Set up a new election session with candidates and voters.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Election Title *</Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g., Student Council Election 2025"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Brief description of the election..."
              className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
              disabled={loading}
            />
          </div>

          {/* Start Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Start Time *</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* End Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                    disabled={loading}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">End Time *</Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => modal.close()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Election"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
