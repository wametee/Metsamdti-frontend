import httpClient from "@/lib/httpClient/index";

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'verified' | 'flagged' | 'matched' | 'unmatched' | 'all';
  includeTemp?: boolean;
  role?: 'users' | 'admin' | 'superAdmin';
}

export interface User {
  id: string;
  alias: string;
  fullName: string;
  age: number | null;
  gender: string;
  location: string;
  status: 'verified' | 'flagged' | 'matched' | 'unmatched';
  email: string;
  verified: boolean;
  role: string;
  recommendedMatches: number;
  createdAt: string;
  lastActiveAt: string | null;
  onboardingStatus: string | null;
  onboardingCompletedAt: string | null;
}

export interface GetUsersResponse {
  success: boolean;
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

/**
 * Get all users with filtering and pagination
 * Requires admin authentication
 */
export async function getUsers(params: GetUsersParams = {}): Promise<GetUsersResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.includeTemp) queryParams.append('includeTemp', 'true');
    if (params.role) queryParams.append('role', params.role);

    const query = queryParams.toString();
    const response = await httpClient.get<GetUsersResponse>(
      `/admin/users${query ? `?${query}` : ''}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching users:', error);
    return {
      success: false,
      users: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        total: 0,
        totalPages: 0,
      },
      error: error.message || 'Failed to fetch users',
    };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  try {
    const response = await httpClient.get(`/admin/users/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching user:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch user',
    };
  }
}

/**
 * Update user status (verify, flag, suspend, etc.)
 */
export async function updateUserStatus(
  userId: string,
  updates: {
    verified?: boolean;
    status?: 'active' | 'suspended' | 'deleted';
    role?: 'users' | 'admin' | 'superAdmin';
  }
) {
  try {
    const response = await httpClient.patch(`/admin/users/${userId}/status`, updates);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error updating user status:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user status',
    };
  }
}

// ============================================================================
// Interview API Functions
// ============================================================================

export interface GetInterviewsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show' | 'all';
  adminId?: string;
}

export interface Interview {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  adminId: string;
  adminName: string;
  scheduledAt: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetInterviewsResponse {
  success: boolean;
  interviews: Interview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

/**
 * Get all interviews with filtering and pagination
 */
export async function getInterviews(params: GetInterviewsParams = {}): Promise<GetInterviewsResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);
    if (params.adminId) queryParams.append('adminId', params.adminId);

    const query = queryParams.toString();
    const response = await httpClient.get<GetInterviewsResponse>(
      `/admin/interviews${query ? `?${query}` : ''}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching interviews:', error);
    return {
      success: false,
      interviews: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        total: 0,
        totalPages: 0,
      },
      error: error.message || 'Failed to fetch interviews',
    };
  }
}

/**
 * Schedule a new interview
 */
export async function scheduleInterview(data: {
  userId: string;
  adminId: string;
  scheduledAt: string;
  notes?: string;
}) {
  try {
    const response = await httpClient.post('/admin/interviews', data);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error scheduling interview:', error);
    return {
      success: false,
      error: error.message || 'Failed to schedule interview',
    };
  }
}

/**
 * Update interview status or details
 */
export async function updateInterview(
  interviewId: string,
  updates: {
    status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show';
    scheduledAt?: string;
    notes?: string;
    cancellationReason?: string;
  }
) {
  try {
    const response = await httpClient.patch(`/admin/interviews/${interviewId}`, updates);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error updating interview:', error);
    return {
      success: false,
      error: error.message || 'Failed to update interview',
    };
  }
}

/**
 * Delete interview
 */
export async function deleteInterview(interviewId: string) {
  try {
    const response = await httpClient.delete(`/admin/interviews/${interviewId}`);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error deleting interview:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete interview',
    };
  }
}

// ============================================================================
// Matches API Functions
// ============================================================================

export interface GetMatchesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'proposed' | 'accepted' | 'declined' | 'expired' | 'active' | 'cancelled' | 'all';
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  status: 'proposed' | 'accepted' | 'declined' | 'expired' | 'active' | 'cancelled';
  adminNote?: string;
  user1Accepted?: boolean;
  user2Accepted?: boolean;
  acceptedAt?: string;
  createdAt: string;
  updatedAt: string;
  user1?: {
    id: string;
    email: string;
    display_name?: string;
    real_name?: string;
  };
  user2?: {
    id: string;
    email: string;
    display_name?: string;
    real_name?: string;
  };
  profile1?: {
    user_id: string;
    display_name?: string;
    full_name?: string;
    age?: number;
    gender?: string;
    current_location?: string;
  };
  profile2?: {
    user_id: string;
    display_name?: string;
    full_name?: string;
    age?: number;
    gender?: string;
    current_location?: string;
  };
  compatibility?: {
    compatibilityScore: number;
    sharedTags: string[];
    emotionalMatch: number;
    relationshipMatch: number;
  };
}

export interface GetMatchesResponse {
  success: boolean;
  matches: Match[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export interface CompatibilityResponse {
  success: boolean;
  compatibility: {
    compatibilityScore: number;
    sharedTags: string[];
    emotionalMatch: number;
    relationshipMatch: number;
  };
  error?: string;
}

export interface PotentialMatchesResponse {
  success: boolean;
  matches: Array<{
    userId: string;
    compatibilityScore: number;
    sharedTags: string[];
    emotionalMatch: number;
    relationshipMatch: number;
  }>;
  error?: string;
}

/**
 * Get all matches with filtering and pagination
 */
export async function getMatches(params: GetMatchesParams = {}): Promise<GetMatchesResponse> {
  try {
  const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status && params.status !== 'all') queryParams.append('status', params.status);

    const query = queryParams.toString();
    const response = await httpClient.get<GetMatchesResponse>(
      `/admin/matches${query ? `?${query}` : ''}`
    );
    
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching matches:', error);
    return {
      success: false,
      matches: [],
      pagination: {
        page: params.page || 1,
        limit: params.limit || 50,
        total: 0,
        totalPages: 0,
      },
      error: error.message || 'Failed to fetch matches',
    };
  }
}

/**
 * Get compatibility score between two users
 */
export async function getCompatibility(user1Id: string, user2Id: string): Promise<CompatibilityResponse> {
  try {
    const response = await httpClient.get<CompatibilityResponse>(
      `/admin/matches/compatibility/${user1Id}/${user2Id}`
    );
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error calculating compatibility:', error);
    return {
      success: false,
      compatibility: {
        compatibilityScore: 0,
        sharedTags: [],
        emotionalMatch: 0,
        relationshipMatch: 0,
      },
      error: error.message || 'Failed to calculate compatibility',
    };
  }
}

/**
 * Get potential matches for a user
 */
export async function getPotentialMatches(
  userId: string,
  options: {
    limit?: number;
    minCompatibility?: number;
  } = {}
): Promise<PotentialMatchesResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.minCompatibility) queryParams.append('minCompatibility', options.minCompatibility.toString());

    const query = queryParams.toString();
    const response = await httpClient.get<PotentialMatchesResponse>(
      `/admin/matches/potential/${userId}${query ? `?${query}` : ''}`
    );
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error finding potential matches:', error);
    return {
      success: false,
      matches: [],
      error: error.message || 'Failed to find potential matches',
    };
  }
}

/**
 * Propose a match between two users
 */
export async function proposeMatch(data: {
  user1Id: string;
  user2Id: string;
  adminNote?: string;
}) {
  try {
    const response = await httpClient.post('/admin/matches', data);
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error proposing match:', error);
    return {
      success: false,
      error: error.message || 'Failed to propose match',
    };
  }
}

// ============================================================================
// Dashboard Statistics API Functions
// ============================================================================

export interface AdminDashboardStats {
  scheduledInterviews: number;
  weeklyNewUsers: number;
  totalEarned: number;
  totalMatches: number;
  successfulMatches: number;
  matchSuccessRate: number;
  completedProfiles: number;
  incompleteProfiles: number;
  flaggedProfiles: number;
  pendingApprovalProfiles: number;
  maleUsers: number;
  femaleUsers: number;
  ageGroups: { [key: string]: { count: number; percentage: number } };
}

export interface AdminDashboardStatsResponse {
  success: boolean;
  stats: AdminDashboardStats | null;
  error?: string;
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminDashboardStats(): Promise<AdminDashboardStatsResponse> {
  try {
    const response = await httpClient.get<AdminDashboardStatsResponse>('/admin/dashboard/stats');
    return response.data;
  } catch (error: any) {
    console.error('[AdminAPI] Error fetching dashboard stats:', error);
    return {
      success: false,
      stats: null,
      error: error.message || 'Failed to fetch dashboard statistics',
    };
  }
}

