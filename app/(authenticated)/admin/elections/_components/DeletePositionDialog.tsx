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

interface DeletePositionDialogProps {
  positionId: string;
  positionTitle: string;
}

export default function DeletePositionDialog({
  positionId,
  positionTitle,
}: DeletePositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // First, delete all candidates for this position
      const { error: candidatesError } = await supabase
        .from("candidates")
        .delete()
        .eq("position_id", positionId);

      if (candidatesError) {
        toast.error("Failed to delete candidates: " + candidatesError.message);
        setIsLoading(false);
        return;
      }

      // Then delete the position itself
      const { error: positionError } = await supabase
        .from("positions")
        .delete()
        .eq("id", positionId);

      if (positionError) {
        toast.error("Failed to delete position: " + positionError.message);
        setIsLoading(false);
        return;
      }

      toast.success(`Position "${positionTitle}" has been deleted`);
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while deleting the position");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-green-700 hover:text-green-900 hover:bg-green-50 p-2 h-auto"
          title="Delete position"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Position</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the position{" "}
            <strong>&quot;{positionTitle}&quot;</strong>? This will also remove
            all candidates running for this position. This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-green-700 hover:bg-green-900"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
