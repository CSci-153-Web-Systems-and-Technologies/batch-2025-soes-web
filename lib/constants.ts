/**
 * Application Constants
 * Centralized location for all magic strings, routes, and configuration values
 */

// API Routes
export const API_ROUTES = {
  ELECTIONS: "/api/elections",
  CANDIDATES: "/api/candidates",
  VOTERS: "/api/voters",
  VOTES: "/api/votes",
  REPORTS: "/api/reports",
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  SIDEBAR_STATE: "sidebar_state",
  THEME: "theme",
  USER_PREFERENCES: "user_preferences",
} as const;

// Cookie Names
export const COOKIES = {
  SIDEBAR_STATE: "sidebar_state",
  AUTH_TOKEN: "auth_token",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  // Generic
  GENERIC: "An error occurred. Please try again.",
  NETWORK: "Network error. Please check your connection and try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",

  // Authentication
  AUTH_FAILED: "Authentication failed. Please log in again.",
  SESSION_EXPIRED: "Your session has expired. Please log in again.",
  INVALID_CREDENTIALS: "Invalid email or password.",
  EMAIL_NOT_VERIFIED: "Please verify your email address.",

  // Elections
  ELECTION_CREATE_FAILED: "Failed to create election. Please try again.",
  ELECTION_UPDATE_FAILED: "Failed to update election. Please try again.",
  ELECTION_DELETE_FAILED: "Failed to delete election. Please try again.",
  ELECTION_NOT_FOUND: "Election not found.",
  ELECTION_ALREADY_STARTED: "Cannot modify an election that has already started.",
  ELECTION_ENDED: "This election has ended.",

  // Candidates
  CANDIDATE_CREATE_FAILED: "Failed to add candidate. Please try again.",
  CANDIDATE_UPDATE_FAILED: "Failed to update candidate. Please try again.",
  CANDIDATE_DELETE_FAILED: "Failed to remove candidate. Please try again.",
  CANDIDATE_ALREADY_EXISTS: "This candidate already exists in the election.",

  // Voters
  VOTER_CREATE_FAILED: "Failed to add voter. Please try again.",
  VOTER_DELETE_FAILED: "Failed to remove voter. Please try again.",
  VOTER_ALREADY_EXISTS: "This voter is already registered for the election.",
  VOTER_NOT_ELIGIBLE: "You are not eligible to vote in this election.",

  // Voting
  VOTE_SUBMIT_FAILED: "Failed to submit vote. Please try again.",
  VOTE_ALREADY_CAST: "You have already voted in this election.",
  INVALID_VOTE: "Invalid vote selection. Please try again.",

  // Validation
  VALIDATION_FAILED: "Please check your input and try again.",
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_DATE: "Please enter a valid date.",
  DATE_RANGE_INVALID: "End date must be after start date.",

  // Import
  IMPORT_FAILED: "Failed to import data. Please check the file format.",
  INVALID_FILE: "Invalid file format. Please upload a valid file.",
  EMPTY_FILE: "The uploaded file is empty.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  // Elections
  ELECTION_CREATED: "Election created successfully.",
  ELECTION_UPDATED: "Election updated successfully.",
  ELECTION_DELETED: "Election deleted successfully.",
  ELECTION_PUBLISHED: "Election published successfully.",

  // Candidates
  CANDIDATE_ADDED: "Candidate added successfully.",
  CANDIDATE_UPDATED: "Candidate updated successfully.",
  CANDIDATE_REMOVED: "Candidate removed successfully.",
  CANDIDATES_IMPORTED: "Candidates imported successfully.",

  // Voters
  VOTER_ADDED: "Voter added successfully.",
  VOTER_REMOVED: "Voter removed successfully.",
  VOTERS_IMPORTED: "Voters imported successfully.",
  INVITATION_SENT: "Invitation sent successfully.",

  // Voting
  VOTE_SUBMITTED: "Your vote has been submitted successfully.",
  OTP_SENT: "OTP sent to your email.",
  OTP_VERIFIED: "OTP verified successfully.",

  // Authentication
  LOGIN_SUCCESS: "Logged in successfully.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  SIGNUP_SUCCESS: "Account created successfully.",
  PASSWORD_RESET_SENT: "Password reset email sent.",
  PASSWORD_UPDATED: "Password updated successfully.",
} as const;

// Validation Rules
export const VALIDATION_RULES = {
  EMAIL: {
    MIN_LENGTH: 5,
    MAX_LENGTH: 255,
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  ELECTION_TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 200,
  },
  ELECTION_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  CANDIDATE_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  POSITION_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  OTP: {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
  },
} as const;

// Election Status
export const ELECTION_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  ENDED: "ended",
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    EXCEL: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    CSV: ["text/csv"],
    IMAGE: ["image/jpeg", "image/png", "image/webp"],
  },
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  DISPLAY_WITH_TIME: "MMM dd, yyyy hh:mm a",
  API: "yyyy-MM-dd'T'HH:mm:ss",
  DATE_ONLY: "yyyy-MM-dd",
} as const;

// Routes
export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/sign-up",
  FORGOT_PASSWORD: "/forgot-password",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_ELECTIONS: "/admin/elections",
  ADMIN_CANDIDATES: "/admin/candidates",
  ADMIN_POSITIONS: "/admin/positions",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",

  // Voter
  VOTE: "/vote",
  BALLOT: "/ballot",
  SUCCESS: "/success",
} as const;

// Query Keys (for React Query if you add it later)
export const QUERY_KEYS = {
  ELECTIONS: "elections",
  ELECTION: "election",
  CANDIDATES: "candidates",
  VOTERS: "voters",
  POSITIONS: "positions",
  REPORTS: "reports",
  USER: "user",
  PROFILE: "profile",
} as const;
