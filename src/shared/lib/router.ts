import { useSyncExternalStore } from "react";

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);

  return () => window.removeEventListener("popstate", callback);
};

const getSnapshot = () => window.location.pathname;

export function usePathname() {
  return useSyncExternalStore(subscribe, getSnapshot, () => "/");
}

export function navigateTo(path: string) {
  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
