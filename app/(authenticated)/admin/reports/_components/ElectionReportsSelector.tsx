"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, FileText } from "lucide-react";
import ElectionReportView from "./ElectionReportView";

interface CompletedElection {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ElectionReportsSelectorProps {
  elections: CompletedElection[];
}

export default function ElectionReportsSelector({
  elections,
}: ElectionReportsSelectorProps) {
  const [selectedElectionId, setSelectedElectionId] = useState<string>(
    elections[0]?.id || ""
  );

  const selectedElection = elections.find((e) => e.id === selectedElectionId);

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert("PDF download coming soon!");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    alert("Excel export coming soon!");
  };

  return (
    <div className="space-y-6">
      {/* Election Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Select Election to Report
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Election Session
              </label>
              <Select
                value={selectedElectionId}
                onValueChange={setSelectedElectionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an election" />
                </SelectTrigger>
                <SelectContent>
                  {elections.map((election) => (
                    <SelectItem key={election.id} value={election.id}>
                      {election.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedElection && (
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Status
                </label>
                <div className="px-3 py-2 bg-gray-100 rounded-md border border-gray-200">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
                    {selectedElection.status.charAt(0).toUpperCase() +
                      selectedElection.status.slice(1)}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                className="gap-2 flex-1"
                disabled={!selectedElection}
              >
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button
                onClick={handleExportExcel}
                variant="outline"
                className="gap-2 flex-1"
                disabled={!selectedElection}
              >
                <Download className="w-4 h-4" />
                Excel
              </Button>
            </div>
          </div>

          {selectedElection?.description && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                {selectedElection.description}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report View */}
      {selectedElection && (
        <ElectionReportView
          electionId={selectedElection.id}
          electionTitle={selectedElection.title}
        />
      )}
    </div>
  );
}
