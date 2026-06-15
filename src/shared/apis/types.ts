export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message: string;
  errorCode: string | null;
};

export type ContentType =
  | "ATTRACTION"
  | "RESTAURANT"
  | "CAFE"
  | "ACCOMMODATION"
  | "FESTIVAL"
  | "SHOPPING"
  | "ETC";

export type ContentSummary = {
  id: number;
  title: string;
  summary: string;
  regionName: string;
  themeName: string;
  thumbnailUrl: string;
  contentType: ContentType;
  viewCount: number;
  bookmarkCount: number;
  hot: boolean;
};

export type ContentDetailCard = {
  id: number;
  title: string;
  body: string;
  imageUrl: string;
  displayOrder: number;
};

export type ContentTag = {
  id: number;
  name: string;
};

export type ContentDetail = {
  id: number;
  title: string;
  summary: string;
  description: string;
  address: string;
  latitude: number;
  longitude: number;
  thumbnailUrl: string;
  contentType: ContentType;
  regionName: string;
  themeName: string;
  subThemeName: string;
  viewCount: number;
  bookmarkCount: number;
  hot: boolean;
  cards: ContentDetailCard[];
  tags: ContentTag[];
};

export type SearchKeyword = {
  keyword: string;
  searchCount: number;
};

export type RegionCategory = {
  id: number;
  name: string;
  displayOrder: number;
};

export type ThemeCategory = {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  contentCount: number;
};

export type SubThemeCategory = {
  id: number;
  name: string;
  displayOrder: number;
};

export type TagCategory = {
  id: number;
  name: string;
  displayOrder?: number;
};

export type BookmarkSummary = {
  bookmarkId: number;
  contentId: number;
  contentTitle: string;
  contentSummary: string;
  regionName: string;
  themeName: string;
  thumbnailUrl: string;
  contentType: ContentType;
  createdAt: string;
};

export type TripDurationType = "DAY_TRIP" | "OVERNIGHT" | "ONE_NIGHT_TWO_DAYS";

export type RoutePlace = {
  routePlaceId: number;
  contentId: number | null;
  name: string;
  placeType: ContentType;
  address: string;
  latitude: number;
  longitude: number;
  dayNumber: number;
  visitOrder: number;
  estimatedStayMinutes: number;
  moveMinutesFromPrevious: number | null;
  recommendationNote: string;
};

export type RouteDetail = {
  routeId: number;
  contentId: number;
  title: string;
  summary: string;
  tripDurationType: TripDurationType;
  totalDistanceMeters: number;
  totalDurationMinutes: number;
  mapCenterLatitude: number;
  mapCenterLongitude: number;
  places: RoutePlace[];
};

export type RouteGenerateRequest = {
  contentId: number;
  tripDurationType: Extract<TripDurationType, "DAY_TRIP" | "ONE_NIGHT_TWO_DAYS">;
};
