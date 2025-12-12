# Email Voter Credentials Feature

## Setup

### 1. Resend Configuration

1. Sign up for a free account at [resend.com](https://resend.com)
2. Verify your sending domain (or use the testing domain for development)
3. Generate an API key from the Resend dashboard
4. Copy your API key

### 2. Environment Variables

Add to your `.env.local` file:

```env
RESEND_API_KEY=re_your_api_key_here
RESEND_FROM_EMAIL=SOES Elections <noreply@yourdomain.com>
```

**Note:**

- For testing, you can use `onboarding@resend.dev` as the from address
- For production, verify your own domain in Resend and use that

## Features

### What Gets Sent

Each voter receives an email containing:

- Their full name
- One-time voting code (access code)
- Direct link to cast their ballot
- Direct link to view live results
- Election title and description
- Step-by-step voting instructions
- Security reminder about keeping code private

### Email Template

The email is professionally formatted with:

- Gradient header with election title
- Credentials box with voter name and access code
- Security warning banner
- Step-by-step voting instructions
- Two prominent buttons (Cast Vote & View Results)
- Direct text links as backup
- Footer with SOES branding

## Usage

### Send to All Voters

1. Go to Elections → [Election Name] → Voters tab
2. Click the **"Email Voters"** button
3. Confirm in the dialog
4. Wait for confirmation with success/failure count

### API Endpoint

```typescript
POST /api/send-voter-emails

Body:
{
  "electionId": "uuid",
  "voterIds": ["uuid1", "uuid2"] // optional, omit to send to all
}

Response:
{
  "success": true,
  "sent": 10,
  "failed": 2,
  "total": 12,
  "failedVoters": [...]  // only if there are failures
}
```

## Requirements

- Voters must have valid email addresses in the database
- Resend API key must be configured in environment variables
- A verified sending domain (or use Resend's test domain for development)
- Election must have ballot and results URLs configured

## Troubleshooting

### Emails not sending

- Check that `RESEND_API_KEY` is set correctly in `.env.local`
- Verify your API key is active in Resend dashboard
- Check Resend logs for detailed error messages

### Some emails fail

- Voters may not have email addresses in the database
- Check the failed voters list in the response
- Invalid email addresses will be skipped

### Email goes to spam

- Verify your domain in Resend
- Set up proper SPF, DKIM, and DMARC records
- Use a custom domain instead of the test domain

## Why Resend?

Resend offers several advantages:

- **Easy setup** - No 2FA or app passwords needed
- **Better deliverability** - Professional email infrastructure
- **Detailed analytics** - Track opens, clicks, bounces
- **Generous free tier** - 3,000 emails/month free
- **Modern API** - Simple, clean TypeScript SDK
- **Domain verification** - Professional sending domains
