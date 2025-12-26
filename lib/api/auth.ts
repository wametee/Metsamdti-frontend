import { apiClient } from "./client";
import httpClient from "@/lib/httpClient/index";

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
}

export async function login(input: LoginInput) {
  const response = await apiClient("auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function signup(input: SignupInput) {
  const response = await apiClient("auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return response.json();
}

export async function verify(token: string) {
  const response = await apiClient(`auth/verify/${token}`, {
    method: "POST",
  });
  return response.json();
}

export async function getCurrentUser() {
  const response = await apiClient("auth/me", {
    method: "GET",
  });
  return response.json();
}

export async function acceptTerms() {
  const response = await apiClient("auth/accept-terms", {
    method: "POST",
  });
  return response.json();
}

export interface UserDashboardStats {
  myMatches: number;
  activeChats: number;
  totalSpent: number;
  thisMonthSpent: number;
  profileViews: number;
  pendingMatches: number;
  acceptedMatches: number;
  rejectedMatches: number;
  photos: number;
  profileCompletion: number;
  profileStatus: string;
  lastMatchDate: string | null;
  lastMessageDate: string | null;
  profileUpdatedDate: string | null;
}

export interface UserDashboardStatsResponse {
  success: boolean;
  stats: UserDashboardStats | null;
  error?: string;
}

export async function getUserDashboardStats(): Promise<UserDashboardStatsResponse> {
  try {
    const response = await httpClient.get<UserDashboardStatsResponse>('/auth/dashboard/stats');
    return response.data;
  } catch (error: any) {
    console.error('[AuthAPI] Error fetching user dashboard stats:', error);
    return {
      success: false,
      stats: null,
      error: error.message || 'Failed to fetch dashboard statistics',
    };
  }
}

