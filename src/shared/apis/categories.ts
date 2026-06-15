import { api } from "./index";
import type {
  ApiResponse,
  RegionCategory,
  SubThemeCategory,
  TagCategory,
  ThemeCategory,
} from "./types";

export async function getRegions() {
  const response = await api.get<ApiResponse<RegionCategory[]>>("/api/categories/regions");

  return response.data.data;
}

export async function getThemes() {
  const response = await api.get<ApiResponse<ThemeCategory[]>>("/api/categories/themes");

  return response.data.data;
}

export async function getSubThemes(themeId: number) {
  const response = await api.get<ApiResponse<SubThemeCategory[]>>(
    `/api/categories/themes/${themeId}/sub-themes`,
  );

  return response.data.data;
}

export async function getTags() {
  const response = await api.get<ApiResponse<TagCategory[]>>("/api/categories/tags");

  return response.data.data;
}
