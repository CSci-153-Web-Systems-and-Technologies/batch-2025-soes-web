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
import { exportToPDF, exportToExcel } from "@/lib/export-utils";
import ElectionReportView from "./ElectionReportView";

interface CompletedElection {
  id: string;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface ReportData {
  totalVoters: number;
  votesCast: number;
  turnoutPercentage: string;
  positionResults: Array<{
    positionId: string;
    positionName: string;
    candidates: Array<{
      candidateId: string;
      candidateName: string;
      partylist?: string;
      voteCount: number;
      percentage: number;
    }>;
    totalVotes: number;
  }>;
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
  const [isExporting, setIsExporting] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const selectedElection = elections.find((e) => e.id === selectedElectionId);

  const handleDownloadPDF = async () => {
    if (!reportData || !selectedElection) return;
    setIsExporting(true);
    try {
      await exportToPDF({
        electionTitle: selectedElection.title,
        totalVoters: reportData.totalVoters,
        votesCast: reportData.votesCast,
        turnoutPercentage: reportData.turnoutPercentage,
        positions: reportData.positionResults,
        exportDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportExcel = async () => {
    if (!reportData || !selectedElection) return;
    setIsExporting(true);
    try {
      await exportToExcel({
        electionTitle: selectedElection.title,
        totalVoters: reportData.totalVoters,
        votesCast: reportData.votesCast,
        turnoutPercentage: reportData.turnoutPercentage,
        positions: reportData.positionResults,
        exportDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error exporting Excel:", error);
    } finally {
      setIsExporting(false);
    }
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
              <label className="text-sm font-medium text-foreground block mb-2">
                Election Session
              </label>
              <Select
                value={selectedElectionId}
                onValueChange={setSelectedElectionId}
              >
                <SelectTrigger className="bg-background">
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
                <label className="text-sm font-medium text-foreground block mb-2">
                  Status
                </label>
                <div className="px-3 py-2 bg-muted rounded-md border border-border">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
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
                size="sm"
                className="gap-2 flex-1 text-xs sm:text-sm"
                disabled={!selectedElection || !reportData || isExporting}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isExporting ? "Exporting..." : "Download PDF"}
                </span>
                <span className="sm:hidden">PDF</span>
              </Button>
              <Button
                onClick={handleExportExcel}
                variant="outline"
                size="sm"
                className="gap-2 flex-1 text-xs sm:text-sm"
                disabled={!selectedElection || !reportData || isExporting}
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isExporting ? "Exporting..." : "Download Excel"}
                </span>
                <span className="sm:hidden">Excel</span>
              </Button>
            </div>
          </div>

          {selectedElection?.description && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
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
          onReportDataReady={setReportData}
        />
      )}
    </div>
  );
}
