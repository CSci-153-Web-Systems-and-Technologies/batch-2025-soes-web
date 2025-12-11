"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImportPartyleysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  electionId?: string;
}

interface PartylistImportData {
  name: string;
  description: string | null;
  election_id: string | null;
}

export default function ImportPartyleysModal({
  isOpen,
  onClose,
  onSuccess,
  electionId,
}: ImportPartyleysModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const parseCSV = async (text: string): Promise<PartylistImportData[]> => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const required = ["name"];
    const missing = required.filter((r) => !headers.includes(r));
    if (missing.length > 0) {
      throw new Error(`Missing columns: ${missing.join(", ")}`);
    }

    const result: PartylistImportData[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));

      const entry: Partial<PartylistImportData> = {
        election_id: electionId || null,
        description: null,
      };

      headers.forEach((header, index) => {
        const val = values[index] || "";
        if (header === "name") entry.name = val;
        if (header === "description") entry.description = val || null;
      });

      if (entry.name) {
        result.push(entry as PartylistImportData);
      } else {
        errors.push(`Row ${i + 1}: Name is required`);
      }
    }

    if (errors.length > 0) {
      throw new Error(
        errors[0] +
          (errors.length > 1 ? ` (and ${errors.length - 1} more errors)` : "")
      );
    }
    return result;
  };

  const handleFileUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    const supabase = createClient();

    try {
      const text = await file.text();
      const partylists = await parseCSV(text);

      if (partylists.length === 0)
        throw new Error("No valid partylists found in file.");

      const { error } = await supabase.from("partylists").insert(partylists);
      if (error) throw error;

      toast.success(`Successfully imported ${partylists.length} partylists.`);
      reset();
      onClose();
      onSuccess?.();
    } catch (error: unknown) {
      console.error("Import Error:", error);

      let msg = "Failed to import. Check file format.";
      if (error instanceof Error) {
        msg = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "message" in error
      ) {
        msg = (error as { message: string }).message;
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            Import Partylists (CSV)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Upload a <strong>.CSV</strong> file with partylist data.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-600 overflow-x-auto">
              <div className="font-semibold mb-2 text-gray-900">
                CSV Format Example:
              </div>
              name,description
              <br />
              ABC Party,Student-led party focused on academic excellence
              <br />
              Student Union,Dedicated to student welfare and activities
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

          <div className="flex gap-3">
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
                  <Upload size={16} /> Import Partylists
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
