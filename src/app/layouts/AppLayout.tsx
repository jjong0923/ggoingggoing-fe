import type { ReactNode } from "react";
import { buildPath } from "../router/routePaths";
import { RouteLink } from "../../shared/ui/RouteLink";

type AppLayoutProps = {
  children: ReactNode;
  description: string;
  layout?: "default" | "immersive";
  screenId: string;
  showTabBar?: boolean;
  title: string;
};

const tabs = [
  { label: "홈", href: buildPath.home() },
  { label: "탐색", href: buildPath.theme() },
  { label: "룰렛", href: buildPath.roulette() },
  { label: "소장", href: buildPath.collection() },
];

export function AppLayout({
  children,
  description,
  layout = "default",
  screenId,
  showTabBar,
  title,
}: AppLayoutProps) {
  if (layout === "immersive") {
    return (
      <main className="min-h-screen bg-[linear-gradient(180deg,#f7efe3_0%,#fbf8f2_42%,#f4ecff_100%)] text-slate-900">
        {children}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fffaf2,white_38%,#f7efe1)] px-4 py-6 text-slate-900 md:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="rounded-[32px] border border-white/80 bg-white/80 p-6 shadow-[0_20px_70px_rgba(103,80,47,0.12)] backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#d4822f]">
                {screenId}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                {description}
              </p>
            </div>
            <RouteLink
              className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              href={buildPath.home()}
            >
              메인 피드로 이동
            </RouteLink>
          </div>
        </header>

        {children}

        {showTabBar ? (
          <nav className="sticky bottom-4 rounded-[28px] border border-white/80 bg-white/90 p-3 shadow-[0_18px_40px_rgba(103,80,47,0.12)] backdrop-blur">
            <ul className="grid grid-cols-4 gap-2">
              {tabs.map((tab) => (
                <li key={tab.href}>
                  <RouteLink
                    className="flex items-center justify-center rounded-full px-3 py-3 text-sm font-medium text-slate-700 transition hover:bg-[#f5ecdf]"
                    href={tab.href}
                  >
                    {tab.label}
                  </RouteLink>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </main>
  );
}
