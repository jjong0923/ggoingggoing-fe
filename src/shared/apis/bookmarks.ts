import { api } from "./index";
import type { ApiResponse, BookmarkSummary } from "./types";

export async function getBookmarks() {
  const response = await api.get<ApiResponse<BookmarkSummary[]>>("/api/bookmarks");

  return response.data.data;
}

export async function addBookmark(contentId: number) {
  const response = await api.post<ApiResponse<BookmarkSummary>>("/api/bookmarks", {
    contentId,
  });

  return response.data.data;
}

export async function deleteBookmark(bookmarkId: number) {
  await api.delete<ApiResponse<null>>(`/api/bookmarks/${bookmarkId}`);
}

export async function deleteBookmarks(bookmarkIds: number[]) {
  await api.delete<ApiResponse<null>>("/api/bookmarks", {
    data: { bookmarkIds },
  });
}
