import * as XLSX from "xlsx";

interface CandidateResult {
  candidateId: string;
  candidateName: string;
  partylist?: string;
  voteCount: number;
  percentage: number;
  isWinner?: boolean;
}

interface PositionResult {
  positionId: string;
  positionName: string;
  candidates: CandidateResult[];
  totalVotes: number;
  winnerCount?: number; // Number of winners for this position
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

      <div class="section">
        <h2>🏆 Election Winners</h2>
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Winner(s)</th>
              <th>Partylist</th>
              <th>Votes Received</th>
            </tr>
          </thead>
          <tbody>
  `;

  // Add winners summary table
  for (const position of data.positions) {
    const maxVotes = position.candidates.length > 0 
      ? Math.max(...position.candidates.map(c => c.voteCount))
      : 0;
    
    const winners = position.candidates.filter(c => c.voteCount === maxVotes && maxVotes > 0);

    if (winners.length > 0) {
      winners.forEach((winner, index) => {
        htmlContent += `
          <tr style="background-color: #f0fdf4;">
            <td>${index === 0 ? position.positionName : ''}</td>
            <td><strong>${winner.candidateName}</strong>${winners.length > 1 ? ' <em>(TIED)</em>' : ''}</td>
            <td>${winner.partylist || "N/A"}</td>
            <td><strong>${winner.voteCount}</strong> (${winner.percentage.toFixed(1)}%)</td>
          </tr>
        `;
      });
    } else {
      htmlContent += `
        <tr>
          <td>${position.positionName}</td>
          <td colspan="3" style="text-align: center; color: #999;">No votes cast</td>
        </tr>
      `;
    }
  }

  htmlContent += `
          </tbody>
        </table>
      </div>
  `;

  // Add position results
  for (let i = 0; i < data.positions.length; i++) {
    const position = data.positions[i];

    if (i > 0) {
      htmlContent += '<div class="page-break"></div>';
    }

    // Determine winners (candidates with highest vote count)
    const maxVotes = position.candidates.length > 0 
      ? Math.max(...position.candidates.map(c => c.voteCount))
      : 0;
    
    const winners = position.candidates.filter(c => c.voteCount === maxVotes && maxVotes > 0);

    htmlContent += `
      <div class="section">
        <h2>${position.positionName}</h2>
        ${winners.length > 0 ? `
          <div style="background-color: #dcfce7; border: 2px solid #16a34a; border-radius: 8px; padding: 15px; margin-bottom: 20px;">
            <h3 style="color: #15803d; margin-bottom: 10px; font-size: 14px;">🏆 ${winners.length > 1 ? 'Winners (Tied)' : 'Winner'}</h3>
            ${winners.map(w => `
              <div style="margin-bottom: 5px;">
                <strong>${w.candidateName}</strong>
                ${w.partylist ? `<span style="color: #666;"> - ${w.partylist}</span>` : ''}
                <span style="color: #15803d; font-weight: bold;"> (${w.voteCount} votes, ${w.percentage.toFixed(1)}%)</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        <table>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Candidate Name</th>
              <th>Partylist</th>
              <th>Votes</th>
              <th>Percentage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
    `;

    position.candidates.forEach((candidate, index) => {
      const isWinner = candidate.voteCount === maxVotes && maxVotes > 0;
      htmlContent += `
        <tr ${isWinner ? 'style="background-color: #f0fdf4; font-weight: bold;"' : ''}>
          <td class="rank">${index + 1}</td>
          <td>${candidate.candidateName}</td>
          <td>${candidate.partylist || "N/A"}</td>
          <td>${candidate.voteCount}</td>
          <td>${candidate.percentage.toFixed(1)}%</td>
          <td>${isWinner ? '<span style="color: #15803d;">✓ WINNER</span>' : ''}</td>
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
 * Export election results to Excel with styling
 */
export async function exportToExcel(data: ExportData) {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Summary sheet data
  const summaryData = [
    ["STUDENT ORGANIZATION ELECTION SYSTEM"],
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
  summarySheet["!cols"] = [{ wch: 30 }, { wch: 25 }];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

  // Winners Summary sheet
  const winnersData: (string | number)[][] = [
    ["STUDENT ORGANIZATION ELECTION SYSTEM"],
    ["ELECTION WINNERS SUMMARY"],
    [],
    ["Position", "Winner(s)", "Partylist", "Votes Received"],
  ];

  for (const position of data.positions) {
    // Determine winner(s)
    const maxVotes = position.candidates.length > 0 
      ? Math.max(...position.candidates.map(c => c.voteCount))
      : 0;
    
    const winners = position.candidates.filter(c => c.voteCount === maxVotes && maxVotes > 0);

    if (winners.length > 0) {
      winners.forEach((winner, index) => {
        winnersData.push([
          index === 0 ? position.positionName : "", // Only show position name on first winner
          winner.candidateName + (winners.length > 1 ? " (TIED)" : ""),
          winner.partylist || "N/A",
          `${winner.voteCount} (${winner.percentage.toFixed(1)}%)`,
        ]);
      });
    } else {
      winnersData.push([
        position.positionName,
        "No votes cast",
        "",
        "0",
      ]);
    }
  }

  const winnersSheet = XLSX.utils.aoa_to_sheet(winnersData);
  winnersSheet["!cols"] = [
    { wch: 30 },
    { wch: 30 },
    { wch: 20 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(workbook, winnersSheet, "Winners Summary");

  // Detailed results sheet
  const resultsData: (string | number)[][] = [
    ["STUDENT ORGANIZATION ELECTION SYSTEM"],
    ["ELECTION RESULTS - DETAILED BREAKDOWN"],
    [],
    ["Position", "Rank", "Candidate Name", "Partylist", "Votes", "Percentage", "Status"],
  ];

  for (const position of data.positions) {
    // Determine winner(s)
    const maxVotes = position.candidates.length > 0 
      ? Math.max(...position.candidates.map(c => c.voteCount))
      : 0;

    position.candidates.forEach((candidate, index) => {
      const isWinner = candidate.voteCount === maxVotes && maxVotes > 0;
      resultsData.push([
        position.positionName,
        index + 1,
        candidate.candidateName,
        candidate.partylist || "N/A",
        candidate.voteCount,
        `${candidate.percentage.toFixed(1)}%`,
        isWinner ? "✓ WINNER" : "",
      ]);
    });
    resultsData.push([]);
  }

  const resultsSheet = XLSX.utils.aoa_to_sheet(resultsData);
  resultsSheet["!cols"] = [
    { wch: 25 },
    { wch: 8 },
    { wch: 25 },
    { wch: 20 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(workbook, resultsSheet, "Detailed Results");

  // Add individual sheets for each position
  for (const position of data.positions) {
    // Determine winner(s)
    const maxVotes = position.candidates.length > 0 
      ? Math.max(...position.candidates.map(c => c.voteCount))
      : 0;
    
    const winners = position.candidates.filter(c => c.voteCount === maxVotes && maxVotes > 0);

    const positionData: (string | number)[][] = [
      ["STUDENT ORGANIZATION ELECTION SYSTEM"],
      [`${position.positionName.toUpperCase()} - RESULTS`],
      [],
    ];

    // Add winner section if there are winners
    if (winners.length > 0) {
      positionData.push([`🏆 ${winners.length > 1 ? 'WINNERS (TIED)' : 'WINNER'}:`]);
      winners.forEach(w => {
        positionData.push([
          `${w.candidateName}${w.partylist ? ` - ${w.partylist}` : ''} (${w.voteCount} votes, ${w.percentage.toFixed(1)}%)`
        ]);
      });
      positionData.push([]);
    }

    positionData.push(["Rank", "Candidate Name", "Partylist", "Votes", "Percentage", "Status"]);

    position.candidates.forEach((candidate, index) => {
      const isWinner = candidate.voteCount === maxVotes && maxVotes > 0;
      positionData.push([
        index + 1,
        candidate.candidateName,
        candidate.partylist || "N/A",
        candidate.voteCount,
        `${candidate.percentage.toFixed(1)}%`,
        isWinner ? "✓ WINNER" : "",
      ]);
    });

    const positionSheet = XLSX.utils.aoa_to_sheet(positionData);
    positionSheet["!cols"] = [
      { wch: 8 },
      { wch: 25 },
      { wch: 20 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
    ];

    const sheetName = position.positionName.substring(0, 31);
    XLSX.utils.book_append_sheet(workbook, positionSheet, sheetName);
  }

  // Write and download
  XLSX.writeFile(workbook, `${data.electionTitle}-results.xlsx`);
}
