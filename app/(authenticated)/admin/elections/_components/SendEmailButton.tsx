"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle, XCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SendEmailButtonProps {
  electionId: string;
  voterIds?: string[]; // If provided, send to specific voters only
  disabled?: boolean;
}

export default function SendEmailButton({
  electionId,
  voterIds,
  disabled,
}: SendEmailButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{
    sent: number;
    failed: number;
    total: number;
  } | null>(null);

  const handleSendEmails = async () => {
    setIsSending(true);
    setIsDialogOpen(false);

    try {
      const response = await fetch("/api/send-voter-emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          electionId,
          voterIds: voterIds || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult({
          sent: data.sent,
          failed: data.failed,
          total: data.total,
        });
        setShowResult(true);

        if (data.failed === 0) {
          toast.success(`Successfully sent emails to ${data.sent} voter(s)!`);
        } else {
          toast.warning(
            `Sent ${data.sent} emails, ${data.failed} failed. Check details.`
          );
        }
      } else {
        toast.error(data.error || "Failed to send emails");
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      toast.error("An error occurred while sending emails");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled || isSending}
        variant="outline"
        size="sm"
        className="gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        {isSending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="hidden sm:inline">Sending...</span>
          </>
        ) : (
          <>
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email Voters</span>
            <span className="sm:hidden">Email</span>
          </>
        )}
      </Button>

      {/* Confirmation Dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Send Voting Credentials via Email?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will send an email to{" "}
              {voterIds && voterIds.length > 0
                ? `${voterIds.length} selected voter(s)`
                : "all voters"}{" "}
              containing their voting credentials.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-6 space-y-3">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Voter name</li>
              <li>One-time voting code</li>
              <li>Ballot link</li>
              <li>Results page link</li>
              <li>Election information</li>
              <li>Voting instructions</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Make sure voters have valid email addresses in the system.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSendEmails}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Emails
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Results Dialog */}
      <AlertDialog open={showResult} onOpenChange={setShowResult}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {result && result.failed === 0 ? (
                <>
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Emails Sent Successfully
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-yellow-600" />
                  Emails Sent with Issues
                </>
              )}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="px-6 pb-4">
            {result && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.sent}
                    </div>
                    <div className="text-xs text-muted-foreground">Sent</div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {result.failed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.total}
                    </div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
                {result.failed > 0 && (
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Some emails failed to send. This usually happens when voters
                    don&apos;t have email addresses registered.
                  </p>
                )}
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowResult(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
