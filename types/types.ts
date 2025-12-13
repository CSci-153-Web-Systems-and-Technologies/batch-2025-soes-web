// ============================================
// Template & Position Definitions
// ============================================

export interface TemplateDefinition {
  id?: string;
  title: string;
  rank: number;
  slots: number;
}

export interface PositionDefinition {
  id: string;
  created_at: string;
  name: string;
  order: number;
  vote_limit: number;
  template_id: string;
}

export interface PositionTemplate {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  category: string | null;
  status: "active" | "inactive" | string;
  usage_count: number | null;
  template_definitions?: PositionDefinition[];
}

// ============================================
// Election Types
// ============================================

export interface ElectionSession {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "active" | "ended";
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Election {
  id: string;
  title: string;
  description: string | null;
  status: "draft" | "active" | "ended";
  start_date: string;
  end_date: string;
  created_at: string;
}

// ============================================
// Position Types
// ============================================

export interface PositionRule {
  vote_limit?: number;
  allow_abstain?: boolean;
}

export interface Position {
  id: string;
  rank: number;
  title: string;
  rules: PositionRule | null;
  election_id?: string;
  candidates?: Candidate[];
}

export interface PositionResults {
  position_id: string;
  position_title: string;
  rank: number;
  vote_limit: number;
  allow_abstain: boolean;
  total_votes: number;
  candidates: VoteCount[];
}

// ============================================
// Candidate Types
// ============================================

export interface Candidate {
  id: string;
  student_id: string;
  full_name: string;
  nickname?: string | null;
  description: string | null;
  platform?: string | null;
  avatar_url: string | null;
  position_id?: string;
  partylist_id?: string | null;
  election_id?: string;
  positions?: {
    id: string;
    title: string;
  } | null;
  partylists?: {
    id: string;
    name: string;
  } | null;
}

export interface CandidateInfo {
  id: string;
  full_name: string;
  avatar_url: string | null;
}

export interface CandidateResult {
  candidate_id: string;
  full_name: string;
  position_title: string;
  vote_count: number;
  vote_percentage: number;
  rank: number;
}

export interface CandidateImportData {
  student_id: string;
  full_name: string;
  nickname?: string;
  platform?: string;
  partylist_name?: string;
}

// ============================================
// Voter Types
// ============================================

export interface Voter {
  id: string;
  school_id: string;
  full_name: string;
  email: string | null;
  has_voted: boolean;
  election_id?: string;
}

export interface VoterImportData {
  school_id: string;
  full_name: string;
  email?: string;
}

// ============================================
// Partylist Types
// ============================================

export interface Partylist {
  id: string;
  name: string;
  description: string | null;
  election_id: string;
  created_at: string;
  candidates?: Candidate[];
}

export interface GlobalPartylist {
  id: string;
  name: string;
  description: string | null;
}

export interface PartylistImportData {
  name: string;
  description?: string;
}

// ============================================
// Vote & Results Types
// ============================================

export interface VoteCount {
  candidate_id: string;
  vote_count: number;
  candidate: CandidateInfo;
}

export interface PositionResult {
  position_id: string;
  position_title: string;
  candidates: CandidateResult[];
  total_votes: number;
}

// ============================================
// Profile Types
// ============================================

export interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email?: string;
  role?: string | null;
  created_at?: string | null;
}

// ============================================
// Report & Statistics Types
// ============================================

export interface CompletedElection {
  id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export interface ReportData {
  election: {
    id: string;
    title: string;
    description: string | null;
    start_date: string;
    end_date: string;
    status: string;
  };
  stats: {
    total_voters: number;
    votes_cast: number;
    turnout_percentage: number;
    total_positions: number;
    total_candidates: number;
  };
  results: PositionResult[];
}

export interface Stats {
  total_voters: number;
  votes_cast: number;
  turnout_percentage: number;
  total_positions: number;
  total_candidates: number;
}

export interface StatCard {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

// ============================================
// Component Prop Types
// ============================================

export interface PositionOption {
  id: string;
  title: string;
}

export interface PartylistOption {
  id: string;
  name: string;
}

export interface PositionDraft {
  title: string;
  rank: number;
  slots: number;
}
