import { apiClient } from "./client";

export async function getUsers(filters?: {
  age?: number;
  religion?: string;
  status?: string;
}) {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
  }
  const query = queryParams.toString();
  const response = await apiClient(
    `admin/users${query ? `?${query}` : ""}`,
    {
      method: "GET",
    }
  );
  return response.json();
}

export async function getUserById(id: string) {
  const response = await apiClient(`admin/users/${id}`, {
    method: "GET",
  });
  return response.json();
}

export async function proposeMatch(data: {
  user1Id: string;
  user2Id: string;
  notes: string;
}) {
  const response = await apiClient("admin/matches", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response.json();
}

