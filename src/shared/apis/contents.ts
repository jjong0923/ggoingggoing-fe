import { api } from "./index";
import type {
  ApiResponse,
  ContentDetail,
  ContentSummary,
  ContentType,
} from "./types";

type ContentListParams = {
  contentType?: ContentType;
  regionId?: number;
  themeId?: number;
};

export async function getContents(params?: ContentListParams) {
  const response = await api.get<ApiResponse<ContentSummary[]>>("/api/contents", {
    params,
  });

  return response.data.data;
}

export async function getHotContents() {
  const response = await api.get<ApiResponse<ContentSummary[]>>("/api/contents/hot");

  return response.data.data;
}

export async function getContentDetail(contentId: number) {
  const response = await api.get<ApiResponse<ContentDetail>>(`/api/contents/${contentId}`);

  return response.data.data;
}
