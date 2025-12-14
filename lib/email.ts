import nodemailer from 'nodemailer';

// Create nodemailer transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface VoterEmailData {
  email: string;
  voterName: string;
  studentId: string;
  accessCode: string;
  electionTitle: string;
  electionDescription?: string;
  ballotUrl: string;
  resultsUrl: string;
  electionStatus: string;
  isInitialEmail?: boolean;
}

export async function sendVoterCredentials(data: VoterEmailData) {
  const {
    email,
    voterName,
    studentId,
    accessCode,
    electionTitle,
    electionDescription,
    ballotUrl,
    resultsUrl,
    electionStatus,
    isInitialEmail = true,
  } = data;

  const isActive = electionStatus === 'active';
  const hasEnded = electionStatus === 'ended';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #15803d;
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: #f9fafb;
            padding: 30px;
            border: 1px solid #e5e7eb;
            border-top: none;
          }
          .credentials-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #15803d;
            margin: 20px 0;
          }
          .credential-item {
            margin: 15px 0;
          }
          .credential-label {
            font-weight: bold;
            color: #6b7280;
            font-size: 12px;
            text-transform: uppercase;
          }
          .credential-value {
            font-size: 18px;
            color: #1f2937;
            font-weight: 600;
            margin-top: 5px;
            padding: 10px;
            background: #f3f4f6;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            margin: 10px 5px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            text-align: center;
            color: white !important;
          }
          .button-primary {
            background: #15803d;
            color: white !important;
          }
          .button-secondary {
            background: #16a34a;
            color: white !important;
          }
          .info-box {
            background: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .status-box {
            background: ${isActive ? '#dcfce7' : hasEnded ? '#fee2e2' : '#e0e7ff'};
            border-left: 4px solid ${isActive ? '#16a34a' : hasEnded ? '#dc2626' : '#6366f1'};
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            margin-top: 20px;
          }
          .steps {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .step {
            margin: 15px 0;
            padding-left: 30px;
            position: relative;
          }
          .step::before {
            content: "→";
            position: absolute;
            left: 0;
            color: #15803d;
            font-weight: bold;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">${isInitialEmail ? 'Your Voting Credentials' : (isActive ? 'Election Now Active!' : hasEnded ? 'Election Results Available' : 'Election Update')}</h1>
          <p style="margin: 10px 0 0 0;">${electionTitle}</p>
        </div>
        
        <div class="content">
          <p>Hello <strong>${voterName}</strong>,</p>
          
          ${isInitialEmail ? `
            <p>You are registered to vote in <strong>${electionTitle}</strong>. Below are your unique voting credentials and instructions.</p>
            
            ${electionDescription ? `<p><em>${electionDescription}</em></p>` : ''}

            <div class="status-box">
              ${isActive ? '✅ <strong>Election is Active:</strong> You can vote now!' : ''}
              ${hasEnded ? '🔒 <strong>Election has Ended:</strong> Voting is now closed. You can view the results.' : ''}
              ${!isActive && !hasEnded ? 'ℹ️ <strong>Election Status:</strong> The election is not yet active. You will be notified when voting begins.' : ''}
            </div>
            
            <div class="credentials-box">
              <div class="credential-item">
                <div class="credential-label">Your Student ID</div>
                <div class="credential-value">${studentId}</div>
              </div>
              
              <div class="credential-item">
                <div class="credential-label">One-Time Voting Code</div>
                <div class="credential-value">${accessCode}</div>
              </div>
            </div>

            <div class="info-box">
              ⚠️ <strong>Important:</strong> Keep this code secure. You can only vote once. Do not share your code with anyone.
            </div>
          ` : `
            ${isActive ? `
              <div class="status-box">
                ✅ <strong>Voting is Now Open!</strong>
              </div>
              
              <p>The election <strong>${electionTitle}</strong> is now active and you can cast your vote.</p>
              
              <p>Use your previously sent credentials (Student ID and Access Code) to access the ballot.</p>
            ` : hasEnded ? `
              <div class="status-box">
                🔒 <strong>Election Has Ended</strong>
              </div>
              
              <p>The election <strong>${electionTitle}</strong> has concluded. Voting is now closed.</p>
              
              <p>You can now view the final election results.</p>
            ` : ''}
          `}

          ${isInitialEmail && isActive ? `
          <div class="steps">
            <h3>How to Vote:</h3>
            <div class="step">Click the "Cast Your Vote" button below</div>
            <div class="step">Enter your one-time voting code</div>
            <div class="step">Select your candidates for each position</div>
            <div class="step">Review and submit your ballot</div>
          </div>
          ` : ''}

          <div style="text-align: center; margin: 30px 0;">
            ${isActive ? `<a href="${ballotUrl}" class="button button-primary">Cast Your Vote</a>` : ''}
            <a href="${resultsUrl}" class="button button-secondary">View ${hasEnded ? 'Final' : 'Live'} Results</a>
          </div>

          <div style="background: white; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p><strong>Direct Links:</strong></p>
            <p style="font-size: 12px; word-break: break-all;">
              ${isActive ? `<strong>Ballot:</strong> <a href="${ballotUrl}">${ballotUrl}</a><br>` : ''}
              <strong>Results:</strong> <a href="${resultsUrl}">${resultsUrl}</a>
            </p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated message from the Student Organization Election System.</p>
          <p>If you have questions, please contact the election committee.</p>
          <p>© ${new Date().getFullYear()} SOES - Student Organization Election System</p>
        </div>
      </body>
    </html>
  `;

  // Use Gmail SMTP directly (Resend requires domain verification)
  try {
    await transporter.sendMail({
      from: `"SOES Elections" <${process.env.EMAIL_USER || 'studentorganizationelectionsys@gmail.com'}>`,
      to: email,
      subject: `Your Voting Credentials - ${electionTitle}`,
      html: htmlContent,
    });
    
    return { success: true, messageId: 'gmail-sent' };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: String(error) };
  }
}
