import { AppLayout } from "../layouts/AppLayout";
import { usePathname } from "../../shared/lib/router";
import { appRoutes, type AppRoute } from "./routes";

type MatchResult = {
  params: Record<string, string>;
  route: AppRoute;
};

function matchRoute(pathname: string): MatchResult | null {
  const cleanedPathname = pathname.replace(/\/+$/, "") || "/";

  for (const route of appRoutes) {
    const routeParts = route.path.split("/").filter(Boolean);
    const pathnameParts = cleanedPathname.split("/").filter(Boolean);

    if (route.path === "/" && cleanedPathname === "/") {
      return { route, params: {} };
    }

    if (routeParts.length !== pathnameParts.length) {
      continue;
    }

    const params: Record<string, string> = {};
    let isMatched = true;

    routeParts.forEach((part, index) => {
      const target = pathnameParts[index];

      if (part.startsWith(":")) {
        params[part.slice(1)] = target;
        return;
      }

      if (part !== target) {
        isMatched = false;
      }
    });

    if (isMatched) {
      return { route, params };
    }
  }

  return null;
}

export function AppRouter() {
  const pathname = usePathname();
  const match = matchRoute(pathname) ?? matchRoute("/");

  if (!match) {
    return null;
  }

  return (
    <AppLayout
      description={match.route.description}
      layout={match.route.layout}
      screenId={match.route.screenId}
      showTabBar={match.route.showTabBar}
      title={match.route.title}
    >
      {match.route.render(match.params)}
    </AppLayout>
  );
}
