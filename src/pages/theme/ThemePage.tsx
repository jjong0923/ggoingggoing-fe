import { useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type ThemeStage = "home" | "subtheme" | "feed";

type FeedCard = {
  id: string;
  likeCount: string;
  location: string;
  subtitle: string;
  title: string;
};

type ThemeGroup = {
  countLabel: string;
  description: string;
  id: string;
  palette: [string, string, string];
  previewTags: string[];
  subthemes: { countLabel: string; label: string }[];
  title: string;
};

const themeGroups: ThemeGroup[] = [
  {
    id: "food",
    title: "맛집",
    countLabel: "콘텐츠 142개",
    description: "지금 인기 있는 식도락 스팟과 카테고리별 맛집 탐색",
    palette: ["#ffd9ca", "#ff9d7a", "#ffcd7b"],
    previewTags: ["고기/구이", "면/국수", "베이커리"],
    subthemes: [
      { label: "고기/구이", countLabel: "38개" },
      { label: "면/국수", countLabel: "27개" },
      { label: "국밥/찌개", countLabel: "22개" },
      { label: "베이커리", countLabel: "19개" },
      { label: "해산물", countLabel: "16개" },
      { label: "카페/디저트", countLabel: "20개" },
    ],
  },
  {
    id: "spot",
    title: "명소",
    countLabel: "콘텐츠 98개",
    description: "풍경, 산책, 야경처럼 분위기 중심으로 모아본 장소",
    palette: ["#9ee0d3", "#28cdb6", "#ccc6fb"],
    previewTags: ["바다", "야경", "사진 스팟"],
    subthemes: [
      { label: "바다", countLabel: "24개" },
      { label: "야경", countLabel: "18개" },
      { label: "산책", countLabel: "21개" },
      { label: "사진 스팟", countLabel: "15개" },
    ],
  },
  {
    id: "route",
    title: "루트",
    countLabel: "콘텐츠 57개",
    description: "당일 동선, 카페 투어, 야경 코스를 한 번에 탐색",
    palette: ["#abd3f5", "#76b6ec", "#1d8bdc"],
    previewTags: ["도보 루트", "카페 투어", "맛집 코스"],
    subthemes: [
      { label: "도보 루트", countLabel: "12개" },
      { label: "카페 투어", countLabel: "14개" },
      { label: "맛집 코스", countLabel: "19개" },
      { label: "야경 코스", countLabel: "12개" },
    ],
  },
];

const regionOptions = ["전국", "수도권", "부산", "대구", "강원", "제주"];

const feedCardsBySubtheme: Record<string, FeedCard[]> = {
  "고기/구이": [
    { id: "theme-food-1", title: "문현가", subtitle: "한우구이", location: "부산 진구", likeCount: "842" },
    { id: "theme-food-2", title: "초록석", subtitle: "숯불 돼지구이", location: "포항시", likeCount: "516" },
    { id: "theme-food-3", title: "대구 뭉티기", subtitle: "로컬 인기집", location: "대구 중구", likeCount: "774" },
    { id: "theme-food-4", title: "제주 흑돼지", subtitle: "오션뷰 구이", location: "제주시", likeCount: "691" },
  ],
  "면/국수": [
    { id: "theme-noodle-1", title: "밀면 거리", subtitle: "시원한 부산 밀면", location: "부산 중구", likeCount: "423" },
    { id: "theme-noodle-2", title: "칼국수 집", subtitle: "현지인 추천", location: "강릉시", likeCount: "287" },
    { id: "theme-noodle-3", title: "잔치국수 골목", subtitle: "가볍게 한 끼", location: "전주시", likeCount: "198" },
    { id: "theme-noodle-4", title: "비빔국수 맛집", subtitle: "매콤한 별미", location: "수원시", likeCount: "355" },
  ],
  "국밥/찌개": [
    { id: "theme-soup-1", title: "돼지국밥 골목", subtitle: "진한 국물", location: "부산 서면", likeCount: "640" },
    { id: "theme-soup-2", title: "순두부 마을", subtitle: "아침 인기 코스", location: "강릉시", likeCount: "402" },
    { id: "theme-soup-3", title: "해장국 본점", subtitle: "로컬 단골집", location: "제주시", likeCount: "331" },
    { id: "theme-soup-4", title: "김치찌개 식당", subtitle: "든든한 한 끼", location: "서울 마포", likeCount: "219" },
  ],
  베이커리: [
    { id: "theme-bakery-1", title: "성심당", subtitle: "대표 빵집", location: "대전 중구", likeCount: "993" },
    { id: "theme-bakery-2", title: "오션 베이크", subtitle: "바다 앞 디저트", location: "속초시", likeCount: "412" },
    { id: "theme-bakery-3", title: "한옥 빵집", subtitle: "감성 공간", location: "전주시", likeCount: "266" },
    { id: "theme-bakery-4", title: "크림도넛 하우스", subtitle: "줄서는 빵집", location: "대구 중구", likeCount: "387" },
  ],
  해산물: [
    { id: "theme-seafood-1", title: "수산시장 골목", subtitle: "회와 해산물", location: "부산 중구", likeCount: "529" },
    { id: "theme-seafood-2", title: "물회 명가", subtitle: "여름 인기", location: "속초시", likeCount: "618" },
    { id: "theme-seafood-3", title: "갈치조림 집", subtitle: "제주 로컬", location: "서귀포시", likeCount: "344" },
    { id: "theme-seafood-4", title: "조개구이 거리", subtitle: "야식 코스", location: "보령시", likeCount: "271" },
  ],
  "카페/디저트": [
    { id: "theme-dessert-1", title: "노을 카페", subtitle: "감성 오션뷰", location: "부산 영도", likeCount: "845" },
    { id: "theme-dessert-2", title: "수플레 하우스", subtitle: "사진 스팟", location: "서울 성수", likeCount: "530" },
    { id: "theme-dessert-3", title: "귤 디저트 카페", subtitle: "제주 시그니처", location: "제주시", likeCount: "451" },
    { id: "theme-dessert-4", title: "한옥 티룸", subtitle: "조용한 휴식", location: "전주시", likeCount: "239" },
  ],
  바다: [
    { id: "theme-sea-1", title: "광안리 해변", subtitle: "야경 산책", location: "부산 수영구", likeCount: "790" },
    { id: "theme-sea-2", title: "영금정", subtitle: "일출 명소", location: "속초시", likeCount: "690" },
    { id: "theme-sea-3", title: "함덕 해수욕장", subtitle: "청량한 바다", location: "제주시", likeCount: "624" },
    { id: "theme-sea-4", title: "변산 채석강", subtitle: "드라이브 코스", location: "부안군", likeCount: "211" },
  ],
  야경: [
    { id: "theme-night-1", title: "남산 전망대", subtitle: "도심 야경", location: "서울 중구", likeCount: "728" },
    { id: "theme-night-2", title: "더베이101", subtitle: "반짝이는 뷰", location: "부산 해운대", likeCount: "581" },
    { id: "theme-night-3", title: "달맞이 전망대", subtitle: "조용한 밤", location: "대구 수성구", likeCount: "245" },
    { id: "theme-night-4", title: "월정리 야간 산책", subtitle: "해변 조명", location: "제주시", likeCount: "319" },
  ],
  산책: [
    { id: "theme-walk-1", title: "전주 한옥마을", subtitle: "도보 코스", location: "전주시", likeCount: "670" },
    { id: "theme-walk-2", title: "경포호수길", subtitle: "호수 산책", location: "강릉시", likeCount: "355" },
    { id: "theme-walk-3", title: "해운대 블루라인", subtitle: "바다 옆 산책", location: "부산 해운대", likeCount: "588" },
    { id: "theme-walk-4", title: "숲길 둘레길", subtitle: "가벼운 힐링", location: "제천시", likeCount: "199" },
  ],
  "사진 스팟": [
    { id: "theme-photo-1", title: "감천문화마을", subtitle: "컬러풀 포인트", location: "부산 사하구", likeCount: "602" },
    { id: "theme-photo-2", title: "산방산 뷰포인트", subtitle: "제주 대표컷", location: "서귀포시", likeCount: "533" },
    { id: "theme-photo-3", title: "루프탑 전망", subtitle: "도심 포토존", location: "서울 용산", likeCount: "241" },
    { id: "theme-photo-4", title: "유채꽃 길", subtitle: "봄 시즌 명소", location: "제주시", likeCount: "478" },
  ],
  "도보 루트": [
    { id: "theme-route-1", title: "전주 반나절 루트", subtitle: "한옥마을 중심", location: "전주시", likeCount: "418" },
    { id: "theme-route-2", title: "광안리 산책 루트", subtitle: "바다와 카페", location: "부산 수영구", likeCount: "552" },
    { id: "theme-route-3", title: "속초 항구 루트", subtitle: "시장 + 바다", location: "속초시", likeCount: "300" },
    { id: "theme-route-4", title: "성수 감성 코스", subtitle: "전시와 카페", location: "서울 성동", likeCount: "363" },
  ],
  "카페 투어": [
    { id: "theme-cafe-1", title: "해운대 카페 4선", subtitle: "오션뷰 집중", location: "부산 해운대", likeCount: "701" },
    { id: "theme-cafe-2", title: "대전 베이커리 루프", subtitle: "빵지순례", location: "대전 중구", likeCount: "276" },
    { id: "theme-cafe-3", title: "제주 서쪽 카페", subtitle: "노을 타임", location: "제주시", likeCount: "499" },
    { id: "theme-cafe-4", title: "서울 디저트 코스", subtitle: "반나절 코스", location: "서울 마포", likeCount: "324" },
  ],
  "맛집 코스": [
    { id: "theme-foodroute-1", title: "부산 시장 먹방", subtitle: "시장 중심", location: "부산 중구", likeCount: "653" },
    { id: "theme-foodroute-2", title: "대구 로컬 미식", subtitle: "뭉티기와 국수", location: "대구 중구", likeCount: "391" },
    { id: "theme-foodroute-3", title: "제주 흑돼지 코스", subtitle: "고기 집중", location: "제주시", likeCount: "514" },
    { id: "theme-foodroute-4", title: "전주 한끼 루트", subtitle: "빵과 국밥", location: "전주시", likeCount: "208" },
  ],
  "야경 코스": [
    { id: "theme-nightroute-1", title: "광안리 야경 루트", subtitle: "브리지 뷰", location: "부산 수영구", likeCount: "733" },
    { id: "theme-nightroute-2", title: "서울 루프탑 나이트", subtitle: "도심 라이트", location: "서울 용산", likeCount: "448" },
    { id: "theme-nightroute-3", title: "대구 야간 드라이브", subtitle: "전망대 포함", location: "대구 수성구", likeCount: "217" },
    { id: "theme-nightroute-4", title: "제주 해변 야경", subtitle: "조용한 밤 산책", location: "제주시", likeCount: "302" },
  ],
};

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: true },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
  { icon: "◌", label: "MY", href: buildPath.my(), active: false },
];

function ThemePhone() {
  const [stage, setStage] = useState<ThemeStage>("home");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState("전체");
  const [selectedHomeRegion, setSelectedHomeRegion] = useState("전체");
  const [selectedThemeId, setSelectedThemeId] = useState(themeGroups[0].id);
  const [selectedSubtheme, setSelectedSubtheme] = useState("고기/구이");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["부산"]);

  const currentTheme =
    themeGroups.find((theme) => theme.id === selectedThemeId) ?? themeGroups[0];

  const visibleThemeGroups = useMemo(() => {
    if (selectedHomeCategory === "전체") {
      return themeGroups;
    }

    return themeGroups.filter((theme) => theme.title === selectedHomeCategory);
  }, [selectedHomeCategory]);

  const feedCards = useMemo(() => {
    const cards =
      feedCardsBySubtheme[selectedSubtheme] ?? feedCardsBySubtheme["고기/구이"];

    if (selectedHomeRegion === "전체" && selectedRegions.length === 0) {
      return cards;
    }

    const activeRegions =
      selectedRegions.length > 0
        ? selectedRegions
        : selectedHomeRegion !== "전체"
          ? [selectedHomeRegion]
          : [];

    if (activeRegions.length === 0) {
      return cards;
    }

    return cards.filter((card) =>
      activeRegions.some((region) => card.location.includes(region)),
    );
  }, [selectedHomeRegion, selectedRegions, selectedSubtheme]);

  const homeCategoryTabs = ["전체", "맛집", "명소", "루트"];

  const openTheme = (themeId: string, subthemeLabel: string) => {
    setSelectedThemeId(themeId);
    setSelectedSubtheme(subthemeLabel);
    setSelectedRegions(selectedHomeRegion === "전체" ? [] : [selectedHomeRegion]);
    setStage("subtheme");
  };

  const resetThemeFilters = () => {
    setSelectedHomeCategory("전체");
    setSelectedHomeRegion("전체");
    setSelectedRegions([]);
  };

  const previewRegions = useMemo(
    () =>
      selectedRegions.length > 0
        ? selectedRegions
        : selectedHomeRegion !== "전체"
          ? [selectedHomeRegion]
          : ["전국"],
    [selectedHomeRegion, selectedRegions],
  );

  const toggleRegion = (region: string) => {
    setSelectedRegions((current) =>
      current.includes(region)
        ? current.filter((item) => item !== region)
        : [...current, region],
    );
  };

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        {stage === "home" ? (
          <>
            <header className="flex items-center justify-between">
              <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-slate-900">
                탐색
              </h2>
              <div className="flex items-center gap-2">
                <button
                  aria-label="필터"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[18px] text-slate-700 transition hover:bg-[#f8f4ee]"
                  type="button"
                  onClick={() => setShowFilters((current) => !current)}
                >
                  ☰
                </button>
                <RouteLink
                  className="flex h-10 w-10 items-center justify-center rounded-full text-[18px] text-slate-700 transition hover:bg-[#f8f4ee]"
                  href={buildPath.search()}
                >
                  ⌕
                </RouteLink>
              </div>
            </header>

            {showFilters ? (
              <div className="mt-4 rounded-[24px] bg-[#fbf7f1] px-4 py-4">
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Category
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {homeCategoryTabs.map((category) => (
                      <button
                        key={category}
                        className={[
                          "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                          selectedHomeCategory === category
                            ? "bg-[#f1eeff] text-[#5f51d5]"
                            : "bg-white text-slate-600",
                        ].join(" ")}
                        type="button"
                        onClick={() => setSelectedHomeCategory(category)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Region
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["전체", ...regionOptions.slice(1)].map((region) => (
                      <button
                        key={region}
                        className={[
                          "rounded-full px-3.5 py-2 text-[13px] font-medium transition",
                          selectedHomeRegion === region
                            ? "bg-[#f1eeff] text-[#5f51d5]"
                            : "bg-white text-slate-600",
                        ].join(" ")}
                        type="button"
                        onClick={() => setSelectedHomeRegion(region)}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-4 grid grid-cols-4 gap-2 border-b border-[#efe7dc] pb-3">
              {homeCategoryTabs.map((item) => (
                <button
                  key={item}
                  className={[
                    "rounded-full px-2 py-2 text-[12px] font-semibold transition",
                    selectedHomeCategory === item
                      ? "bg-[#f1eeff] text-[#5f51d5]"
                      : "text-slate-500",
                  ].join(" ")}
                  type="button"
                  onClick={() => setSelectedHomeCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="no-scrollbar mt-5 flex-1 overflow-y-auto space-y-3 pr-1">
              {selectedHomeRegion !== "전체" ? (
                <div className="rounded-[18px] bg-[#fbf7f1] px-4 py-3">
                  <p className="text-[12px] font-medium text-slate-500">
                    현재 지역 필터
                  </p>
                  <p className="mt-1 text-[14px] font-semibold text-slate-900">
                    {selectedHomeRegion} 기준 테마 탐색
                  </p>
                </div>
              ) : null}

              {visibleThemeGroups.map((theme) => (
                <button
                  key={theme.id}
                  className="w-full rounded-[24px] bg-white px-4 py-4 text-left shadow-[0_10px_24px_rgba(99,75,43,0.06)]"
                  type="button"
                  onClick={() => {
                    openTheme(theme.id, theme.subthemes[0].label);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f7f1e8] text-lg">
                        {theme.title === "맛집" ? "🍽" : theme.title === "명소" ? "🖼" : "🗺"}
                      </div>
                      <div>
                        <p className="text-[15px] font-semibold text-slate-900">
                          {theme.title}
                        </p>
                        <p className="text-[11px] text-slate-500">{theme.countLabel}</p>
                      </div>
                    </div>
                    <span className="text-slate-400">›</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {theme.palette.map((color, index) => (
                      <div
                        key={`${theme.id}-${color}`}
                        className="flex h-10 items-center justify-center rounded-2xl text-[10px] font-semibold text-white/90"
                        style={{ backgroundColor: color }}
                      >
                        컷 {index + 1}
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {theme.previewTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-[#f7f1e8] px-2.5 py-1 text-[11px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-[12px] leading-5 text-slate-500">
                    {theme.description}
                  </p>
                </button>
              ))}

              {visibleThemeGroups.length === 0 ? (
                <div className="rounded-[22px] bg-[#fbf7f1] px-4 py-5 text-center">
                  <p className="text-[14px] font-semibold text-slate-900">
                    선택한 조건에 맞는 테마가 아직 없어요
                  </p>
                  <button
                    className="mt-3 text-[12px] font-semibold text-[#5f51d5]"
                    type="button"
                    onClick={resetThemeFilters}
                  >
                    필터 초기화
                  </button>
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {stage === "subtheme" ? (
          <>
            <header className="flex items-center gap-3">
              <button
                aria-label="이전"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[20px] text-slate-700 transition hover:bg-[#f8f4ee]"
                type="button"
                onClick={() => setStage("home")}
              >
                ←
              </button>
              <h2 className="text-[18px] font-semibold text-slate-900">
                {currentTheme.title}
              </h2>
            </header>

            <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
              <div className="rounded-[22px] bg-[#fbf7f1] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Selected Theme
                </p>
                <h3 className="mt-2 text-[17px] font-semibold text-slate-900">
                  {currentTheme.title} 안에서 세부 취향을 골라보세요
                </h3>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">
                  서브테마와 지역을 조합하면 마지막 피드가 그 기준으로 정리됩니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {currentTheme.subthemes.map((subtheme) => {
                  const active = selectedSubtheme === subtheme.label;

                  return (
                    <button
                      key={subtheme.label}
                      className={[
                        "rounded-[18px] px-3 py-4 text-left shadow-[0_8px_20px_rgba(99,75,43,0.04)] transition",
                        active ? "bg-[#f1eeff]" : "bg-white",
                      ].join(" ")}
                      type="button"
                      onClick={() => setSelectedSubtheme(subtheme.label)}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f7f1e8] text-xl">
                        {currentTheme.title === "맛집" ? "🍢" : currentTheme.title === "명소" ? "📍" : "🛣"}
                      </div>
                      <p className="mt-3 text-[14px] font-semibold text-slate-900">
                        {subtheme.label}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        {subtheme.countLabel}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6">
                <p className="text-[12px] font-semibold text-slate-500">지역으로 좁히기</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {regionOptions.map((region) => {
                    const active = selectedRegions.includes(region);

                    return (
                      <button
                        key={region}
                        className={[
                          "rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                          active ? "bg-[#f1eeff] text-[#5f51d5]" : "bg-[#f7f1e8] text-slate-600",
                        ].join(" ")}
                        type="button"
                        onClick={() => toggleRegion(region)}
                      >
                        {region}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 rounded-[22px] bg-white px-4 py-4 shadow-[0_8px_20px_rgba(99,75,43,0.04)]">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-slate-900">선택 미리보기</p>
                  <span className="text-[11px] text-slate-500">
                    {previewRegions.length}개 지역
                  </span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">
                  {selectedSubtheme} · {previewRegions.join(", ")} 기준으로 피드를 준비했어요.
                </p>
              </div>
            </div>

            <button
              className="mt-4 rounded-2xl bg-[#5f51d5] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(95,81,213,0.24)]"
              type="button"
              onClick={() => setStage("feed")}
            >
              서브테마 선택
            </button>
          </>
        ) : null}

        {stage === "feed" ? (
          <>
            <header className="flex items-center gap-3">
              <button
                aria-label="이전"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[20px] text-slate-700 transition hover:bg-[#f8f4ee]"
                type="button"
                onClick={() => setStage("subtheme")}
              >
                ←
              </button>
              <h2 className="text-[18px] font-semibold text-slate-900">
                {currentTheme.title} · {selectedSubtheme}
              </h2>
            </header>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f1eeff] px-3 py-1.5 text-[11px] font-medium text-[#5f51d5]">
                {currentTheme.title} ×
              </span>
              <span className="rounded-full bg-[#f1eeff] px-3 py-1.5 text-[11px] font-medium text-[#5f51d5]">
                {selectedSubtheme} ×
              </span>
              {previewRegions.slice(0, 2).map((region) => (
                <span
                  key={region}
                  className="rounded-full bg-[#fbf7f1] px-3 py-1.5 text-[11px] font-medium text-slate-600"
                >
                  {region}
                </span>
              ))}
            </div>

            <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
              <div className="mb-4 rounded-[22px] bg-[#fbf7f1] px-4 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-slate-900">
                    {selectedSubtheme} 추천 피드
                  </p>
                  <span className="text-[11px] text-slate-500">{feedCards.length}개 콘텐츠</span>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-slate-500">
                  저장이 많은 순서와 지역 조합을 반영한 목 데이터 피드입니다.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {feedCards.map((card, index) => (
                  <RouteLink
                    key={card.id}
                    className="overflow-hidden rounded-[22px] bg-white shadow-[0_10px_24px_rgba(99,75,43,0.06)]"
                    href={buildPath.contentDetail(card.id)}
                  >
                    <div
                      className="h-24"
                      style={{
                        background:
                          index % 2 === 0
                            ? "linear-gradient(135deg,#ffb79d 0%,#ff8f70 100%)"
                            : "linear-gradient(135deg,#ffd27e 0%,#c8c2ff 100%)",
                      }}
                    />
                    <div className="px-3 py-3">
                      <h3 className="text-[14px] font-semibold text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-500">{card.subtitle}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{card.location}</span>
                        <span>저장 {card.likeCount}</span>
                      </div>
                    </div>
                  </RouteLink>
                ))}
              </div>

              {feedCards.length === 0 ? (
                <div className="mt-4 rounded-[22px] bg-[#fbf7f1] px-4 py-5 text-center">
                  <p className="text-[14px] font-semibold text-slate-900">
                    선택한 지역에 맞는 피드가 아직 없어요
                  </p>
                  <button
                    className="mt-3 text-[12px] font-semibold text-[#5f51d5]"
                    type="button"
                    onClick={() => setSelectedRegions([])}
                  >
                    지역 필터 초기화
                  </button>
                </div>
              ) : null}
            </div>
          </>
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

export function ThemePage() {
  return (
    <ShowcaseLayout phone={<ThemePhone />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          THEME
        </span>
        테마 탐색
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        취향을 고르고
        <br />
        테마별로 더 깊게 탐색.
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        맛집, 명소, 루트 중 큰 테마를 먼저 고르고, 서브테마와 지역을 더해
        원하는 분위기의 콘텐츠만 빠르게 좁혀보는 탐색 흐름입니다.
      </p>
    </ShowcaseLayout>
  );
}
