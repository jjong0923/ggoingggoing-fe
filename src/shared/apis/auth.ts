import { api } from "./index";
import type { ApiResponse } from "./types";

export type SignupRequest = {
  email: string;
  password: string;
  nickname: string;
};

export type SignupResponse = {
  userId: number;
  email: string;
  nickname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenResponse = {
  userId: number;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresInSeconds: number;
};

export async function signup(request: SignupRequest) {
  const response = await api.post<ApiResponse<SignupResponse>>("/api/auth/signup", request);

  return response.data.data;
}

export async function login(request: LoginRequest) {
  const response = await api.post<ApiResponse<TokenResponse>>("/api/auth/login", request);

  return response.data.data;
}

export async function refresh(refreshToken: string) {
  const response = await api.post<ApiResponse<TokenResponse>>("/api/auth/refresh", {
    refreshToken,
  });

  return response.data.data;
}

export async function logout(refreshToken: string) {
  const response = await api.post<ApiResponse<null>>("/api/auth/logout", {
    refreshToken,
  });

  return response.data.data;
}
