"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ClearPositionsDialogProps {
  electionId: string;
}

export default function ClearPositionsDialog({
  electionId,
}: ClearPositionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleClearAll = async () => {
    setIsLoading(true);
    try {
      // First, delete all candidates for this election
      const { error: candidatesError } = await supabase
        .from("candidates")
        .delete()
        .eq("election_id", electionId);

      if (candidatesError) {
        toast.error("Failed to delete candidates: " + candidatesError.message);
        setIsLoading(false);
        return;
      }

      // Then delete all positions for this election
      const { error: positionsError } = await supabase
        .from("positions")
        .delete()
        .eq("election_id", electionId);

      if (positionsError) {
        toast.error("Failed to delete positions: " + positionsError.message);
        setIsLoading(false);
        return;
      }

      toast.success(
        "All positions and candidates have been deleted successfully"
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while clearing positions");
      console.error("Clear error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="gap-2"
          title="Clear all positions and candidates"
        >
          <Trash2 size={16} />
          Clear All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Positions</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all positions and candidates? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearAll}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? "Clearing..." : "Clear All"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
