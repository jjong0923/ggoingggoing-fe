import axios from "axios";
import { api } from "./index";
import type { ApiResponse, ContentSummary, ContentType, SearchKeyword } from "./types";

type SearchFilterParams = {
  regionId?: number;
  themeId?: number;
  subThemeId?: number;
  contentType?: ContentType;
  tagIds?: number[];
};

export async function searchContents(keyword: string) {
  const response = await api.get<ApiResponse<ContentSummary[]>>("/api/search", {
    params: { q: keyword },
  });

  return response.data.data;
}

export async function getPopularSearches() {
  const response = await api.get<ApiResponse<SearchKeyword[]>>("/api/search/popular");

  return response.data.data;
}

export async function searchContentsByFilter(params?: SearchFilterParams) {
  const response = await api.get<ApiResponse<ContentSummary[]>>("/api/search/filter", {
    params,
    paramsSerializer: {
      serialize: (searchParams) => {
        const urlSearchParams = new URLSearchParams();

        Object.entries(searchParams).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((item) => urlSearchParams.append(key, String(item)));
            return;
          }

          if (value !== undefined && value !== null) {
            urlSearchParams.append(key, String(value));
          }
        });

        return urlSearchParams.toString();
      },
    },
  });

  return response.data.data;
}

export async function getRecentSearches() {
  try {
    const response = await api.get<ApiResponse<string[]>>("/api/search/recent");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return [];
    }

    throw error;
  }
}
