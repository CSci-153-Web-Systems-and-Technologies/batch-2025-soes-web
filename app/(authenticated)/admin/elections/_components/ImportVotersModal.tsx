"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  X,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface VoterImportData {
  election_id: string;
  school_id: string;
  full_name: string;
  email: string;
  access_code: string;
  has_voted: boolean;
}

interface ImportVotersModalProps {
  electionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportVotersModal({
  electionId,
  isOpen,
  onClose,
}: ImportVotersModalProps) {
  const router = useRouter();
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
      !headers.includes("school_id") ||
      !headers.includes("full_name") ||
      !headers.includes("email")
    ) {
      throw new Error("Missing required columns: school_id, full_name, email");
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

        if (header === "school_id") entry.school_id = value;
        if (header === "full_name") entry.full_name = value;
        if (header === "email") entry.email = value; // 3. Capture email strictly
      });

      // 4. Strict Check: Ensure email is present
      if (
        entry.school_id &&
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
      router.refresh();
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Import Voters (CSV)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {status === "success" && (
            <div className="flex flex-col items-center justify-center text-center py-6">
              <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                Import Successful!
              </h4>
              <p className="text-gray-500 mt-1">{message}</p>
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
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
                <p className="text-sm text-gray-600">
                  Upload a <strong>.CSV</strong> file. All fields are required.
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-600">
                  school_id, full_name, email
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
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {file && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    <FileSpreadsheet size={16} className="text-green-600" />
                    <span className="truncate flex-1">{file.name}</span>
                    <button
                      onClick={reset}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFileUpload}
                  disabled={!file || isLoading}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
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
