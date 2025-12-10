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

interface DeletePositionDialogProps {
  positionId: string;
  positionTitle: string;
}

export default function DeletePositionDialog({
  positionId,
  positionTitle,
}: DeletePositionDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDeletePosition = async () => {
    setIsDeleting(true);
    try {
      // First, delete all candidates for this position
      const { error: candidatesError } = await supabase
        .from("candidates")
        .delete()
        .eq("position_id", positionId);

      if (candidatesError) {
        console.error("Delete candidates error:", candidatesError);
        throw new Error(
          candidatesError.message || "Failed to delete candidates"
        );
      }

      // Then delete the position
      const { error: positionError } = await supabase
        .from("positions")
        .delete()
        .eq("id", positionId);

      if (positionError) {
        console.error("Delete position error:", positionError);
        throw new Error(positionError.message || "Failed to delete position");
      }

      toast.success("Position deleted successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete position";
      console.error("Error deleting position:", errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-auto"
          title="Delete position"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Position</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{positionTitle}&quot; and all
            its candidates? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-2">
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePosition}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
