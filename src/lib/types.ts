// ─── Database Types ──────────────────────────────────────────

export type UserRole = "teacher" | "student";
export type StudentLevel = "2nde" | "1ere" | "terminale" | "autre";
export type HomeworkStatus = "assigned" | "submitted" | "reviewed";
export type BookingStatus = "pending" | "accepted" | "declined" | "cancelled";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  level: StudentLevel | null;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  file_url: string | null;
  target_level: StudentLevel | null;
  published: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Homework {
  id: string;
  title: string;
  description: string;
  file_url: string | null;
  deadline: string | null;
  target_level: StudentLevel | null;
  target_student: string | null;
  status: HomeworkStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  homework_id: string;
  student_id: string;
  file_url: string | null;
  comment: string;
  submitted_at: string;
  feedback: string | null;
  grade: string | null;
  reviewed_at: string | null;
}

export interface Availability {
  id: string;
  teacher_id: string;
  day: DayOfWeek;
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at: string;
}

export interface AvailabilityException {
  id: string;
  teacher_id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  reason: string;
  created_at: string;
}

export interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_level: StudentLevel | null;
  guest_message: string;
  date: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  teacher_id: string;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  to_email: string;
  subject: string;
  template: string;
  payload: Record<string, unknown>;
  status: string;
  error: string | null;
  sent_at: string;
}

// ─── Form / Action types ────────────────────────────────────

export interface ActionResult {
  success: boolean;
  error?: string;
  data?: unknown;
}

export const LEVELS: { value: StudentLevel; label: string }[] = [
  { value: "2nde", label: "2nde" },
  { value: "1ere", label: "1ère" },
  { value: "terminale", label: "Terminale" },
  { value: "autre", label: "Autre" },
];

export const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Lundi" },
  { value: "tuesday", label: "Mardi" },
  { value: "wednesday", label: "Mercredi" },
  { value: "thursday", label: "Jeudi" },
  { value: "friday", label: "Vendredi" },
  { value: "saturday", label: "Samedi" },
  { value: "sunday", label: "Dimanche" },
];

export const SESSION_DURATION_MINUTES = 150;
