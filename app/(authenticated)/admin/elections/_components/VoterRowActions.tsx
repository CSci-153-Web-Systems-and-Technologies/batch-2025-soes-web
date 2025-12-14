"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  Trash2,
  RotateCcw,
  Loader2,
  CheckCircle,
  Mail,
  Edit2,
} from "lucide-react";
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
import EditVoterModal from "./EditVoterModal";

interface VoterRowActionsProps {
  voterId: string;
  hasVoted: boolean;
  voterEmail?: string;
  voterName?: string;
  electionId: string;
  disabled?: boolean;
  emailedAt?: string;
  voterFullName?: string;
  onDataChange?: () => void;
}

export default function VoterRowActions({
  voterId,
  hasVoted,
  voterEmail,
  voterName,
  electionId,
  disabled,
  emailedAt,
  voterFullName,
  onDataChange,
}: VoterRowActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // 1. Logic to Delete Voter
  const handleDelete = async () => {
    setIsDeleting(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("eligible_voters")
        .delete()
        .eq("id", voterId);

      if (error) throw error;

      toast.success("Voter has been removed.");
      router.refresh();
    } catch (error) {
      console.error("Error deleting voter:", error);
      toast.error("Failed to delete voter.");
    } finally {
      setIsDeleting(false);
    }
  };

  // 2. Logic to Toggle Vote Status (Reset <-> Mark Voted)
  const handleToggleStatus = async () => {
    setIsToggling(true);
    const supabase = createClient();

    // We toggle the status to the opposite of what it is now
    const newStatus = !hasVoted;

    try {
      const { error } = await supabase
        .from("eligible_voters")
        .update({ has_voted: newStatus })
        .eq("id", voterId);

      if (error) throw error;

      toast.success(
        newStatus
          ? "Voter marked as 'Voted'."
          : "Vote status reset. User can vote again."
      );
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    } finally {
      setIsToggling(false);
    }
  };

  // 3. Logic to Send Email to Individual Voter
  const handleSendEmail = async () => {
    if (!voterEmail) {
      toast.error("This voter doesn't have an email address.");
      return;
    }

    setIsSendingEmail(true);

    try {
      const response = await fetch("/api/send-voter-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId,
          voterIds: [voterId],
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.sent > 0) {
        toast.success(`Email sent successfully to ${voterName || voterEmail}!`);
      } else if (data.failed > 0) {
        toast.error(`Failed to send email to ${voterName || voterEmail}.`);
      } else {
        toast.error(data.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("An error occurred while sending email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <>
      <div className="flex justify-end gap-2">
        {/* Edit Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          disabled={disabled}
          title="Edit Voter"
          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Edit2 size={16} />
        </button>

        {/* Email Button */}
        <button
          onClick={handleSendEmail}
          disabled={isSendingEmail || disabled || !voterEmail}
          title={voterEmail ? "Send Credentials Email" : "No email address"}
          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSendingEmail ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Mail size={16} />
          )}
        </button>

        {/* Toggle Vote Status Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isToggling || disabled}
              title={hasVoted ? "Reset Vote Status" : "Mark as Voted (Manual)"}
              className={`p-1.5 rounded-md transition-colors disabled:opacity-50 ${
                hasVoted
                  ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50" // Style for Reset
                  : "text-gray-300 hover:text-green-600 hover:bg-green-50" // Style for Mark Done
              }`}
            >
              {isToggling ? (
                <Loader2 size={16} className="animate-spin" />
              ) : hasVoted ? (
                <RotateCcw size={16} /> // Icon: Reset
              ) : (
                <CheckCircle size={16} /> // Icon: Mark Done
              )}
            </button>
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {hasVoted ? "Reset Vote Status?" : "Manually Mark as Voted?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {hasVoted ? (
                  // Message if resetting
                  <span>
                    This will change the status to{" "}
                    <strong className="text-orange-600">Not Voted</strong>. The
                    student will be able to log in and cast a vote again.
                  </span>
                ) : (
                  // Message if marking as voted
                  <span>
                    This will change the status to{" "}
                    <strong className="text-green-600">Voted</strong>. The
                    student will be blocked from casting a vote. Use this if
                    they voted manually/offline.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleToggleStatus}
                disabled={disabled}
                className={
                  hasVoted
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-green-600 hover:bg-green-700"
                }
              >
                {hasVoted ? "Confirm Reset" : "Confirm Mark Voted"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isDeleting || disabled}
              title="Remove Voter"
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
              <AlertDialogTitle>Delete this voter?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently remove the
                voter from the eligible list and revoke their access code.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={disabled}
                className="bg-red-600 hover:bg-red-700 text-white border-0"
              >
                Delete Voter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Edit Voter Modal */}
      <EditVoterModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        voterId={voterId}
        initialFullName={voterFullName || voterName || ""}
        initialEmail={voterEmail}
        onSuccess={() => {
          onDataChange?.();
          router.refresh();
        }}
      />
    </>
  );
}
