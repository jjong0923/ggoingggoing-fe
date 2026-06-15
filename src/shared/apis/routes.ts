import {
  generateMockRoute,
  getMockRouteDetail,
  getMockRoutesByRegion,
} from "../mocks/routes";
import { getCustomRouteDetail } from "../lib/customRoutes";
import type { RouteGenerateRequest } from "./types";

export async function getRoutesByRegion(regionId: number) {
  return getMockRoutesByRegion(regionId);
}

export async function getRouteDetail(routeId: number) {
  const route = getMockRouteDetail(routeId) ?? getCustomRouteDetail(routeId);

  if (!route) {
    throw new Error(`Route ${routeId} not found`);
  }

  return route;
}

export async function generateRoute(request: RouteGenerateRequest) {
  return generateMockRoute(request);
}
