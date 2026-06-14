export const routePaths = {
  onboarding: "/",
  home: "/home",
  search: "/search",
  contentDetail: "/contents/:contentId",
  routeResult: "/routes/:routeId",
  collection: "/collections",
  my: "/my",
  theme: "/themes",
  roulette: "/roulette",
} as const;

export const buildPath = {
  onboarding: () => routePaths.onboarding,
  home: () => routePaths.home,
  search: () => routePaths.search,
  contentDetail: (contentId: string) => `/contents/${contentId}`,
  routeResult: (routeId: string) => `/routes/${routeId}`,
  collection: () => routePaths.collection,
  my: () => routePaths.my,
  theme: () => routePaths.theme,
  roulette: () => routePaths.roulette,
};
