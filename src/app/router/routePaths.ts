export const routePaths = {
  onboarding: "/",
  home: "/home",
  login: "/login",
  signup: "/signup",
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
  login: () => routePaths.login,
  signup: () => routePaths.signup,
  search: () => routePaths.search,
  contentDetail: (contentId: string) => `/contents/${contentId}`,
  routeResult: (routeId: string) => `/routes/${routeId}`,
  collection: () => routePaths.collection,
  theme: () => routePaths.theme,
  roulette: () => routePaths.roulette,
};
