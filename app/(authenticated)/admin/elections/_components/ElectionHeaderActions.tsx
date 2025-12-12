"use client";

import { useState, useEffect } from "react";
import { Share2, Power, Loader2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ElectionHeaderActionsProps {
  electionId: string;
  electionStatus: string;
  endDate?: string;
}

export default function ElectionHeaderActions({
  electionId,
  electionStatus,
  endDate,
}: ElectionHeaderActionsProps) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [autoEnded, setAutoEnded] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const ballotUrl = `${
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  }/ballot/${electionId}`;

  const isActive = electionStatus === "active";

  // Auto-end election when end time is reached
  useEffect(() => {
    if (!isActive || !endDate || autoEnded) return;

    const checkEndTime = async () => {
      const now = new Date();
      const endDateTime = new Date(endDate);

      if (now >= endDateTime) {
        try {
          const { error } = await supabase
            .from("election_sessions")
            .update({ status: "ended" })
            .eq("id", electionId);

          if (!error) {
            setAutoEnded(true);
            toast.success("Election has ended automatically");
            router.refresh();
          }
        } catch (err) {
          console.error("Failed to auto-end election:", err);
        }
      }
    };

    // Check immediately
    checkEndTime();

    // Set interval to check every minute
    const interval = setInterval(checkEndTime, 60000);
    return () => clearInterval(interval);
  }, [isActive, endDate, autoEnded, electionId, supabase, router]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(ballotUrl);
      setIsCopied(true);
      toast.success("Ballot link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      const newStatus = isActive ? "draft" : "active";
      const { error } = await supabase
        .from("election_sessions")
        .update({ status: newStatus })
        .eq("id", electionId);

      if (error) {
        toast.error("Failed to update election status: " + error.message);
        setIsToggling(false);
        return;
      }

      toast.success(
        `Election ${isActive ? "deactivated" : "activated"} successfully`
      );
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while updating the election status");
      console.error("Error:", error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleEndSession = async () => {
    setIsEnding(true);
    try {
      const { error } = await supabase
        .from("election_sessions")
        .update({ status: "ended" })
        .eq("id", electionId);

      if (error) {
        toast.error("Failed to end election: " + error.message);
        setIsEnding(false);
        return;
      }

      toast.success("Election ended successfully");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while ending the election");
      console.error("Error:", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Status Toggle Button */}
      {electionStatus !== "ended" && (
        <Button
          onClick={handleToggleStatus}
          disabled={isToggling}
          size="sm"
          className={`gap-2 ${
            isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-700 hover:bg-green-900"
          }`}
        >
          {isToggling ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Power size={16} />
              {isActive ? "Deactivate" : "Activate"}
            </>
          )}
        </Button>
      )}

      {/* Share Button - Only show if active */}
      {isActive && (
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
            >
              <Share2 size={16} />
              <span className="hidden sm:inline">Share Ballot Link</span>
              <span className="sm:hidden">Share</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Share Ballot Link</DialogTitle>
              <DialogDescription>
                Share this link with voters to access the ballot
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-muted-foreground mb-2">
                  Ballot URL:
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <code className="flex-1 text-xs md:text-sm text-blue-900 dark:text-blue-300 font-mono break-all">
                    {ballotUrl}
                  </code>
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    variant="ghost"
                    className="flex-shrink-0 hover:bg-blue-100 dark:hover:bg-blue-900/20 w-full sm:w-auto"
                  >
                    {isCopied ? (
                      <Check size={16} className="text-green-600" />
                    ) : (
                      <Copy size={16} className="text-blue-600" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ⓘ This link can be shared via email, QR code, messaging, or
                direct link.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* End Session Button - Only show if active */}
      {isActive && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="sm"
              variant="destructive"
              className="gap-2 w-full sm:w-auto"
            >
              End Session
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End Election Session?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately end the election and prevent further
                voting. You can view results and export reports after ending.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleEndSession}
                className="bg-red-600 hover:bg-red-700"
              >
                {isEnding ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Ending...
                  </>
                ) : (
                  "End Session"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
