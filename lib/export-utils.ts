import jsPDF from "jspdf";
import * as XLSX from "xlsx";

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  partylist?: string;
  voteCount: number;
  percentage: number;
}

interface PositionResult {
  positionId: string;
  positionName: string;
  candidates: CandidateResult[];
  totalVotes: number;
}

interface ExportData {
  electionTitle: string;
  totalVoters: number;
  votesCast: number;
  turnoutPercentage: string;
  positions: PositionResult[];
  exportDate: string;
}

/**
 * Export election results to PDF
 */
export async function exportToPDF(data: ExportData) {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;

  // Set font
  pdf.setFont("helvetica");

  // Title
  pdf.setFontSize(16);
  pdf.text(`Election Results: ${data.electionTitle}`, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 12;

  // Export date
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(
    `Generated: ${new Date(data.exportDate).toLocaleString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" }
  );
  yPosition += 15;

  // Summary statistics
  pdf.setTextColor(0);
  pdf.setFontSize(11);
  pdf.text("Summary Statistics", 14, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  const statsData = [
    `Total Voters: ${data.totalVoters}`,
    `Votes Cast: ${data.votesCast}`,
    `Turnout: ${data.turnoutPercentage}`,
  ];

  statsData.forEach((stat) => {
    pdf.text(stat, 20, yPosition);
    yPosition += 7;
  });

  yPosition += 5;

  // Position results
  for (const position of data.positions) {
    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 15;
    }

    // Position name
    pdf.setFontSize(12);
    pdf.setFillColor(41, 128, 185); // Blue background
    pdf.setTextColor(255, 255, 255); // White text
    pdf.rect(14, yPosition - 5, pageWidth - 28, 8, "F");
    pdf.text(position.positionName, 16, yPosition + 1);
    pdf.setTextColor(0); // Reset to black
    yPosition += 12;

    // Candidates list
    pdf.setFontSize(9);
    position.candidates.forEach((candidate, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 15;
      }

      // Rank and candidate name
      pdf.text(
        `${index + 1}. ${candidate.candidateName}`,
        20,
        yPosition
      );
      yPosition += 6;

      // Partylist and votes
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `Partylist: ${candidate.partylist || "N/A"} | Votes: ${candidate.voteCount} (${candidate.percentage.toFixed(1)}%)`,
        25,
        yPosition
      );
      pdf.setTextColor(0);
      pdf.setFontSize(9);
      yPosition += 8;
    });

    yPosition += 5;
  }

  pdf.save(`${data.electionTitle}-results.pdf`);
}

/**
 * Export election results to Excel
 */
export async function exportToExcel(data: ExportData) {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Summary sheet data
  const summaryData = [
    ["Election Report"],
    [],
    ["Metric", "Value"],
    ["Election Title", data.electionTitle],
    ["Export Date", new Date(data.exportDate).toLocaleString()],
    ["Total Voters", data.totalVoters],
    ["Votes Cast", data.votesCast],
    ["Turnout Percentage", data.turnoutPercentage],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 20 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Detailed results sheet with all positions
  const resultsData: (string | number)[][] = [
    ["Election Results - Detailed Breakdown"],
    [],
    ["Position", "Rank", "Candidate Name", "Partylist", "Votes", "Percentage"],
  ];

  for (const position of data.positions) {
    position.candidates.forEach((candidate, index) => {
      resultsData.push([
        position.positionName,
        index + 1,
        candidate.candidateName,
        candidate.partylist || "N/A",
        candidate.voteCount,
        `${candidate.percentage.toFixed(1)}%`,
      ]);
    });
    resultsData.push([]); // Add blank row between positions
  }

  const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);
  resultsSheet["!cols"] = [
    { wch: 25 },
    { wch: 8 },
    { wch: 25 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(workbook, resultsSheet, "Detailed Results");

  // Add individual sheets for each position
  for (const position of data.positions) {
    const positionData: (string | number)[][] = [
      [`${position.positionName} - Results`],
      [],
      ["Rank", "Candidate Name", "Partylist", "Votes", "Percentage"],
    ];

    position.candidates.forEach((candidate, index) => {
      positionData.push([
        index + 1,
        candidate.candidateName,
        candidate.partylist || "N/A",
        candidate.voteCount,
        `${candidate.percentage.toFixed(1)}%`,
      ]);
    });

    const positionSheet = XLSX.utils.aoa_to_sheet(positionData);
    positionSheet["!cols"] = [
      { wch: 8 },
      { wch: 25 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
    ];

    // Sanitize sheet name (Excel has a 31 character limit)
    const sheetName = position.positionName.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, positionSheet, sheetName);
  }

  // Write and download
  XLSX.writeFile(workbook, `${data.electionTitle}-results.xlsx`);
}
