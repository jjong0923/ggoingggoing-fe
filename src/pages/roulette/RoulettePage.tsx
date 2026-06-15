import { useEffect, useMemo, useRef, useState } from "react";
import { logout } from "../../shared/apis/auth";
import { buildPath } from "../../app/router/routePaths";
import { getRouteDetail } from "../../shared/apis/routes";
import {
  clearAuthSession,
  getRefreshToken,
  useAuthUser,
} from "../../shared/lib/authSession";
import {
  getCustomRouteBySourceRouteId,
  saveRouteDetailAsCustomRoute,
  useCustomRoutes,
} from "../../shared/lib/customRoutes";
import { navigateTo } from "../../shared/lib/router";
import { getMockRouletteRoutes } from "../../shared/mocks/routes";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type RouletteStage = "setup" | "spinning" | "result";

type RouletteOption = {
  label: string;
  value: string;
};

type RouletteResult = {
  description: string;
  id: string;
  imageEmoji: string;
  location: string;
  region: string;
  subtitle: string;
  themes: string[];
  title: string;
  tripTypes: string[];
};

type RouletteSlice = {
  color: string;
  label: string;
  resultId: string;
};

const regionOptions: RouletteOption[] = [
  { label: "전국", value: "all" },
  { label: "수도권", value: "capital" },
  { label: "대전", value: "daejeon" },
  { label: "부산", value: "busan" },
  { label: "강원", value: "gangwon" },
  { label: "제주", value: "jeju" },
  { label: "전라", value: "jeolla" },
];

const themeOptions: RouletteOption[] = [
  { label: "전체", value: "all" },
  { label: "맛집", value: "food" },
  { label: "명소", value: "spot" },
  { label: "루트", value: "route" },
  { label: "힐링", value: "healing" },
];

const tripTypeOptions: RouletteOption[] = [
  { label: "당일치기", value: "oneday" },
  { label: "1박 2일", value: "overnight" },
];

const rouletteResults: RouletteResult[] = getMockRouletteRoutes().map((route) => ({
  id: route.routeId,
  title: route.title,
  subtitle: route.subtitle,
  description: route.description,
  location: route.location,
  region: route.region,
  themes: route.themes,
  tripTypes: route.tripTypes,
  imageEmoji: route.imageEmoji,
}));

const rouletteColors = [
  "#9ee0d3",
  "#d9d3ff",
  "#c8efe9",
  "#ffe2d5",
  "#ffd28a",
  "#9b92f7",
  "#ffd9ca",
  "#abd3f5",
  "#ccebe5",
  "#ffb79d",
  "#efe1ff",
  "#f5d8a8",
] as const;

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: false },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: true },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
];

function createRouletteSlices(results: RouletteResult[]) {
  return results.map((result, index) => ({
    label: result.title.replace(" 루트", "").slice(0, 6),
    color: rouletteColors[index % rouletteColors.length],
    resultId: result.id,
  })) satisfies RouletteSlice[];
}

function RouletteChip({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: string;
  onClick: () => void;
}) {
  return (
    <button
      className={[
        "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
        active
          ? "bg-[#f1eeff] text-[#5f51d5] shadow-[0_8px_18px_rgba(95,81,213,0.12)]"
          : "bg-white text-slate-600",
      ].join(" ")}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function RouletteWheel({
  isSpinning,
  pointerRotation,
  slices,
}: {
  isSpinning: boolean;
  pointerRotation: number;
  slices: RouletteSlice[];
}) {
  const gradient = useMemo(() => {
    const sliceAngle = 360 / slices.length;

    return `conic-gradient(${slices
      .map((slice, index) => {
        const start = index * sliceAngle;
        const end = (index + 1) * sliceAngle;

        return `${slice.color} ${start}deg ${end}deg`;
      })
      .join(",")})`;
  }, [slices]);

  return (
    <div className="relative mx-auto mt-6 h-52 w-52">
      <div
        className="absolute inset-0 z-20 transition-transform duration-[3200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ transform: `rotate(${pointerRotation}deg)` }}
      >
        <div className="absolute top-3 left-1/2 h-8 w-1 -translate-x-1/2 rounded-full bg-[#5f51d5]/30" />
        <div
          className={[
            "absolute top-3 left-1/2 h-0 w-0 -translate-x-1/2 border-r-[9px] border-b-[18px] border-l-[9px] border-r-transparent border-b-[#5f51d5] border-l-transparent",
            isSpinning ? "opacity-100" : "opacity-100",
          ].join(" ")}
        />
      </div>

      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{ background: gradient }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#7b68f0] shadow-[0_8px_18px_rgba(95,81,213,0.12)]">
          GO!
        </div>
      </div>
      {slices.map((slice, index) => {
        const angle = index * (360 / slices.length) + 360 / slices.length / 2;

        return (
          <span
            key={slice.label}
            className="absolute top-1/2 left-1/2 text-[9px] font-semibold text-slate-600"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-78px) rotate(${-angle}deg)`,
            }}
          >
            {slice.label}
          </span>
        );
      })}
    </div>
  );
}

function RoulettePhone() {
  const [stage, setStage] = useState<RouletteStage>("setup");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedTheme, setSelectedTheme] = useState("all");
  const [selectedTripType, setSelectedTripType] = useState("oneday");
  const [pointerRotation, setPointerRotation] = useState(0);
  const [activeResultId, setActiveResultId] = useState(rouletteResults[0].id);
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const spinTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const customRoutes = useCustomRoutes();

  const availableResults = useMemo(() => {
    return rouletteResults.filter((result) => {
      const regionMatch =
        selectedRegion === "all" || result.region === selectedRegion;
      const themeMatch = result.themes.includes(selectedTheme);
      const tripTypeMatch = result.tripTypes.includes(selectedTripType);

      return regionMatch && themeMatch && tripTypeMatch;
    });
  }, [selectedRegion, selectedTheme, selectedTripType]);

  const availableSlices = useMemo(
    () => createRouletteSlices(availableResults),
    [availableResults],
  );

  const activeResult = useMemo(() => {
    return (
      rouletteResults.find((result) => result.id === activeResultId) ??
      availableResults[0] ??
      rouletteResults[0]
    );
  }, [activeResultId, availableResults]);
  const savedRoute = useMemo(
    () => getCustomRouteBySourceRouteId(Number(activeResult.id)),
    [activeResult.id, customRoutes],
  );

  useEffect(() => {
    return () => {
      if (spinTimeoutRef.current) {
        window.clearTimeout(spinTimeoutRef.current);
      }
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const spinRoulette = () => {
    if (availableResults.length === 0) {
      return;
    }

    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const nextResult =
      availableResults[Math.floor(Math.random() * availableResults.length)];
    const nextSliceIndex = availableSlices.findIndex(
      (slice) => slice.resultId === nextResult.id,
    );
    const sliceAngle = 360 / availableSlices.length;
    const targetSliceCenter = nextSliceIndex * sliceAngle + sliceAngle / 2;
    const extraTurns = 360 * (4 + Math.floor(Math.random() * 3));
    const targetRotation = extraTurns + targetSliceCenter;

    setStage("spinning");
    animationFrameRef.current = window.requestAnimationFrame(() => {
      setPointerRotation((current) => current + targetRotation);
      animationFrameRef.current = null;
    });

    spinTimeoutRef.current = window.setTimeout(() => {
      setActiveResultId(nextResult.id);
      setSaveMessage(null);
      setStage("result");
      spinTimeoutRef.current = null;
    }, 3200);
  };

  const handleSaveRoute = async () => {
    const sourceRouteId = Number(activeResult.id);

    if (!Number.isFinite(sourceRouteId)) {
      return;
    }

    if (savedRoute) {
      navigateTo(`${buildPath.collection()}#route`);
      return;
    }

    setIsSavingRoute(true);
    setSaveMessage(null);

    try {
      const routeDetail = await getRouteDetail(sourceRouteId);
      saveRouteDetailAsCustomRoute(routeDetail, sourceRouteId);
      setSaveMessage("소장함 루트에 담았어요.");
      navigateTo(`${buildPath.collection()}#route`);
    } catch (error) {
      console.error("Failed to save roulette route", error);
      setSaveMessage("루트를 소장함에 담지 못했어요.");
    } finally {
      setIsSavingRoute(false);
    }
  };

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <header className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-slate-900">
            랜덤 룰렛
          </h2>
          <button
            aria-label="안내"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] text-slate-500 transition hover:bg-[#f8f4ee]"
            type="button"
          >
            i
          </button>
        </header>

        {stage === "setup" ? (
          <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
            <div className="rounded-[22px] bg-[#fbf7f1] px-4 py-4">
              <p className="text-center text-[18px] font-semibold text-slate-900">
                어디 갈지 모르겠다면?
              </p>
              <p className="mt-2 text-center text-[13px] leading-5 text-slate-500">
                룰렛에게 맡겨봐요
              </p>
              <p className="mt-4 text-center text-[12px] font-medium text-[#5f51d5]">
                현재 조건에 맞는 루트 {availableResults.length}개
              </p>
            </div>

            <section className="mt-6">
              <p className="text-[12px] font-semibold text-slate-500">
                지역 (선택 안 하면 전국)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {regionOptions.map((option) => (
                  <RouletteChip
                    key={option.value}
                    active={selectedRegion === option.value}
                    onClick={() => setSelectedRegion(option.value)}
                  >
                    {option.label}
                  </RouletteChip>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <p className="text-[12px] font-semibold text-slate-500">
                테마 (선택 안 하면 전체)
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {themeOptions.map((option) => (
                  <RouletteChip
                    key={option.value}
                    active={selectedTheme === option.value}
                    onClick={() => setSelectedTheme(option.value)}
                  >
                    {option.label}
                  </RouletteChip>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <p className="text-[12px] font-semibold text-slate-500">
                여행 유형
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tripTypeOptions.map((option) => (
                  <RouletteChip
                    key={option.value}
                    active={selectedTripType === option.value}
                    onClick={() => setSelectedTripType(option.value)}
                  >
                    {option.label}
                  </RouletteChip>
                ))}
              </div>
            </section>

            {availableResults.length > 0 ? (
              <div className="mt-6 rounded-[22px] border border-[#e8e0d8] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(99,75,43,0.04)]">
                <p className="text-[12px] font-semibold text-slate-500">
                  후보 미리보기
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {availableResults.map((result) => (
                    <span
                      key={result.id}
                      className="rounded-full bg-[#f7f1e8] px-3 py-1.5 text-[11px] font-medium text-slate-700"
                    >
                      {result.title.replace(" 루트", "")}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[22px] border border-[#f3d6cf] bg-[#fff4f1] px-4 py-5 text-center">
                <p className="text-[14px] font-semibold text-slate-900">
                  조건에 맞는 루트가 없어요
                </p>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">
                  지역이나 테마를 조금 넓히면 후보가 다시 보여요.
                </p>
              </div>
            )}

            <button
              className={[
                "mt-8 w-full rounded-2xl px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.24)]",
                availableResults.length > 0
                  ? "bg-[#5f51d5]"
                  : "cursor-not-allowed bg-slate-300 shadow-none",
              ].join(" ")}
              disabled={availableResults.length === 0}
              type="button"
              onClick={spinRoulette}
            >
              룰렛 돌리기!
            </button>
          </div>
        ) : null}

        {stage === "spinning" ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <RouletteWheel
              isSpinning
              pointerRotation={pointerRotation}
              slices={availableSlices}
            />
            <p className="mt-6 text-[13px] text-slate-500">
              화살표가 멈출 때 당첨 장소가 정해져요
            </p>
            <p className="mt-2 text-[12px] text-slate-400">
              조건에 맞는 후보 중에서 랜덤 선택 중
            </p>
          </div>
        ) : null}

        {stage === "result" ? (
          <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
            <p className="text-center text-[13px] font-medium text-slate-500">
              오늘 운이 이끌어준 곳은...
            </p>
            <p className="mt-2 text-center text-[26px] font-semibold tracking-[-0.04em] text-[#5f51d5]">
              {activeResult.title}
            </p>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-[#7b68f0] bg-white shadow-[0_18px_34px_rgba(95,81,213,0.12)]">
              <div className="flex h-32 items-center justify-center bg-[#ffcab8] text-4xl">
                {activeResult.imageEmoji}
              </div>
              <div className="px-4 py-4">
                <h3 className="text-[18px] font-semibold text-slate-900">
                  {activeResult.subtitle}
                </h3>
                <p className="mt-1 text-[12px] text-slate-500">
                  ⌖ {activeResult.location}
                </p>
                <p className="mt-3 text-[12px] leading-5 text-slate-600">
                  {activeResult.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <RouteLink
                    className="flex items-center justify-center rounded-2xl bg-[#f5f1ff] px-3 py-3 text-sm font-semibold text-[#5f51d5]"
                    href={buildPath.routeResult(activeResult.id)}
                  >
                    루트 보기
                  </RouteLink>
                  <button
                    className={[
                      "flex items-center justify-center rounded-2xl border px-3 py-3 text-sm font-semibold transition",
                      savedRoute
                        ? "border-[#d8d0ff] bg-[#f5f1ff] text-[#5f51d5]"
                        : "border-[#ece3d9] text-slate-700",
                    ].join(" ")}
                    disabled={isSavingRoute}
                    type="button"
                    onClick={() => {
                      void handleSaveRoute();
                    }}
                  >
                    {savedRoute ? "♡ 소장한 루트" : isSavingRoute ? "저장 중..." : "♡ 소장"}
                  </button>
                </div>

                {saveMessage ? (
                  <p className="mt-3 text-[12px] font-medium text-[#5f51d5]">
                    {saveMessage}
                  </p>
                ) : null}
              </div>
            </div>

            <button
              className="mt-4 flex w-full items-center justify-center gap-2 text-sm font-semibold text-[#5f51d5]"
              type="button"
              onClick={spinRoulette}
            >
              ↻ 다시 돌리기
            </button>
          </div>
        ) : null}

        <nav className="mt-3 border-t border-[#f1ebe2] pt-2">
          <ul className="grid grid-cols-4 gap-1">
            {tabItems.map((tab) => (
              <li key={tab.label}>
                <RouteLink
                  className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition hover:bg-[#faf7f2]"
                  href={tab.href}
                >
                  <span
                    className={[
                      "text-[18px] leading-none",
                      tab.active ? "text-[#5f51d5]" : "text-slate-500",
                    ].join(" ")}
                  >
                    {tab.icon}
                  </span>
                  <span
                    className={[
                      "text-[11px] leading-none font-semibold",
                      tab.active ? "text-[#5f51d5]" : "text-slate-500",
                    ].join(" ")}
                  >
                    {tab.label}
                  </span>
                </RouteLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </PhoneFrame>
  );
}

export function RoulettePage() {
  const authUser = useAuthUser();

  return (
    <ShowcaseLayout phone={<RoulettePhone />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          ROULETTE
        </span>
        랜덤 추천
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        고민 없이
        <br />
        바로 떠나는 룰렛 추천.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        지역, 테마, 여행 유형만 가볍게 고르면 조건에 맞는 후보를 룰렛으로
        추천하고, 결과 카드에서 바로 루트 만들기나 소장으로 이어질 수 있는
        흐름입니다.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {authUser ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deee] bg-white/80 px-5 py-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">
                {authUser.nickname}
              </span>
              <span className="text-slate-400">·</span>
              저장한 루트와 최근 검색을 이어서 볼 수 있어요
            </div>
            <button
              className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-white"
              type="button"
              onClick={async () => {
                const refreshToken = getRefreshToken();

                try {
                  if (refreshToken) {
                    await logout(refreshToken);
                  }
                } catch (error) {
                  console.error("Failed to logout", error);
                } finally {
                  clearAuthSession();
                }
              }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <RouteLink
              className="inline-flex items-center justify-center rounded-full bg-[#5f51d5] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_rgba(95,81,213,0.3)] transition hover:bg-[#5243c8]"
              href={buildPath.login()}
            >
              <p className="text-white">로그인</p>
            </RouteLink>
            <RouteLink
              className="inline-flex items-center justify-center rounded-full border border-[#d9cdbd] bg-white/80 px-6 py-3.5 text-sm font-medium text-slate-700 transition hover:bg-white"
              href={buildPath.signup()}
            >
              회원가입
            </RouteLink>
          </>
        )}
      </div>
    </ShowcaseLayout>
  );
}
