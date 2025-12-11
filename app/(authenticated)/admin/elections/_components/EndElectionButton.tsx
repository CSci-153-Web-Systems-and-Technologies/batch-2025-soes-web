"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Power, Loader2 } from "lucide-react";
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
import { toast } from "sonner";

interface EndElectionButtonProps {
  electionId: string;
  electionStatus: string;
  electionTitle: string;
}

export default function EndElectionButton({
  electionId,
  electionStatus,
  electionTitle,
}: EndElectionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (electionStatus !== "active") {
    return null;
  }

  const handleEndElection = async () => {
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("election_sessions")
        .update({
          status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", electionId);

      if (error) throw error;

      toast.success("Election session ended successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error ending election:", error);
      toast.error("Failed to end election session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          size="sm"
          className="h-7 px-2 py-1 text-xs font-semibold gap-1"
          disabled={isLoading}
        >
          <Power size={16} />
          End Election Session
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>End Election Session?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to end the &quot;{electionTitle}&quot;
            election session? This action will:
            <ul className="mt-3 space-y-2 ml-4 list-disc text-sm">
              <li>Mark the election as completed</li>
              <li>Make the election available in reports</li>
              <li>Stop accepting new votes</li>
              <li>This action cannot be undone</li>
            </ul>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-end gap-3">
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleEndElection}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Ending...
              </>
            ) : (
              "End Election"
            )}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
