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
 * Export election results to PDF using HTML rendering
 */
export async function exportToPDF(data: ExportData) {
  // Fetch and convert logo to data URL
  let logoDataUrl = "";
  try {
    const logoResponse = await fetch("/logo.svg");
    const logoBlob = await logoResponse.blob();
    logoDataUrl = URL.createObjectURL(logoBlob);
  } catch (error) {
    console.warn("Could not load logo:", error);
  }

  // Create HTML content for the PDF
  let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${data.electionTitle} - Election Results</title>
      <style>
        * { margin: 0; padding: 0; }
        body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; color: #333; }
        .header { display: flex; align-items: flex-start; gap: 20px; margin-bottom: 30px; border-bottom: 3px solid #15803d; padding-bottom: 15px; }
        .logo-section { flex-shrink: 0; }
        .logo-section img { height: 80px; width: auto; }
        .header-content { flex-grow: 1; }
        .header h1 { color: #15803d; font-size: 28px; margin-bottom: 10px; }
        .header p { color: #666; font-size: 12px; }
        .section { margin-bottom: 30px; }
        .section h2 { background-color: #15803d; color: white; padding: 10px; margin-bottom: 15px; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #166534; color: white; padding: 10px; text-align: left; font-size: 12px; }
        td { padding: 8px; border-bottom: 1px solid #ddd; font-size: 11px; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .summary-box { display: inline-block; margin-right: 30px; margin-bottom: 15px; }
        .summary-box strong { display: block; color: #15803d; font-size: 12px; }
        .summary-box span { display: block; font-size: 24px; font-weight: bold; color: #333; }
        .page-break { page-break-after: always; }
        .rank { font-weight: bold; color: #15803d; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo-section">
          ${logoDataUrl ? `<img src="${logoDataUrl}" alt="Logo">` : ""}
        </div>
        <div class="header-content">
          <h1>Election Results Report</h1>
          <p><strong>${data.electionTitle}</strong></p>
          <p>Generated: ${new Date(data.exportDate).toLocaleString()}</p>
        </div>
      </div>

      <div class="section">
        <h2>Summary Statistics</h2>
        <div class="summary-box">
          <strong>Total Voters</strong>
          <span>${data.totalVoters}</span>
        </div>
        <div class="summary-box">
          <strong>Votes Cast</strong>
          <span>${data.votesCast}</span>
        </div>
        <div class="summary-box">
          <strong>Turnout</strong>
          <span>${data.turnoutPercentage}</span>
        </div>
      </div>
  `;

  // Add position results
  for (let i = 0; i < data.positions.length; i++) {
    const position = data.positions[i];

    if (i > 0) {
      htmlContent += '<div class="page-break"></div>';
    }

    htmlContent += `
      <div class="section">
        <h2>${position.positionName}</h2>
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate Name</th>
              <th>Partylist</th>
              <th>Votes</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
    `;

    position.candidates.forEach((candidate, index) => {
      htmlContent += `
        <tr>
          <td class="rank">${index + 1}</td>
          <td>${candidate.candidateName}</td>
          <td>${candidate.partylist || "N/A"}</td>
          <td>${candidate.voteCount}</td>
          <td>${candidate.percentage.toFixed(1)}%</td>
        </tr>
      `;
    });

    htmlContent += `
          </tbody>
        </table>
      </div>
    `;
  }

  htmlContent += `
      <div style="text-align: center; margin-top: 50px; color: #999; font-size: 10px;">
        <p>This document was generated automatically by the Election Management System</p>
      </div>
    </body>
    </html>
  `;

  // Open in new window and let user print to PDF
  const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const newWindow = window.open(url, "_blank");
  
  if (newWindow) {
    setTimeout(() => {
      newWindow.print();
    }, 500);
  }
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
