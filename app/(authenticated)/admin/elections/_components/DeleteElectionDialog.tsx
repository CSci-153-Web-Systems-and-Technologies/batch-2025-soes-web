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
import { Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteElectionDialogProps {
  electionId: string;
  electionTitle: string;
}

export default function DeleteElectionDialog({
  electionId,
  electionTitle,
}: DeleteElectionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDeleteElection = async () => {
    setIsLoading(true);
    try {
      // Delete the election session (cascade will handle related records)
      const { error } = await supabase
        .from("election_sessions")
        .delete()
        .eq("id", electionId);

      if (error) {
        toast.error("Failed to delete election: " + error.message);
        setIsLoading(false);
        return;
      }

      toast.success(`Election "${electionTitle}" has been deleted`);
      setOpen(false);

      // Redirect to elections list
      router.push("/admin/elections");
    } catch (error) {
      toast.error("An error occurred while deleting the election");
      console.error("Delete error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="gap-2 bg-red-600 hover:bg-red-700"
        >
          <Trash2 size={16} />
          Delete Election
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Election Session?</AlertDialogTitle>
        </AlertDialogHeader>
        <div className="space-y-3">
          <AlertDialogDescription>
            Are you sure you want to delete the election{" "}
            <strong>&quot;{electionTitle}&quot;</strong>? This will permanently
            remove:
          </AlertDialogDescription>
          <ul className="list-disc list-inside ml-1 space-y-1 text-sm text-gray-700">
            <li>All positions and candidates</li>
            <li>All registered voters</li>
            <li>All votes cast</li>
            <li>All election data and history</li>
          </ul>
          <div className="font-medium text-red-600 text-sm">
            This action cannot be undone.
          </div>
        </div>
        <div className="flex gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteElection}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Deleting...
              </>
            ) : (
              "Delete Election"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
