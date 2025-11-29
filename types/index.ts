// TypeScript type definitions

export interface User {
  id: string;
  email: string;
  phone: string;
  encrypted_real_name: string;
  date_of_birth: Date;
  gender: string;
  language_preference: "en" | "ti";
  is_admin: boolean;
  status: "active" | "suspended" | "deleted";
  onboardingComplete: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Match {
  id: string;
  created_by_admin_id: string;
  user1_id: string;
  user2_id: string;
  status: "proposed" | "accepted" | "declined" | "expired";
  created_at: Date;
  updated_at: Date;
}

export interface Profile {
  id: string;
  user_id: string;
  bio: string;
  location: string;
  occupation: string;
  education: string;
  religion: string;
  ethnicity: string;
  marital_status: string;
  children_count: number;
  visibility_status: "private" | "under_review" | "approved" | "rejected";
  created_at: Date;
  updated_at: Date;
}

export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  question_id: string;
  answer_option: string;
  score: number;
  created_at: Date;
  updated_at: Date;
}

export interface ChatSession {
  id: string;
  match_id: string;
  started_at: Date;
  expires_at: Date;
  status: "active" | "expired" | "closed";
  created_at: Date;
}

export interface Payment {
  id: string;
  chat_session_id: string;
  user_id: string;
  stripe_payment_id: string;
  amount: number;
  currency: string;
  status: "paid" | "refunded" | "failed";
  paid_at: Date | null;
  refunded_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

