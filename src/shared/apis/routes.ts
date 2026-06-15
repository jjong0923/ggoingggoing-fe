import { api } from "./index";
import type { ApiResponse, RouteDetail, RouteGenerateRequest } from "./types";

export async function getRoutesByRegion(regionId: number) {
  const response = await api.get<ApiResponse<RouteDetail[]>>("/api/routes", {
    params: { regionId },
  });

  return response.data.data;
}

export async function getRouteDetail(routeId: number) {
  const response = await api.get<ApiResponse<RouteDetail>>(`/api/routes/${routeId}`);

  return response.data.data;
}

export async function generateRoute(request: RouteGenerateRequest) {
  const response = await api.post<ApiResponse<RouteDetail>>("/api/routes/generate", request);

  return response.data.data;
}
