# SOES - Student Organization Election System

<div align="center">

![SOES Banner](./public/logo.svg)

**Streamline your student organization elections with a secure, transparent, and modern platform**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.86.0-3ECF8E?logo=supabase)](https://supabase.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features-in-detail)
- [Authentication Flow](#-authentication-flow)
- [Voting System](#-voting-system)
- [Admin Dashboard](#-admin-dashboard)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SOES (Student Organization Election System)** is a comprehensive, full-stack web application designed to manage student organization elections from start to finish. Built with modern technologies, it provides a secure, user-friendly platform for administrators to create and manage elections, and for voters to cast their ballots anonymously.

### Why SOES?

- **🔒 Secure & Anonymous**: End-to-end encrypted voting ensures ballot secrecy
- **📊 Real-time Results**: Live result tracking with automatic updates
- **📱 Mobile-First**: Responsive design works seamlessly on all devices
- **🎨 Modern UI/UX**: Clean, intuitive interface with dark mode support
- **⚡ Fast & Scalable**: Built on Next.js 15 with Turbopack for optimal performance
- **🔐 Role-Based Access**: Separate interfaces for administrators and voters

---

## ✨ Features

### For Administrators

- **Election Management**: Create, activate, deactivate, and end elections
- **Position & Candidate Management**: Define positions and manage candidates
- **Voter Management**: Import voters via CSV, send email invitations
- **Partylist System**: Organize candidates into political groups
- **Template System**: Save and reuse position templates
- **Live Monitoring**: Track voter turnout and participation in real-time
- **Results & Reports**: Generate comprehensive election reports (CSV/PDF)
- **Multi-Election Support**: Manage multiple elections simultaneously

### For Voters

- **OTP Authentication**: Secure one-time password login via email
- **Interactive Ballot**: User-friendly ballot interface with candidate information
- **Vote Confirmation**: Review selections before final submission
- **Receipt System**: Confirmation of successful vote submission
- **Live Results**: View election results in real-time after voting closes

### Security Features

- **Anonymous Voting**: Votes cannot be traced back to individual voters
- **One Vote Per Person**: System prevents double voting
- **Email Verification**: OTP-based authentication ensures voter identity
- **Encrypted Storage**: All sensitive data encrypted at rest and in transit
- **Audit Trail**: Complete election history for transparency

---

## 🛠 Tech Stack

### Frontend

- **Framework**: [Next.js 15.5.6](https://nextjs.org/) with App Router
- **UI Library**: [React 19.1.0](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Components**: [Radix UI](https://www.radix-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes) for dark mode

### Backend & Database

- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth with OTP
- **API**: Next.js API Routes + Server Actions
- **Email**: [Resend](https://resend.com/) / [Nodemailer](https://nodemailer.com/)

### Development Tools

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: Turbopack
- **Linting**: ESLint
- **Package Manager**: npm
- **Version Control**: Git

### Additional Libraries

- **CSV Parsing**: [PapaParse](https://www.papaparse.com/)
- **Excel Export**: [xlsx](https://sheetjs.com/)
- **PDF Generation**: [PDFKit](https://pdfkit.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Image Capture**: [html2canvas](https://html2canvas.hertzen.com/)

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **Supabase Account** (for database and authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-soes-web.git
   cd batch-2025-soes-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Set up the database schema (see `database-schema.sql`)
   - Enable Email Auth in Supabase dashboard
   - Configure email templates for OTP

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (Resend or Nodemailer)
RESEND_API_KEY=your_resend_api_key

# Optional: Email Configuration for Nodemailer
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Running the Application

**Development Mode:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Production Build:**

```bash
npm run build
npm start
```

**Linting:**

```bash
npm run lint
```

---

## 📁 Project Structure

```
batch-2025-soes-web/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── login/
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   └── _components/          # Auth-specific components
│   ├── (authenticated)/          # Protected admin routes
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── admin/
│   │   │   ├── dashboard/        # Overview & statistics
│   │   │   ├── elections/        # Election management
│   │   │   │   ├── [id]/         # Election detail pages
│   │   │   │   │   ├── positions/
│   │   │   │   │   ├── candidates/
│   │   │   │   │   ├── voters/
│   │   │   │   │   ├── partylists/
│   │   │   │   │   ├── results/
│   │   │   │   │   └── settings/
│   │   │   │   └── _components/  # Election components
│   │   │   ├── positions/        # Position templates
│   │   │   ├── partylists/       # Global partylists
│   │   │   └── reports/          # Reports & analytics
│   │   └── profile/              # User profile
│   ├── (unauthenticated)/        # Public voting routes
│   │   ├── vote/                 # OTP login for voting
│   │   ├── ballot/[id]/          # Ballot casting
│   │   ├── success/              # Vote confirmation
│   │   └── results/[id]/         # Public results view
│   ├── (landing)/                # Landing page
│   └── globals.css               # Global styles
├── components/                   # Shared components
│   ├── ui/                       # shadcn/ui components
│   ├── app-sidebar.tsx           # Admin sidebar
│   ├── Header.tsx
│   └── theme-provider.tsx
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
│   ├── election-action.ts        # Election server actions
│   ├── vote-action.ts            # Voting server actions
│   └── utils.ts
├── types/                        # TypeScript type definitions
│   └── types.ts                  # Centralized types
├── utils/                        # Helper utilities
│   └── supabase/                 # Supabase client configs
│       ├── client.ts             # Client-side Supabase
│       ├── server.ts             # Server-side Supabase
│       └── proxy.ts              # Proxy configuration
├── public/                       # Static assets
│   └── logo.svg
├── .env.local                    # Environment variables (not committed)
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 🔑 Key Features in Detail

### 1. Election Lifecycle Management

**Draft → Active → Ended**

- **Draft**: Set up positions, candidates, and voters
- **Active**: Voting is open, ballots can be cast
- **Ended**: Results are finalized and public

### 2. Position System

- Define multiple positions per election
- Set vote limits (e.g., "Vote for up to 3 senators")
- Enable/disable abstain option
- Rank positions for ballot ordering
- Save as templates for reuse

### 3. Candidate Management

- Add candidates manually or via CSV import
- Assign to positions and partylists
- Upload avatars and platforms
- View candidate profiles on ballots

### 4. Voter Management

- Import voters from CSV (school_id, full_name, email)
- Send email invitations with ballot links
- Track voting status (voted/not voted)
- Prevent duplicate voters

### 5. Partylist System

- Create political groups/parties
- Assign candidates to partylists
- View candidates by partylist
- Optional partylist affiliation

### 6. Real-Time Results

- Live vote counting
- Position-wise results
- Candidate rankings
- Turnout statistics
- Export to CSV/PDF

### 7. Security & Privacy

- OTP-based voter authentication
- Anonymous vote storage
- Encrypted ballot submissions
- One-time voting enforcement
- Audit logs for administrators

---

## 🔐 Authentication Flow

### Admin Authentication

1. Sign up with email/password
2. Email verification
3. Access admin dashboard
4. Manage elections

### Voter Authentication

1. Receive ballot link via email
2. Enter school ID
3. Request OTP via email
4. Enter OTP code
5. Cast ballot
6. One-time access only

---

## 🗳️ Voting System

### Ballot Casting Process

1. **Authentication**: Voter logs in with school ID + OTP
2. **Ballot Display**: Positions shown in ranked order
3. **Candidate Selection**:
   - Radio buttons for single-choice positions
   - Checkboxes for multi-choice positions
   - Abstain option (if enabled)
4. **Vote Review**: Confirmation dialog shows all selections
5. **Submission**: Encrypted vote stored anonymously
6. **Receipt**: Success page confirms vote recorded

### Vote Storage

- Votes stored separately from voter identity
- No way to trace vote back to voter
- Only voting status (has_voted) is linked to voter
- Vote counts aggregated for results

---

## 👨‍💼 Admin Dashboard

### Dashboard Features

**Statistics Cards:**

- Total elections (draft, active, ended)
- Active voters
- Total candidates
- Completed elections

**Election Selector:**

- Dropdown to switch between elections
- Quick access to election details

**Quick Actions:**

- View results
- Manage voters
- Add candidates
- Export reports

### Election Detail Page

**Tab Navigation:**

- Overview: Election statistics and status
- Positions: Manage positions and ordering
- Candidates: Add/import candidates
- Voters: Add/import eligible voters
- Partylists: Organize candidates by party
- Results: View live results
- Settings: Election configuration

**Action Buttons:**

- Activate/Deactivate election
- Share ballot links
- End election session
- Export reports

---

## 💻 Development

### Key Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

### Code Structure Guidelines

**File Organization:**

- Group related components in `_components` folders
- Use server components by default
- Mark client components with `"use client"`
- Keep server actions in separate files (`*-action.ts`)

**Naming Conventions:**

- Components: PascalCase (e.g., `ElectionCard.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: PascalCase (e.g., `Election`, `Candidate`)
- Server actions: camelCase with Action suffix (e.g., `createElectionAction`)

**Type Safety:**

- All types centralized in `/types/types.ts`
- Use TypeScript strict mode
- Avoid `any` types
- Define interfaces for all data structures

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

**Environment Variables:**
Ensure all production environment variables are set:

- Supabase URL and keys
- Email service credentials
- Public app URL

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **shadcn/ui** for the beautiful component library
- **Vercel** for Next.js and deployment platform
- **Supabase** for the backend infrastructure
- **Radix UI** for accessible component primitives
- All contributors who have helped improve this project

---

## 📧 Contact & Support

**Project Maintainers:**

- Repository: [CSci-153-Web-Systems-and-Technologies/batch-2025-soes-web](https://github.com/CSci-153-Web-Systems-and-Technologies/batch-2025-soes-web)

**Need Help?**

- Open an issue on GitHub
- Check existing documentation
- Review the code comments

---

<div align="center">

**Made with ❤️ by Shn Kerby C. Dolamos for Student Organizations**

_Empowering democratic processes through technology_

</div>
