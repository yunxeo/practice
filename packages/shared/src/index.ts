// ─── Enums ──────────────────────────────────────────────────────────────────

export enum UserRole {
  STUDENT = 'student',
  ADMIN = 'admin',
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  nickname: string;
  role: UserRole;
  avatarUrl: string | null;
  bio: string | null;
  university: UniversitySummary | null;
  isVerified: boolean;
  createdAt: string;
}

// ─── University ──────────────────────────────────────────────────────────────

export interface UniversitySummary {
  id: string;
  name: string;
  shortName: string | null;
  logoUrl: string | null;
}

export interface University extends UniversitySummary {
  domain: string | null;
  location: string | null;
  establishedYear: number | null;
  professorCount: number;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  college: string | null;
}

// ─── Professor ───────────────────────────────────────────────────────────────

export interface ProfessorTag {
  label: string;
  count: number;
}

export interface ProfessorRatings {
  overall: number;
  difficulty: number;
  clarity: number;
  helpfulness: number;
}

export interface ProfessorSummary {
  id: string;
  name: string;
  position: string | null;
  photoUrl: string | null;
  department: Department | null;
  university: UniversitySummary;
  avgRating: number;
  avgDifficulty: number;
  reviewCount: number;
  topTags: string[];
}

export interface Professor extends ProfessorSummary {
  email: string | null;
  bio: string | null;
  researchAreas: string[];
  ratings: ProfessorRatings;
  tags: ProfessorTag[];
  aiSummary: string | null;
  aiSummaryUpdatedAt: string | null;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface ReviewRatings {
  overall: number;
  difficulty: number;
  clarity: number;
  helpfulness: number;
}

export interface ReviewAuthor {
  id: string;
  nickname: string;
  avatarUrl: string | null;
}

export interface Review {
  id: string;
  professorId: string;
  content: string;
  ratings: ReviewRatings;
  courseName: string | null;
  semester: string | null;
  isAnonymous: boolean;
  author: ReviewAuthor | null;
  likesCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  user: UserProfile;
}

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface AiSummaryResponse {
  professorId: string;
  summary: string;
  updatedAt: string;
  reviewCount: number;
}
