import { apiClient } from "./client";

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

