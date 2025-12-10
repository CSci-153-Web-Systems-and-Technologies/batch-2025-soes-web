"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface ClearPositionsDialogProps {
  electionId: string;
  positionCount: number;
}

export default function ClearPositionsDialog({
  electionId,
  positionCount,
}: ClearPositionsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (positionCount === 0) return null;

  const handleClearAllPositions = async () => {
    setIsDeleting(true);
    try {
      // First, delete all candidates for this election
      const { error: candidatesError } = await supabase
        .from("candidates")
        .delete()
        .eq("election_id", electionId);

      if (candidatesError) {
        console.error("Delete candidates error:", candidatesError);
        throw new Error(
          candidatesError.message || "Failed to delete candidates"
        );
      }

      // Then delete all positions for this election
      const { error: positionsError } = await supabase
        .from("positions")
        .delete()
        .eq("election_id", electionId);

      if (positionsError) {
        console.error("Delete positions error:", positionsError);
        throw new Error(positionsError.message || "Failed to delete positions");
      }

      toast.success("All positions cleared successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to clear positions";
      console.error("Error clearing positions:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 gap-2"
          title="Delete all positions"
        >
          <Trash2 size={16} />
          Clear All
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Clear All Positions</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete all positions and their candidates?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearAllPositions}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? "Clearing..." : "Clear All"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
