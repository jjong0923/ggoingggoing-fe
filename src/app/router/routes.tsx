import type { ReactNode } from "react";
import { AuthPage } from "../../pages/auth/AuthPage";
import { CollectionPage } from "../../pages/collection/CollectionPage";
import { ContentDetailPage } from "../../pages/content-detail/ContentDetailPage";
import { HomePage } from "../../pages/home/HomePage";
import { OnboardingPage } from "../../pages/onboarding/OnboardingPage";
import { RoulettePage } from "../../pages/roulette/RoulettePage";
import { RouteResultPage } from "../../pages/route-result/RouteResultPage";
import { SearchPage } from "../../pages/search/SearchPage";
import { ThemePage } from "../../pages/theme/ThemePage";
import { routePaths } from "./routePaths";

export type AppRoute = {
  id: string;
  screenId: string;
  path: string;
  title: string;
  description: string;
  layout?: "default" | "immersive";
  showTabBar?: boolean;
  render: (params: Record<string, string>) => ReactNode;
};

export const appRoutes: AppRoute[] = [
  {
    id: "onboarding",
    screenId: "F6",
    path: routePaths.onboarding,
    title: "온보딩 / 스플래시",
    description: "첫 진입, 취향 선택, 게스트 모드 진입",
    layout: "immersive",
    render: () => <OnboardingPage />,
  },
  {
    id: "home",
    screenId: "F1",
    path: routePaths.home,
    title: "메인 피드",
    description: "서비스 탐색용 홈 피드",
    layout: "immersive",
    showTabBar: true,
    render: () => <HomePage />,
  },
  {
    id: "login",
    screenId: "F9",
    path: routePaths.login,
    title: "로그인",
    description: "이메일/비밀번호 기반 간편 로그인",
    layout: "immersive",
    render: () => <AuthPage mode="login" />,
  },
  {
    id: "signup",
    screenId: "F10",
    path: routePaths.signup,
    title: "회원가입",
    description: "닉네임, 이메일, 비밀번호 입력으로 시작하는 가입 화면",
    layout: "immersive",
    render: () => <AuthPage mode="signup" />,
  },
  {
    id: "search",
    screenId: "F3",
    path: routePaths.search,
    title: "필터 / 검색",
    description: "지역, 테마, 여행 유형 기반 검색",
    layout: "immersive",
    render: () => <SearchPage />,
  },
  {
    id: "theme",
    screenId: "F7",
    path: routePaths.theme,
    title: "테마 탐색",
    description: "테마 > 서브테마 > 피드 드릴다운",
    layout: "immersive",
    render: () => <ThemePage />,
  },
  {
    id: "roulette",
    screenId: "F8",
    path: routePaths.roulette,
    title: "랜덤 룰렛",
    description: "조건 기반 여행지 추천 룰렛",
    layout: "immersive",
    render: () => <RoulettePage />,
  },
  {
    id: "content-detail",
    screenId: "F2",
    path: routePaths.contentDetail,
    title: "컨텐츠 상세",
    description: "상세 정보, 추천, 루트/소장 CTA 허브",
    layout: "immersive",
    render: (params) => <ContentDetailPage contentId={params.contentId} />,
  },
  {
    id: "route-result",
    screenId: "F4",
    path: routePaths.routeResult,
    title: "AI 루트 결과",
    description: "지도와 최적 동선 결과",
    layout: "immersive",
    render: (params) => <RouteResultPage routeId={params.routeId} />,
  },
  {
    id: "collection",
    screenId: "F5",
    path: routePaths.collection,
    title: "소장함",
    description: "찜 콘텐츠와 저장 루트 관리",
    layout: "immersive",
    showTabBar: true,
    render: () => <CollectionPage />,
  },
];
