import type { ContentSummary, ContentType, RouteDetail } from "../apis/types";

export const regionIdByLabel: Record<string, number> = {
  서울: 1,
  인천: 2,
  수도권: 1,
  충청: 3,
  대전: 3,
  대구: 4,
  광주: 5,
  부산: 6,
  "부산/경남": 6,
  울산: 7,
  세종: 8,
  경기: 9,
  강원: 10,
  충북: 11,
  충남: 12,
  경북: 13,
  경남: 14,
  전라: 15,
  전북: 15,
  전남: 16,
  제주: 17,
};

export const regionIdsByLabel: Record<string, number[]> = {
  전국: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
  수도권: [1, 2, 9],
  충청: [3, 8, 11, 12],
  대전: [3],
  대구: [4],
  광주: [5],
  부산: [6],
  "부산/경남": [6, 14],
  울산: [7],
  강원: [10],
  전라: [5, 15, 16],
  제주: [17],
};

export const themeIdByLabel: Record<string, number> = {
  맛집: 1,
  "자연/바다": 2,
  명소: 2,
  "도시/핫플": 3,
  "역사/문화": 4,
  루트: 4,
  힐링: 5,
  쇼핑: 6,
};

export const contentTypeByCategoryLabel: Record<string, ContentType> = {
  맛집: "RESTAURANT",
  명소: "ATTRACTION",
  루트: "ATTRACTION",
};

export function getRegionIdFromLabel(label: string) {
  return regionIdByLabel[label];
}

export function getRegionIdsFromLabel(label: string) {
  return regionIdsByLabel[label] ?? (regionIdByLabel[label] ? [regionIdByLabel[label]] : []);
}

export function getThemeIdFromLabel(label: string) {
  return themeIdByLabel[label];
}

export function getContentTypeFromCategoryLabel(label: string) {
  return contentTypeByCategoryLabel[label];
}

export function getCategoryLabelFromContentType(
  contentType: ContentSummary["contentType"],
) {
  if (contentType === "RESTAURANT" || contentType === "CAFE") {
    return "맛집" as const;
  }

  if (contentType === "ATTRACTION") {
    return "명소" as const;
  }

  return "루트" as const;
}

export function routeMatchesTheme(route: RouteDetail, theme: string) {
  if (theme === "all" || theme === "전체") {
    return true;
  }

  const placeTypes = route.places.map((place) => place.placeType);

  if (theme === "food" || theme === "맛집") {
    return placeTypes.some((type) => type === "RESTAURANT" || type === "CAFE");
  }

  if (theme === "spot" || theme === "명소") {
    return placeTypes.some((type) => type === "ATTRACTION");
  }

  if (theme === "route" || theme === "루트") {
    return route.places.length >= 3;
  }

  return true;
}
