import { useSyncExternalStore } from "react";
import type { BookmarkSummary, RouteDetail, RoutePlace } from "../apis/types";

const STORAGE_KEY = "ggoingggoing.custom-routes";
const ROUTE_EVENT = "ggoingggoing:custom-routes-change";

let cachedRawRoutes: string | null | undefined;
type StoredRouteDetail = RouteDetail & {
  sourceRouteId?: number;
};

let cachedRoutes: StoredRouteDetail[] = [];

function readRoutes(): StoredRouteDetail[] {
  if (typeof window === "undefined") {
    return [];
  }

  const rawRoutes = window.localStorage.getItem(STORAGE_KEY);

  if (cachedRawRoutes === rawRoutes) {
    return cachedRoutes;
  }

  if (!rawRoutes) {
    cachedRawRoutes = rawRoutes;
    cachedRoutes = [];
    return cachedRoutes;
  }

  try {
    cachedRawRoutes = rawRoutes;
    cachedRoutes = JSON.parse(rawRoutes) as StoredRouteDetail[];
    return cachedRoutes;
  } catch {
    cachedRawRoutes = rawRoutes;
    cachedRoutes = [];
    return cachedRoutes;
  }
}

function writeRoutes(nextRoutes: StoredRouteDetail[]) {
  if (typeof window === "undefined") {
    return;
  }

  const serializedRoutes = JSON.stringify(nextRoutes);
  cachedRawRoutes = serializedRoutes;
  cachedRoutes = nextRoutes;
  window.localStorage.setItem(STORAGE_KEY, serializedRoutes);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(ROUTE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(ROUTE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function buildRoutePlace(bookmark: BookmarkSummary, index: number): RoutePlace {
  return {
    routePlaceId: Number(`${bookmark.bookmarkId}${index + 1}`),
    contentId: bookmark.contentId,
    name: bookmark.contentTitle,
    placeType: bookmark.contentType,
    address: `${bookmark.regionName} · ${bookmark.themeName}`,
    latitude: 0,
    longitude: 0,
    dayNumber: 1,
    visitOrder: index + 1,
    estimatedStayMinutes: 50,
    moveMinutesFromPrevious: index === 0 ? null : 20,
    recommendationNote:
      bookmark.contentSummary || "저장한 장소를 이어서 만든 맞춤 루트예요.",
  };
}

export function useCustomRoutes() {
  return useSyncExternalStore(subscribe, readRoutes, () => []);
}

export function getCustomRouteDetail(routeId: number) {
  return readRoutes().find((route) => route.routeId === routeId);
}

export function createCustomRoute(routeName: string, bookmarks: BookmarkSummary[]) {
  const trimmedName = routeName.trim();

  if (!trimmedName || bookmarks.length === 0) {
    return null;
  }

  const routeId = Date.now();
  const places = bookmarks.slice(0, 3).map(buildRoutePlace);
  const nextRoute: StoredRouteDetail = {
    routeId,
    contentId: bookmarks[0].contentId,
    title: trimmedName,
    summary: `${bookmarks
      .slice(0, 3)
      .map((bookmark) => bookmark.contentTitle)
      .join(" > ")} 순서로 즐기는 맞춤 루트`,
    tripDurationType: "DAY_TRIP",
    totalDistanceMeters: 3000 + bookmarks.length * 700,
    totalDurationMinutes: 180 + bookmarks.length * 35,
    mapCenterLatitude: 0,
    mapCenterLongitude: 0,
    places,
  };

  writeRoutes([nextRoute, ...readRoutes()]);

  return nextRoute;
}

export function deleteCustomRoute(routeId: number) {
  const currentRoutes = readRoutes();
  const nextRoutes = currentRoutes.filter((route) => route.routeId !== routeId);

  if (nextRoutes.length === currentRoutes.length) {
    return false;
  }

  writeRoutes(nextRoutes);
  return true;
}

export function saveRouteDetailAsCustomRoute(
  route: RouteDetail,
  sourceRouteId?: number,
) {
  const currentRoutes = readRoutes();

  if (sourceRouteId) {
    const existingRoute = currentRoutes.find(
      (storedRoute) => storedRoute.sourceRouteId === sourceRouteId,
    );

    if (existingRoute) {
      return existingRoute;
    }
  }

  const routeId = Date.now();
  const nextRoute: StoredRouteDetail = {
    ...route,
    routeId,
    sourceRouteId,
  };

  writeRoutes([nextRoute, ...currentRoutes]);
  return nextRoute;
}

export function getCustomRouteBySourceRouteId(sourceRouteId: number) {
  return readRoutes().find((route) => route.sourceRouteId === sourceRouteId);
}
