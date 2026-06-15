import { useEffect, useMemo, useRef, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { UserCircleIcon } from "../../shared/ui/AppIcons";
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

const regionOptions: RouletteOption[] = [
  { label: "전국", value: "all" },
  { label: "수도권", value: "capital" },
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

const rouletteResults: RouletteResult[] = [
  {
    id: "roulette-daejeon-001",
    title: "대전 성심당!",
    subtitle: "성심당 튀김소보로",
    description:
      "대전 대표 빵집. 튀김소보로와 부추빵이 유명해요. 당일치기로 딱 좋아요.",
    location: "대전 중구 · 맛집",
    region: "all",
    themes: ["all", "food", "healing"],
    tripTypes: ["oneday", "overnight"],
    imageEmoji: "🥐",
  },
  {
    id: "roulette-busan-001",
    title: "광안리 해수욕장!",
    subtitle: "광안리 야경 산책",
    description:
      "해 질 무렵 바다와 브리지 뷰를 함께 볼 수 있어요. 가볍게 산책하기 좋아요.",
    location: "부산 수영구 · 명소",
    region: "busan",
    themes: ["all", "spot", "healing"],
    tripTypes: ["oneday", "overnight"],
    imageEmoji: "🌊",
  },
  {
    id: "roulette-gangwon-001",
    title: "속초 영금정!",
    subtitle: "동해 일출 포인트",
    description:
      "일출 시간대가 특히 아름다운 포인트예요. 근처 물회 코스까지 함께 즐기기 좋아요.",
    location: "강원 속초 · 명소",
    region: "gangwon",
    themes: ["all", "spot"],
    tripTypes: ["oneday", "overnight"],
    imageEmoji: "🌅",
  },
  {
    id: "roulette-jeju-001",
    title: "제주 흑돼지!",
    subtitle: "오션뷰 구이 스팟",
    description:
      "고기와 풍경을 같이 즐길 수 있는 제주 대표 코스예요. 여행 첫날 식사로도 잘 맞아요.",
    location: "제주시 · 맛집",
    region: "jeju",
    themes: ["all", "food"],
    tripTypes: ["oneday", "overnight"],
    imageEmoji: "🥩",
  },
  {
    id: "roulette-capital-001",
    title: "서울 한강 피크닉!",
    subtitle: "노을 산책 코스",
    description:
      "준비 부담 없이 가볍게 나가기 좋은 도심 코스예요. 커피 한 잔 들고 바로 이동하기 좋아요.",
    location: "서울 여의도 · 루트",
    region: "capital",
    themes: ["all", "route", "healing"],
    tripTypes: ["oneday"],
    imageEmoji: "🧺",
  },
  {
    id: "roulette-jeolla-001",
    title: "전주 한옥마을!",
    subtitle: "먹거리와 산책 코스",
    description:
      "한옥 골목, 길거리 음식, 가벼운 산책이 한 번에 이어지는 대표적인 당일 코스예요.",
    location: "전북 전주 · 루트",
    region: "jeolla",
    themes: ["all", "route", "spot"],
    tripTypes: ["oneday", "overnight"],
    imageEmoji: "🏘",
  },
];

const rouletteSlices = rouletteResults.map((result, index) => ({
  label: result.subtitle.split(" ")[0],
  color: ["#9ee0d3", "#d9d3ff", "#c8efe9", "#ffe2d5", "#ffd28a", "#9b92f7"][index],
  resultId: result.id,
}));

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: false },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: true },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
  {
    icon: <UserCircleIcon className="h-[18px] w-[18px]" />,
    label: "MY",
    href: buildPath.my(),
    active: false,
  },
];

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
}: {
  isSpinning: boolean;
  pointerRotation: number;
}) {
  return (
    <div className="relative mx-auto mt-6 h-52 w-52">
      <div
        className="absolute inset-0 z-20 transition-transform duration-[3200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
        style={{ transform: `rotate(${pointerRotation}deg)` }}
      >
        <div className="absolute left-1/2 top-3 h-8 w-1 -translate-x-1/2 rounded-full bg-[#5f51d5]/30" />
        <div
          className={[
            "absolute left-1/2 top-3 h-0 w-0 -translate-x-1/2 border-l-[9px] border-r-[9px] border-b-[18px] border-l-transparent border-r-transparent border-b-[#5f51d5]",
            isSpinning ? "opacity-100" : "opacity-100",
          ].join(" ")}
        />
      </div>

      <div
        className="flex h-full w-full items-center justify-center rounded-full"
        style={{
          background:
            "conic-gradient(#9ee0d3 0deg 60deg,#d9d3ff 60deg 120deg,#c8efe9 120deg 180deg,#ffe2d5 180deg 240deg,#ffd28a 240deg 300deg,#9b92f7 300deg 360deg)",
        }}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#7b68f0] shadow-[0_8px_18px_rgba(95,81,213,0.12)]">
          GO!
        </div>
      </div>
      {rouletteSlices.map((slice, index) => {
        const angle = index * 60 + 30;

        return (
          <span
            key={slice.label}
            className="absolute left-1/2 top-1/2 text-[10px] font-semibold text-slate-600"
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
  const spinTimeoutRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const availableResults = useMemo(() => {
    return rouletteResults.filter((result) => {
      const regionMatch = selectedRegion === "all" || result.region === selectedRegion;
      const themeMatch = result.themes.includes(selectedTheme);
      const tripTypeMatch = result.tripTypes.includes(selectedTripType);

      return regionMatch && themeMatch && tripTypeMatch;
    });
  }, [selectedRegion, selectedTheme, selectedTripType]);

  const activeResult = useMemo(() => {
    return (
      rouletteResults.find((result) => result.id === activeResultId) ??
      availableResults[0] ??
      rouletteResults[0]
    );
  }, [activeResultId, availableResults]);

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
    if (spinTimeoutRef.current) {
      window.clearTimeout(spinTimeoutRef.current);
    }
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
    }

    const candidatePool = availableResults.length > 0 ? availableResults : rouletteResults;
    const nextResult =
      candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const nextSliceIndex = rouletteSlices.findIndex(
      (slice) => slice.resultId === nextResult.id,
    );
    const sliceAngle = 360 / rouletteSlices.length;
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
      setStage("result");
      spinTimeoutRef.current = null;
    }, 3200);
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
              <p className="text-[12px] font-semibold text-slate-500">여행 유형</p>
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

            <button
              className="mt-8 w-full rounded-2xl bg-[#5f51d5] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(95,81,213,0.24)]"
              type="button"
              onClick={spinRoulette}
            >
              룰렛 돌리기!
            </button>
          </div>
        ) : null}

        {stage === "spinning" ? (
          <div className="flex flex-1 flex-col items-center justify-center">
            <RouletteWheel isSpinning pointerRotation={pointerRotation} />
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
                    href={buildPath.contentDetail(activeResult.id)}
                  >
                    상세 보기
                  </RouteLink>
                  <RouteLink
                    className="flex items-center justify-center rounded-2xl border border-[#ece3d9] px-3 py-3 text-sm font-semibold text-slate-700"
                    href={buildPath.collection()}
                  >
                    ♡ 소장
                  </RouteLink>
                </div>
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
          <ul className="grid grid-cols-5 gap-1">
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
                      "text-[11px] font-semibold leading-none",
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
        지역, 테마, 여행 유형만 가볍게 고르면 조건에 맞는 후보를 룰렛으로 추천하고,
        결과 카드에서 바로 루트 만들기나 소장으로 이어질 수 있는 흐름입니다.
      </p>
    </ShowcaseLayout>
  );
}
