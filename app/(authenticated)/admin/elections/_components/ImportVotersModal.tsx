"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface VoterImportData {
  election_id: string;
  student_id: string;
  full_name: string;
  email: string;
  access_code: string;
  has_voted: boolean;
}

interface ImportVotersModalProps {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  disabled?: boolean;
}

export default function ImportVotersModal({
  electionId,
  isOpen,
  onClose,
  onSuccess,
  disabled,
}: ImportVotersModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [, setAddedCount] = useState(0);

  const generateAccessCode = () =>
    Math.random().toString(36).slice(-8).toUpperCase();

  const parseCSV = (text: string): VoterImportData[] => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    // 2. Updated Validation: Check for 'email' column
    if (
      !headers.includes("student_id") ||
      !headers.includes("full_name") ||
      !headers.includes("email")
    ) {
      throw new Error("Missing required columns: student_id, full_name, email");
    }

    const result: VoterImportData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].trim();
      if (!currentLine) continue;

      const values = currentLine.split(",");

      const entry: Partial<VoterImportData> = {
        election_id: electionId,
        has_voted: false,
        access_code: generateAccessCode(),
      };

      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/^"|"$/g, "") || "";

        if (header === "student_id") entry.student_id = value;
        if (header === "full_name") entry.full_name = value;
        if (header === "email") entry.email = value; // 3. Capture email strictly
      });

      // 4. Strict Check: Ensure email is present
      if (
        entry.student_id &&
        entry.full_name &&
        entry.email &&
        entry.election_id &&
        entry.access_code
      ) {
        result.push(entry as VoterImportData);
      }
    }
    return result;
  };

  const handleFileUpload = async () => {
    if (!file) return;

    if (disabled) {
      toast.error("Cannot import voters to an ended election.");
      return;
    }

    setIsLoading(true);
    setStatus("idle");
    const supabase = createClient();

    try {
      const text = await file.text();
      const voters = parseCSV(text);

      if (voters.length === 0) {
        throw new Error(
          "No valid voters found (ensure all rows have an email)."
        );
      }

      const { error } = await supabase.from("eligible_voters").insert(voters);

      if (error) {
        if (error.code === "23505")
          throw new Error("Some IDs already exist in this election.");
        throw error;
      }

      setAddedCount(voters.length);
      setStatus("success");
      setMessage(`Successfully imported ${voters.length} voters.`);
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Import Error:", error);
      setStatus("error");

      let errorMessage = "Failed to import voters.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        errorMessage = (error as { message: string }).message;
      }
      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Import Voters (CSV)
          </h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {status === "success" && (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-semibold text-foreground">
                Import Successful!
              </h4>
              <p className="text-muted-foreground mt-1">{message}</p>
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="mt-6 px-6 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
              >
                Done
              </button>
            </div>
          )}

          {status !== "success" && (
            <>
              {status === "error" && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-800 text-sm items-start">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Import Failed:</span>{" "}
                    {message}
                  </div>
                </div>
              )}

              <div className="mb-6 space-y-3">
                <p className="text-sm text-foreground">
                  Upload a <strong>.CSV</strong> file. All fields are required.
                </p>
                <div className="bg-muted border border-border rounded-lg p-3 text-xs font-mono text-foreground">
                  student_id, full_name, email
                  <br />
                  2023-001, Juan Dela Cruz, juan@school.edu
                </div>
              </div>

              <div className="space-y-4">
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-700 file:text-white hover:file:bg-green-800 cursor-pointer"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-foreground bg-muted px-3 py-2 rounded-lg border border-border">
                    <FileSpreadsheet size={16} className="text-green-600" />
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      onClick={reset}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-muted border border-border rounded-lg hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!file || isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-700 hover:bg-green-800 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Upload size={16} /> Import Voters
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
