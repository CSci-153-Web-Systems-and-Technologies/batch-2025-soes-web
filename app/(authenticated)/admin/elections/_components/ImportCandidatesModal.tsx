"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { X, Upload, FileSpreadsheet, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PositionOption } from "../[id]/candidates/page";

interface ImportCandidatesModalProps {
  electionId: string;
  positions: PositionOption[];
  isOpen: boolean;
  onClose: () => void;
}

// 1. Strict Interface for the data we want to insert
interface CandidateImportData {
  election_id: string;
  student_id: string;
  full_name: string;
  nickname: string | null;
  position_id: string;
}

export default function ImportCandidatesModal({ electionId, positions, isOpen, onClose }: ImportCandidatesModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create a map for fast position lookup: "president" -> "uuid-123"
  const positionMap = new Map(positions.map(p => [p.title.toLowerCase(), p.id]));

  const parseCSV = async (text: string): Promise<CandidateImportData[]> => {
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    
    const required = ["student_id", "full_name", "position_title"];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length > 0) {
      throw new Error(`Missing columns: ${missing.join(", ")}`);
    }

    const result: CandidateImportData[] = [];
    const errors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ''));
      
      // 2. Use Partial<> to build the object safely
      const entry: Partial<CandidateImportData> = { 
        election_id: electionId,
        nickname: null 
      };
      
      let positionTitle = "";

      headers.forEach((header, index) => {
        const val = values[index] || "";
        if (header === "student_id") entry.student_id = val;
        if (header === "full_name") entry.full_name = val;
        if (header === "nickname") entry.nickname = val || null;
        if (header === "position_title") positionTitle = val;
      });

      // Lookup Position ID
      if (positionTitle) {
        const pid = positionMap.get(positionTitle.toLowerCase());
        if (pid) {
          entry.position_id = pid;
        } else {
          errors.push(`Row ${i + 1}: Position "${positionTitle}" not found.`);
          continue;
        }
      }

      // 3. Strict Check before pushing
      if (entry.student_id && entry.full_name && entry.position_id && entry.election_id) {
        result.push(entry as CandidateImportData);
      }
    }

    if (errors.length > 0) {
      throw new Error(errors[0] + (errors.length > 1 ? ` (and ${errors.length - 1} more errors)` : ""));
    }
    return result;
  };

  const handleFileUpload = async () => {
    if (!file) return;
    if (positions.length === 0) {
      toast.error("Please create positions before importing candidates.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const text = await file.text();
      const candidates = await parseCSV(text);

      if (candidates.length === 0) throw new Error("No valid candidates found in file.");

      const { error } = await supabase.from("candidates").insert(candidates);
      if (error) throw error;

      toast.success(`Successfully imported ${candidates.length} candidates.`);
      reset();
      onClose();
      router.refresh();

    } catch (error: unknown) { // 4. Use unknown + Type Narrowing
      console.error("Import Error:", error);
      
      let msg = "Failed to import. Check file format.";
      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "object" && error !== null && "message" in error) {
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
          <h3 className="text-lg font-semibold text-gray-900">Import Candidates (CSV)</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <p className="text-sm text-gray-600">
              Upload a <strong>.CSV</strong> file. The <code>position_title</code> must match an existing position exactly.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs font-mono text-gray-600 overflow-x-auto">
              student_id, full_name, nickname, position_title<br/>
              2023-001, Juan Cruz, John, President<br/>
              2023-002, Maria Clara, , Vice President
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
                <button onClick={reset} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={handleFileUpload} disabled={!file || isLoading} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <><Upload size={16} /> Import Candidates</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}