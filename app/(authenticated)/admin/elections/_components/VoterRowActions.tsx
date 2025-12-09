"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, RotateCcw, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // <--- 1. Import toast
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VoterRowActionsProps {
  voterId: string;
  hasVoted: boolean;
}

export default function VoterRowActions({ voterId, hasVoted }: VoterRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("eligible_voters")
        .delete()
        .eq("id", voterId);

      if (error) throw error;

      // 2. Success Alert
      toast.success("Voter has been removed.");
      router.refresh();

    } catch (error) {
      console.error("Error deleting voter:", error);
      // 3. Error Alert
      toast.error("Failed to delete voter. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        title="Reset Vote"
        disabled={!hasVoted}
        className={`p-1.5 rounded-md transition-colors ${
          !hasVoted 
            ? "text-gray-300 cursor-not-allowed" 
            : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
        }`}
      >
        <RotateCcw size={16} />
      </button>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button 
            disabled={isDeleting}
            title="Remove Voter"
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
          </button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this voter?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the voter 
              from the eligible list and revoke their access code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Delete Voter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}