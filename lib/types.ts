export type TaskCategory =
  | "kitchen"
  | "cleaning"
  | "organization"
  | "assembly"
  | "personal_care"
  | "office"
  | "outdoor";

export type TaskDifficulty = "easy" | "medium" | "hard";

export type HandsRequired = "one" | "both";

export interface Task {
  id: string;
  title: string;
  title_zh: string;
  category: TaskCategory;
  difficulty: TaskDifficulty;
  description: string;
  steps: string[];
  payout_usd: number;
  duration_min: number;
  duration_max: number;
  hands_required: HandsRequired;
  objects_expected: string[];
  camera_position: string;
  example_video_url: string | null;
  remaining_slots: number;
  total_completed: number;
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  quality_score: number;
  total_earnings: number;
  pending_earnings: number;
}

export type SubmissionStatus =
  | "uploading"
  | "uploaded"
  | "processing"
  | "accepted"
  | "rejected";

export interface Submission {
  id: string;
  task_id: string;
  video_url: string;
  duration_sec: number;
  status: SubmissionStatus;
  rejection_reason: string | null;
  payout_amount: number | null;
  created_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface ApiError {
  detail: string;
  status_code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}
