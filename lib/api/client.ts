const API_BASE = "/api/proxy";

export async function apiClient(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}/${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response;
}


