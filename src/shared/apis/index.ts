import axios from "axios";
import {
  clearAuthSession,
  getAccessToken,
  getAuthSession,
  getRefreshToken,
  setAuthSession,
} from "../lib/authSession";

const baseURL = import.meta.env.VITE_BASE_URL as string;

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;

    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/auth/login")) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/auth/signup")) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/auth/refresh")) {
      clearAuthSession();
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthSession();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (!refreshPromise) {
      refreshPromise = axios
        .post(`${baseURL}/api/auth/refresh`, { refreshToken }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const tokenData = response.data.data as {
            userId: number;
            accessToken: string;
            refreshToken: string;
            tokenType: string;
            accessTokenExpiresInSeconds: number;
          };
          const currentSession = getAuthSession();

          setAuthSession({
            user: currentSession.user,
            tokens: {
              accessToken: tokenData.accessToken,
              refreshToken: tokenData.refreshToken,
              tokenType: tokenData.tokenType,
              accessTokenExpiresInSeconds: tokenData.accessTokenExpiresInSeconds,
            },
          });

          return tokenData.accessToken;
        })
        .catch((refreshError) => {
          clearAuthSession();
          throw refreshError;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    const nextAccessToken = await refreshPromise;

    if (!nextAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

    return api(originalRequest);
  },
);
