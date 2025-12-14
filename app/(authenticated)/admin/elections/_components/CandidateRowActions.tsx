"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Trash2, Loader2, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import EditCandidateModal from "./EditCandidateModal";
import type { PositionOption, PartylistOption } from "@/types/types";

interface CandidateRowActionsProps {
  candidateId: string;
  candidateData?: {
    full_name: string;
    nickname?: string | null;
    position_id?: string;
    partylist_id?: string | null;
    platform?: string | null;
  };
  positions: PositionOption[];
  partylists: PartylistOption[];
  onDataChange?: () => void;
}

export default function CandidateRowActions({
  candidateId,
  candidateData,
  positions,
  partylists,
  onDataChange,
}: CandidateRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("candidates")
        .delete()
        .eq("id", candidateId);

      if (error) throw error;

      toast.success("Candidate has been removed.");
      router.refresh();
    } catch (error) {
      console.error("Error deleting candidate:", error);
      toast.error("Failed to delete candidate.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        {/* Edit Button */}
        {candidateData && (
          <button
            onClick={() => setIsEditModalOpen(true)}
            title="Edit Candidate"
            className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={16} />
          </button>
        )}

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isDeleting}
              title="Remove Candidate"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Trash2 size={16} />
              )}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this candidate?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                candidate from the election.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete Candidate
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Edit Candidate Modal */}
      {candidateData && (
        <EditCandidateModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          candidateId={candidateId}
          initialData={candidateData}
          positions={positions}
          partylists={partylists}
          onSuccess={() => {
            onDataChange?.();
            router.refresh();
          }}
        />
      )}
    </>
  );
}
