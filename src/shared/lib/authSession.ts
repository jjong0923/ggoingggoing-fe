import { useSyncExternalStore } from "react";

export type AuthUser = {
  email: string;
  id: string;
  nickname: string;
};

export type AuthTokens = {
  accessToken: string;
  accessTokenExpiresInSeconds: number;
  refreshToken: string;
  tokenType: string;
};

type StoredAuthSession = {
  tokens: AuthTokens | null;
  user: AuthUser | null;
};

const STORAGE_KEY = "ggoingggoing.auth.session";
const AUTH_EVENT = "ggoingggoing:auth-session-change";
const DEFAULT_SESSION = Object.freeze(createDefaultSession());

let cachedRawSession: string | null | undefined;
let cachedSession: StoredAuthSession = DEFAULT_SESSION;

function createDefaultSession(): StoredAuthSession {
  return {
    user: null,
    tokens: null,
  };
}

function readSession(): StoredAuthSession {
  if (typeof window === "undefined") {
    return DEFAULT_SESSION;
  }

  const rawSession = window.localStorage.getItem(STORAGE_KEY);

  if (cachedRawSession === rawSession) {
    return cachedSession;
  }

  if (!rawSession) {
    cachedRawSession = rawSession;
    cachedSession = DEFAULT_SESSION;
    return cachedSession;
  }

  try {
    const parsed = JSON.parse(rawSession) as Partial<StoredAuthSession>;

    cachedRawSession = rawSession;
    cachedSession = {
      user:
        parsed.user &&
        typeof parsed.user.id === "string" &&
        typeof parsed.user.email === "string" &&
        typeof parsed.user.nickname === "string"
          ? parsed.user
          : null,
      tokens:
        parsed.tokens &&
        typeof parsed.tokens.accessToken === "string" &&
        typeof parsed.tokens.refreshToken === "string" &&
        typeof parsed.tokens.tokenType === "string" &&
        typeof parsed.tokens.accessTokenExpiresInSeconds === "number"
          ? parsed.tokens
          : null,
    };

    return cachedSession;
  } catch {
    cachedRawSession = rawSession;
    cachedSession = DEFAULT_SESSION;
    return cachedSession;
  }
}

function writeSession(nextSession: StoredAuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  const serializedSession = JSON.stringify(nextSession);

  cachedRawSession = serializedSession;
  cachedSession = nextSession;
  window.localStorage.setItem(STORAGE_KEY, serializedSession);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(AUTH_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(AUTH_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useAuthUser() {
  return useSyncExternalStore(subscribe, () => readSession().user, () => null);
}

export function getAuthSession() {
  return readSession();
}

export function getAccessToken() {
  return readSession().tokens?.accessToken ?? null;
}

export function getRefreshToken() {
  return readSession().tokens?.refreshToken ?? null;
}

export function setAuthSession(nextSession: StoredAuthSession) {
  writeSession(nextSession);
}

export function clearAuthSession() {
  writeSession(createDefaultSession());
}
