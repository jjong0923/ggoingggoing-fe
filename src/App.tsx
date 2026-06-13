import { create } from "zustand";
import "./App.css";

type Section = "onboarding" | "feed" | "search" | "theme";
type SearchMode = "home" | "filter" | "results";
type ThemeMode = "home" | "subthemes" | "feed";

type FilterTag = {
  id: string;
  label: string;
  tone?: "purple" | "mint" | "amber" | "slate";
};

type FeedCard = {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  tone: string;
  hot?: boolean;
};

type PrototypeState = {
  activeSection: Section;
  onboardingStep: number;
  searchMode: SearchMode;
  themeMode: ThemeMode;
  selectedThemePrefs: string[];
  selectedRegion: string;
  selectedDuration: string;
  selectedCompanion: string;
  selectedBudget: string;
  feedFilter: string;
  searchKeyword: string;
  activeSearchFilters: FilterTag[];
  selectedCategory: string;
  selectedSubthemes: string[];
  setActiveSection: (section: Section) => void;
  setOnboardingStep: (step: number) => void;
  toggleThemePref: (theme: string) => void;
  setSelectedRegion: (region: string) => void;
  setSelectedDuration: (value: string) => void;
  setSelectedCompanion: (value: string) => void;
  setSelectedBudget: (value: string) => void;
  setFeedFilter: (value: string) => void;
  setSearchMode: (mode: SearchMode) => void;
  setSearchKeyword: (value: string) => void;
  removeSearchFilter: (id: string) => void;
  resetSearchFilters: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  setSelectedCategory: (value: string) => void;
  toggleSubtheme: (value: string) => void;
};

const usePrototypeStore = create<PrototypeState>((set) => ({
  activeSection: "onboarding",
  onboardingStep: 0,
  searchMode: "home",
  themeMode: "home",
  selectedThemePrefs: ["맛집 탐방", "숨은 명소"],
  selectedRegion: "수도권",
  selectedDuration: "당일치기",
  selectedCompanion: "혼자",
  selectedBudget: "보통",
  feedFilter: "전체",
  searchKeyword: "부산",
  activeSearchFilters: [
    { id: "region-1", label: "수도권", tone: "purple" },
    { id: "region-2", label: "부산/경남", tone: "purple" },
    { id: "theme-1", label: "맛집", tone: "mint" },
    { id: "theme-2", label: "명소", tone: "mint" },
    { id: "travel-1", label: "당일치기", tone: "amber" },
  ],
  selectedCategory: "맛집",
  selectedSubthemes: ["고기/구이", "브런치"],
  setActiveSection: (activeSection) => set({ activeSection }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  toggleThemePref: (theme) =>
    set((state) => ({
      selectedThemePrefs: state.selectedThemePrefs.includes(theme)
        ? state.selectedThemePrefs.filter((item) => item !== theme)
        : [...state.selectedThemePrefs, theme],
    })),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion }),
  setSelectedDuration: (selectedDuration) => set({ selectedDuration }),
  setSelectedCompanion: (selectedCompanion) => set({ selectedCompanion }),
  setSelectedBudget: (selectedBudget) => set({ selectedBudget }),
  setFeedFilter: (feedFilter) => set({ feedFilter }),
  setSearchMode: (searchMode) => set({ searchMode }),
  setSearchKeyword: (searchKeyword) => set({ searchKeyword }),
  removeSearchFilter: (id) =>
    set((state) => ({
      activeSearchFilters: state.activeSearchFilters.filter(
        (filter) => filter.id !== id,
      ),
    })),
  resetSearchFilters: () =>
    set({
      activeSearchFilters: [],
      searchKeyword: "",
    }),
  setThemeMode: (themeMode) => set({ themeMode }),
  setSelectedCategory: (selectedCategory) =>
    set({
      selectedCategory,
      themeMode: "subthemes",
      selectedSubthemes: [],
    }),
  toggleSubtheme: (value) =>
    set((state) => ({
      selectedSubthemes: state.selectedSubthemes.includes(value)
        ? state.selectedSubthemes.filter((item) => item !== value)
        : [...state.selectedSubthemes, value],
    })),
}));

const onboardingThemes = [
  "맛집 탐방",
  "숨은 명소",
  "역사 탐방",
  "힐링",
  "등산",
  "물놀이",
  "지역 축제",
  "계곡",
];

const regionOptions = ["수도권", "부산/경남", "강원도", "제주도", "전라도"];

const durationOptions = ["당일치기", "1박 2일"];
const companionOptions = ["혼자", "커플", "가족", "친구"];
const budgetOptions = ["알뜰", "보통", "여유롭게"];

const feedFilters = ["전체", "맛집", "명소", "루트", "수도권", "부산"];

const feedCards: FeedCard[] = [
  {
    id: "1",
    title: "성심당 튀김소보로",
    subtitle: "빵집",
    region: "대전",
    tone: "from-[#ffc6b0] to-[#ff8e72]",
  },
  {
    id: "2",
    title: "대구 불로막창 본점",
    subtitle: "맛집",
    region: "대구",
    tone: "from-[#e9c57d] to-[#b56d00]",
  },
  {
    id: "3",
    title: "속초 청초호 설렘",
    subtitle: "명소",
    region: "강원 속초",
    tone: "from-[#92e8cb] to-[#14a06f]",
    hot: true,
  },
  {
    id: "4",
    title: "감성 한옥마을",
    subtitle: "명소",
    region: "전주",
    tone: "from-[#d9ccff] to-[#8f79ff]",
  },
  {
    id: "5",
    title: "경포대 일몰 루트",
    subtitle: "루트",
    region: "강릉",
    tone: "from-[#a9d8ff] to-[#2f89d8]",
  },
  {
    id: "6",
    title: "제주 산방산 힐링",
    subtitle: "명소",
    region: "제주",
    tone: "from-[#b2e36d] to-[#4e9a19]",
  },
];

const trendKeywords = [
  "전주 한옥마을",
  "대구 막창집",
  "속초 물회",
  "제주 산방산",
];

const searchResults = [
  {
    title: "부산 돼지국밥 골목",
    meta: "부산 서면",
    count: "325",
    tone: "bg-[#fff1e7]",
  },
  {
    title: "광안리 해수욕장",
    meta: "부산 수영구",
    count: "284",
    tone: "bg-[#e6fbf5]",
  },
  {
    title: "해운대 달맞이길",
    meta: "부산 해운대구",
    count: "198",
    tone: "bg-[#f3eaff]",
  },
  {
    title: "흰여울문화마을",
    meta: "부산 영도구",
    count: "176",
    tone: "bg-[#fff7db]",
  },
];

const themeCategories = [
  {
    name: "맛집",
    count: 142,
    swatches: ["#ffc8b5", "#ff9f7d", "#ffcd67"],
  },
  {
    name: "명소",
    count: 98,
    swatches: ["#aef1d2", "#65d8b7", "#c9c1ff"],
  },
  {
    name: "루트",
    count: 57,
    swatches: ["#c9e6ff", "#72c1ff", "#1a8de7"],
  },
];

const subthemes = [
  "고기/구이",
  "면/국수",
  "전통시장",
  "해산물",
  "브런치",
  "카페/디저트",
];

function App() {
  const activeSection = usePrototypeStore((state) => state.activeSection);
  const setActiveSection = usePrototypeStore((state) => state.setActiveSection);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fdfaf2,white_40%,#f6f1e8)] px-4 py-8 text-slate-900 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_20px_80px_rgba(117,96,65,0.12)] backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold tracking-[0.24em] text-[#6f64ff]">
                GGOINGGGOING PROTOTYPE
              </p>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-slate-900 md:text-5xl">
                참고 이미지 기반 프론트 화면 프로토타입
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-500 md:text-base">
                온보딩, 메인 피드, 필터/검색, 테마 탐색을 먼저 구현했습니다. 각
                섹션을 누르면 오른쪽 모바일 프레임에서 흐름을 바로 확인할 수
                있습니다.
              </p>
            </div>

            <nav className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <SectionButton
                active={activeSection === "onboarding"}
                label="F6 온보딩"
                onClick={() => setActiveSection("onboarding")}
              />
              <SectionButton
                active={activeSection === "feed"}
                label="F1 메인 피드"
                onClick={() => setActiveSection("feed")}
              />
              <SectionButton
                active={activeSection === "search"}
                label="F3 필터/검색"
                onClick={() => setActiveSection("search")}
              />
              <SectionButton
                active={activeSection === "theme"}
                label="F7 테마/탐색"
                onClick={() => setActiveSection("theme")}
              />
            </nav>
          </div>
        </header>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_420px]">
          <div className="rounded-[32px] border border-[#ede7da] bg-[#fcfaf6] p-5 shadow-[0_18px_60px_rgba(73,52,17,0.08)] md:p-7">
            <PrototypeOverview section={activeSection} />
          </div>
          <div className="rounded-[32px] border border-[#ece4d6] bg-[linear-gradient(180deg,#fbf8f1,#f2ebe1)] p-5 shadow-[0_18px_60px_rgba(73,52,17,0.08)]">
            <PhoneStage section={activeSection} />
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl px-4 py-3 text-sm font-medium transition",
        active
          ? "bg-[#6254ea] text-white shadow-[0_16px_34px_rgba(98,84,234,0.28)]"
          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PrototypeOverview({ section }: { section: Section }) {
  const content = {
    onboarding: {
      kicker: "F6",
      title: "온보딩 / 스플래시",
      body: "이미지의 4개 프레임 흐름을 그대로 옮겨서 스플래시, 테마 선택, 지역 선택, 여행 스타일 선택을 단계형으로 구성했습니다.",
      bullets: ["복수 선택 칩", "단계 인디케이터", "CTA 중심 하단 고정"],
    },
    feed: {
      kicker: "F1",
      title: "메인 피드",
      body: "상단 칩 필터와 2열 카드 피드를 핵심으로 잡고, 카드 색감과 간격을 참고 이미지처럼 가볍고 선명하게 맞췄습니다.",
      bullets: ["핀터레스트형 그리드", "하트/핫 배지", "하단 탭바"],
    },
    search: {
      kicker: "F3",
      title: "필터 / 검색",
      body: "검색 홈, 필터 설정, 결과 리스트 3상태를 분리했고 검색어, 인기 키워드, 활성 필터 칩 구조를 한 화면 흐름으로 묶었습니다.",
      bullets: ["최근 검색어", "필터 모달형 카드", "결과 상태 전환"],
    },
    theme: {
      kicker: "F7",
      title: "테마 / 탐색",
      body: "테마 홈, 서브테마 선택, 테마 피드까지 드릴다운되는 구조를 프로토타입에 반영했습니다.",
      bullets: ["카테고리 카드", "서브테마 칩", "테마별 피드 재사용"],
    },
  }[section];

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div>
        <span className="inline-flex rounded-full bg-[#ebe7ff] px-3 py-1 text-xs font-semibold text-[#6254ea]">
          {content.kicker}
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
          {content.title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          {content.body}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {content.bullets.map((item) => (
          <div
            key={item}
            className="rounded-[24px] border border-[#ede7da] bg-white p-4 text-left shadow-[0_10px_25px_rgba(98,84,234,0.06)]"
          >
            <div className="mb-3 h-10 w-10 rounded-2xl bg-[linear-gradient(180deg,#7a6ff4,#5c4edd)]" />
            <p className="text-sm font-medium text-slate-700">{item}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] bg-[#211d3a] p-5 text-left text-white">
          <p className="text-xs tracking-[0.22em] text-white/55 uppercase">
            Prototype Notes
          </p>
          <p className="mt-3 text-sm leading-6 text-white/82">
            지금 단계는 API 연동 전 시각 흐름 검증용입니다. 색감, 레이아웃,
            간격, 클릭 흐름을 먼저 고정하고 이후 실제 데이터로 교체하기 좋게
            만들어뒀습니다.
          </p>
        </div>
        <div className="rounded-[28px] border border-dashed border-[#d8d0c2] bg-[#fffdfa] p-5 text-left">
          <p className="text-xs tracking-[0.22em] text-slate-400 uppercase">
            Ready For Next
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            다음 단계에서는 F2 상세, F5 소장함, F8 룰렛까지 같은 컴포넌트
            문법으로 확장할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function PhoneStage({ section }: { section: Section }) {
  return (
    <div className="flex justify-center">
      <div className="phone-shell w-full max-w-[360px]">
        <div className="phone-screen">
          {section === "onboarding" && <OnboardingPrototype />}
          {section === "feed" && <FeedPrototype />}
          {section === "search" && <SearchPrototype />}
          {section === "theme" && <ThemePrototype />}
        </div>
      </div>
    </div>
  );
}

function OnboardingPrototype() {
  const onboardingStep = usePrototypeStore((state) => state.onboardingStep);
  const setOnboardingStep = usePrototypeStore(
    (state) => state.setOnboardingStep,
  );
  const selectedThemePrefs = usePrototypeStore(
    (state) => state.selectedThemePrefs,
  );
  const toggleThemePref = usePrototypeStore((state) => state.toggleThemePref);
  const selectedRegion = usePrototypeStore((state) => state.selectedRegion);
  const setSelectedRegion = usePrototypeStore(
    (state) => state.setSelectedRegion,
  );
  const selectedDuration = usePrototypeStore((state) => state.selectedDuration);
  const setSelectedDuration = usePrototypeStore(
    (state) => state.setSelectedDuration,
  );
  const selectedCompanion = usePrototypeStore(
    (state) => state.selectedCompanion,
  );
  const setSelectedCompanion = usePrototypeStore(
    (state) => state.setSelectedCompanion,
  );
  const selectedBudget = usePrototypeStore((state) => state.selectedBudget);
  const setSelectedBudget = usePrototypeStore(
    (state) => state.setSelectedBudget,
  );
  const setActiveSection = usePrototypeStore((state) => state.setActiveSection);

  return (
    <div className="flex h-full flex-col rounded-[30px] bg-[#f8f4ed] p-4">
      <ProgressDots total={4} current={onboardingStep} />

      {onboardingStep === 0 && (
        <div className="flex h-full flex-col justify-between rounded-[28px] border border-[#e7dece] bg-white px-5 py-7 shadow-[0_12px_30px_rgba(56,48,34,0.08)]">
          <div className="pt-10 text-center">
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_top,#efe9ff,#d8d1ff)]">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-sm font-semibold text-[#6254ea] shadow-md">
                GO
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-semibold text-slate-900">
              꼬잉꼬잉
            </h3>
            <p className="mt-4 text-sm leading-6 text-slate-500">
              당일치기 여행,
              <br />
              나한테 딱 맞게
            </p>
          </div>
          <div className="space-y-3">
            <PrimaryButton onClick={() => setOnboardingStep(1)}>
              시작하기
            </PrimaryButton>
            <GhostButton onClick={() => setActiveSection("feed")}>
              둘러보기
            </GhostButton>
            <p className="text-center text-xs text-slate-400">① 스플래시</p>
          </div>
        </div>
      )}

      {onboardingStep === 1 && (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e7dece] bg-white px-4 py-5 shadow-[0_12px_30px_rgba(56,48,34,0.08)]">
          <ScreenTitle
            title="어떤 여행을"
            subtitle="테마를 선택해주세요 (복수 선택 가능)"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            {onboardingThemes.map((theme) => (
              <Chip
                key={theme}
                active={selectedThemePrefs.includes(theme)}
                onClick={() => toggleThemePref(theme)}
              >
                {theme}
              </Chip>
            ))}
          </div>
          <div className="mt-auto space-y-3 pt-6">
            <PrimaryButton onClick={() => setOnboardingStep(2)}>
              다음
            </PrimaryButton>
            <p className="text-center text-xs text-slate-400">② 테마 선택</p>
          </div>
        </div>
      )}

      {onboardingStep === 2 && (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e7dece] bg-white px-4 py-5 shadow-[0_12px_30px_rgba(56,48,34,0.08)]">
          <ScreenTitle title="자주 가는" subtitle="추천 기준이 됩니다" />
          <div className="mt-5 space-y-3">
            {regionOptions.map((region) => (
              <SelectRow
                key={region}
                active={selectedRegion === region}
                label={region}
                onClick={() => setSelectedRegion(region)}
              />
            ))}
          </div>
          <div className="mt-auto space-y-3 pt-6">
            <PrimaryButton onClick={() => setOnboardingStep(3)}>
              다음
            </PrimaryButton>
            <GhostButton onClick={() => setOnboardingStep(1)}>이전</GhostButton>
            <p className="text-center text-xs text-slate-400">③ 지역 선택</p>
          </div>
        </div>
      )}

      {onboardingStep === 3 && (
        <div className="flex h-full flex-col rounded-[28px] border border-[#e7dece] bg-white px-4 py-5 shadow-[0_12px_30px_rgba(56,48,34,0.08)]">
          <ScreenTitle title="여행 스타일이" subtitle="맞춤 추천에 활용돼요" />

          <PreferenceBlock label="이동 시간">
            {durationOptions.map((item) => (
              <Chip
                key={item}
                active={selectedDuration === item}
                onClick={() => setSelectedDuration(item)}
              >
                {item}
              </Chip>
            ))}
          </PreferenceBlock>

          <PreferenceBlock label="동행">
            {companionOptions.map((item) => (
              <Chip
                key={item}
                active={selectedCompanion === item}
                onClick={() => setSelectedCompanion(item)}
              >
                {item}
              </Chip>
            ))}
          </PreferenceBlock>

          <PreferenceBlock label="예산">
            {budgetOptions.map((item) => (
              <Chip
                key={item}
                active={selectedBudget === item}
                onClick={() => setSelectedBudget(item)}
              >
                {item}
              </Chip>
            ))}
          </PreferenceBlock>

          <div className="mt-auto space-y-3 pt-6">
            <PrimaryButton onClick={() => setActiveSection("feed")}>
              꼬잉꼬잉 시작
            </PrimaryButton>
            <GhostButton onClick={() => setOnboardingStep(2)}>이전</GhostButton>
            <p className="text-center text-xs text-slate-400">④ 여행 스타일</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedPrototype() {
  const feedFilter = usePrototypeStore((state) => state.feedFilter);
  const setFeedFilter = usePrototypeStore((state) => state.setFeedFilter);
  const setActiveSection = usePrototypeStore((state) => state.setActiveSection);

  return (
    <div className="flex h-full flex-col bg-[#fbf8f1]">
      <div className="flex items-center justify-between px-5 pt-5">
        <div className="text-left">
          <p className="text-base font-semibold text-slate-900">꼬잉꼬잉</p>
          <p className="text-xs text-slate-400">오늘의 당일치기 추천</p>
        </div>
        <div className="flex gap-2 text-slate-500">
          <IconButton onClick={() => setActiveSection("search")}>⌕</IconButton>
          <IconButton onClick={() => undefined}>◌</IconButton>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-1">
        {feedFilters.map((item) => (
          <Chip
            key={item}
            active={feedFilter === item}
            onClick={() => setFeedFilter(item)}
            compact
          >
            {item}
          </Chip>
        ))}
      </div>

      <div className="masonry-grid mt-4 flex-1 px-5">
        {feedCards.map((card) => (
          <article
            key={card.id}
            className="masonry-item overflow-hidden rounded-[22px] border border-[#ede6d9] bg-white p-3 shadow-[0_12px_24px_rgba(68,50,18,0.06)]"
          >
            <div
              className={`h-24 rounded-[16px] bg-gradient-to-br ${card.tone} relative`}
            >
              <div className="absolute inset-x-3 top-3 rounded-xl bg-white/55 px-3 py-2 text-center text-[11px] font-semibold text-slate-700 backdrop-blur">
                {card.subtitle}
              </div>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="text-left">
                <h3 className="text-[13px] leading-5 font-semibold text-slate-800">
                  {card.title}
                </h3>
                <p className="mt-1 text-[11px] text-slate-400">{card.region}</p>
              </div>
              <button
                type="button"
                className="text-sm text-[#d48ab2] transition hover:scale-110"
              >
                ♡
              </button>
            </div>
            {card.hot ? (
              <div className="mt-2 flex justify-end">
                <span className="rounded-full bg-[#ffefe8] px-2 py-1 text-[10px] font-semibold text-[#ff6f47]">
                  HOT
                </span>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <BottomTabBar
        active="home"
        onSearch={() => setActiveSection("search")}
        onTheme={() => setActiveSection("theme")}
      />
    </div>
  );
}

function SearchPrototype() {
  const searchMode = usePrototypeStore((state) => state.searchMode);
  const setSearchMode = usePrototypeStore((state) => state.setSearchMode);
  const searchKeyword = usePrototypeStore((state) => state.searchKeyword);
  const setSearchKeyword = usePrototypeStore((state) => state.setSearchKeyword);
  const activeSearchFilters = usePrototypeStore(
    (state) => state.activeSearchFilters,
  );
  const removeSearchFilter = usePrototypeStore(
    (state) => state.removeSearchFilter,
  );
  const resetSearchFilters = usePrototypeStore(
    (state) => state.resetSearchFilters,
  );
  const setActiveSection = usePrototypeStore((state) => state.setActiveSection);

  return (
    <div className="flex h-full flex-col bg-[#fbf8f1] p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="text-lg text-slate-500"
          onClick={() => setActiveSection("feed")}
        >
          ←
        </button>
        <div className="flex flex-1 items-center rounded-2xl border border-[#dfd7ca] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(63,47,16,0.04)]">
          <span className="mr-2 text-slate-300">⌕</span>
          <input
            value={searchKeyword}
            onChange={(event) => setSearchKeyword(event.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-300"
            placeholder="지역, 맛집, 명소"
          />
          <button
            type="button"
            className="text-slate-400"
            onClick={() => setSearchKeyword("")}
          >
            ×
          </button>
        </div>
        <IconButton onClick={() => setSearchMode("filter")}>≡</IconButton>
      </div>

      {searchMode === "home" && (
        <div className="mt-5 rounded-[24px] border border-[#e9e1d4] bg-white p-4 shadow-[0_12px_24px_rgba(63,47,16,0.05)]">
          <SectionLabel title="최근 검색" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["서울숲", "속초 물회", "부산 당일치기"].map((item) => (
              <Chip
                key={item}
                active={false}
                onClick={() => setSearchKeyword(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
          <div className="my-5 border-t border-[#f0eadf]" />
          <SectionLabel title="인기 검색어" />
          <div className="mt-3 space-y-3 text-left">
            {trendKeywords.map((item, index) => (
              <button
                key={item}
                type="button"
                className="flex w-full items-center gap-3 text-sm"
                onClick={() => {
                  setSearchKeyword(item);
                  setSearchMode("results");
                }}
              >
                <span className="w-5 text-xs font-semibold text-[#6254ea]">
                  {index + 1}
                </span>
                <span className="text-slate-600">{item}</span>
              </button>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryButton onClick={() => setSearchMode("results")}>
              검색
            </PrimaryButton>
          </div>
        </div>
      )}

      {searchMode === "filter" && (
        <div className="mt-5 rounded-[24px] border border-[#e9e1d4] bg-white p-4 shadow-[0_12px_24px_rgba(63,47,16,0.05)]">
          <SectionLabel title="지역" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["수도권", "부산/경남", "강원", "제주", "충청"].map((item) => (
              <Chip
                key={item}
                active={item === "부산/경남"}
                onClick={() => undefined}
              >
                {item}
              </Chip>
            ))}
          </div>

          <SectionLabel className="mt-6" title="테마" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["맛집", "명소", "루트", "힐링"].map((item) => (
              <Chip
                key={item}
                active={item !== "힐링"}
                onClick={() => undefined}
              >
                {item}
              </Chip>
            ))}
          </div>

          <SectionLabel className="mt-6" title="여행 유형" />
          <div className="mt-3 flex flex-wrap gap-2">
            {["당일치기", "커플", "혼자", "가족"].map((item) => (
              <Chip
                key={item}
                active={item === "당일치기"}
                onClick={() => undefined}
              >
                {item}
              </Chip>
            ))}
          </div>

          <div className="mt-8 flex gap-3">
            <GhostButton onClick={resetSearchFilters}>초기화</GhostButton>
            <PrimaryButton onClick={() => setSearchMode("results")}>
              결과 보기
            </PrimaryButton>
          </div>
        </div>
      )}

      {searchMode === "results" && (
        <div className="mt-4 flex h-full min-h-0 flex-col">
          <div className="mb-3 flex flex-wrap gap-2">
            {activeSearchFilters.map((filter) => (
              <FilterPill
                key={filter.id}
                label={filter.label}
                tone={filter.tone}
                onRemove={() => removeSearchFilter(filter.id)}
              />
            ))}
          </div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-800">결과 24개</p>
            <button
              type="button"
              className="rounded-full border border-[#e6ded1] bg-white px-3 py-1 text-xs text-slate-500"
            >
              추천순
            </button>
          </div>
          <div className="space-y-3 overflow-y-auto pb-2">
            {searchResults.map((item) => (
              <article
                key={item.title}
                className="flex items-center gap-3 rounded-[20px] border border-[#ebe4d7] bg-white p-3 shadow-[0_10px_20px_rgba(63,47,16,0.04)]"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${item.tone} text-lg`}
                >
                  ◌
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {item.title}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{item.meta}</p>
                </div>
                <span className="text-xs font-medium text-[#6254ea]">
                  {item.count}
                </span>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ThemePrototype() {
  const themeMode = usePrototypeStore((state) => state.themeMode);
  const setThemeMode = usePrototypeStore((state) => state.setThemeMode);
  const selectedCategory = usePrototypeStore((state) => state.selectedCategory);
  const setSelectedCategory = usePrototypeStore(
    (state) => state.setSelectedCategory,
  );
  const selectedSubthemes = usePrototypeStore(
    (state) => state.selectedSubthemes,
  );
  const toggleSubtheme = usePrototypeStore((state) => state.toggleSubtheme);
  const setActiveSection = usePrototypeStore((state) => state.setActiveSection);

  return (
    <div className="flex h-full flex-col bg-[#fbf8f1] p-4">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <p className="text-sm font-semibold text-slate-900">탐색</p>
          <p className="text-[11px] text-slate-400">테마별로 골라보기</p>
        </div>
        <div className="flex gap-2">
          <IconButton onClick={() => setActiveSection("feed")}>←</IconButton>
          <IconButton onClick={() => setActiveSection("search")}>⌕</IconButton>
        </div>
      </div>

      {themeMode === "home" && (
        <div className="mt-5 space-y-4">
          {themeCategories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setSelectedCategory(category.name)}
              className="w-full rounded-[24px] border border-[#e9e1d4] bg-white p-4 text-left shadow-[0_12px_24px_rgba(63,47,16,0.05)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {category.name}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    콘텐츠 총 {category.count}개
                  </p>
                </div>
                <span className="text-slate-300">›</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {category.swatches.map((color) => (
                  <div
                    key={color}
                    className="h-11 rounded-2xl"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
          <p className="pt-1 text-center text-xs text-slate-400">① 테마 홈</p>
        </div>
      )}

      {themeMode === "subthemes" && (
        <div className="mt-5 rounded-[24px] border border-[#e9e1d4] bg-white p-4 shadow-[0_12px_24px_rgba(63,47,16,0.05)]">
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              className="text-slate-500"
              onClick={() => setThemeMode("home")}
            >
              ←
            </button>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-900">
                {selectedCategory}
              </p>
              <p className="text-[11px] text-slate-400">세부 카테고리</p>
            </div>
            <span className="w-4" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {subthemes.map((item, index) => (
              <button
                key={item}
                type="button"
                onClick={() => toggleSubtheme(item)}
                className={[
                  "rounded-[18px] border p-3 text-left transition",
                  selectedSubthemes.includes(item)
                    ? "border-[#7d70f1] bg-[#f2efff]"
                    : "border-[#eee7db] bg-white hover:bg-slate-50",
                ].join(" ")}
              >
                <p className="text-[11px] text-slate-400">#{index + 1}</p>
                <p className="mt-2 text-sm font-medium text-slate-700">
                  {item}
                </p>
              </button>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["수도권", "강원", "제주", "부산"].map((item) => (
              <Chip
                key={item}
                active={item === "부산"}
                onClick={() => undefined}
              >
                {item}
              </Chip>
            ))}
          </div>
          <div className="mt-6">
            <PrimaryButton onClick={() => setThemeMode("feed")}>
              결과 보기
            </PrimaryButton>
          </div>
          <p className="pt-3 text-center text-xs text-slate-400">
            ② 서브테마 선택
          </p>
        </div>
      )}

      {themeMode === "feed" && (
        <div className="mt-5 flex h-full min-h-0 flex-col">
          <div className="mb-3 flex items-center gap-2">
            <button
              type="button"
              className="text-slate-500"
              onClick={() => setThemeMode("subthemes")}
            >
              ←
            </button>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-900">
                {selectedCategory} · {selectedSubthemes.join(", ") || "전체"}
              </p>
              <p className="text-[11px] text-slate-400">테마별 피드</p>
            </div>
          </div>
          <div className="mb-3 flex flex-wrap gap-2">
            <FilterPill
              label={selectedCategory}
              tone="purple"
              onRemove={() => setThemeMode("subthemes")}
            />
            {selectedSubthemes.slice(0, 2).map((item) => (
              <FilterPill
                key={item}
                label={item}
                tone="mint"
                onRemove={() => toggleSubtheme(item)}
              />
            ))}
          </div>
          <div className="masonry-grid flex-1 overflow-y-auto">
            {feedCards.slice(0, 4).map((card) => (
              <article
                key={card.id}
                className="masonry-item overflow-hidden rounded-[22px] border border-[#ede6d9] bg-white p-3 shadow-[0_12px_24px_rgba(68,50,18,0.06)]"
              >
                <div
                  className={`h-24 rounded-[16px] bg-gradient-to-br ${card.tone}`}
                />
                <p className="mt-3 text-left text-[13px] font-semibold text-slate-800">
                  {card.title}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    {card.region}
                  </span>
                  <span className="text-slate-300">♡</span>
                </div>
              </article>
            ))}
          </div>
          <p className="pt-3 text-center text-xs text-slate-400">
            ③ 테마별 피드
          </p>
        </div>
      )}
    </div>
  );
}

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="mb-4 flex justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <span
          key={index}
          className={[
            "h-1.5 rounded-full transition-all",
            current === index ? "w-5 bg-[#6254ea]" : "w-1.5 bg-slate-300",
          ].join(" ")}
        />
      ))}
    </div>
  );
}

function ScreenTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-left">
      <h3 className="text-[22px] leading-8 font-semibold text-slate-900">
        {title}
      </h3>
      <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function PreferenceBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 text-left">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function SelectRow({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm transition",
        active
          ? "border-[#7c70f1] bg-[#f4f1ff] text-[#4c3fcb]"
          : "border-[#e9e0d2] bg-white text-slate-500 hover:bg-slate-50",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "h-4 w-4 rounded-full border",
          active
            ? "border-[#6254ea] bg-[#6254ea]"
            : "border-slate-300 bg-white",
        ].join(" ")}
      />
    </button>
  );
}

function Chip({
  active,
  children,
  onClick,
  compact,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border transition",
        compact ? "px-3 py-1.5 text-[11px]" : "px-3 py-2 text-xs",
        active
          ? "border-[#8578f2] bg-[#f0edff] font-medium text-[#5b4ee0]"
          : "border-[#e6ddd0] bg-white text-slate-500 hover:bg-slate-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function FilterPill({
  label,
  tone = "slate",
  onRemove,
}: {
  label: string;
  tone?: "purple" | "mint" | "amber" | "slate";
  onRemove: () => void;
}) {
  const tones = {
    purple: "bg-[#efeaff] text-[#6254ea]",
    mint: "bg-[#e7fbf4] text-[#1b9b76]",
    amber: "bg-[#fff5e3] text-[#c78317]",
    slate: "bg-white text-slate-500",
  };

  return (
    <button
      type="button"
      onClick={onRemove}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {label}
      <span className="text-[10px] opacity-70">×</span>
    </button>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl bg-[linear-gradient(180deg,#6d61f2,#5849d8)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_28px_rgba(88,73,216,0.34)] transition hover:translate-y-[-1px]"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-2xl border border-[#e8dfd3] bg-white px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

function IconButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e7dfd3] bg-white text-sm shadow-[0_4px_10px_rgba(56,48,34,0.04)]"
    >
      {children}
    </button>
  );
}

function SectionLabel({
  title,
  className = "",
}: {
  title: string;
  className?: string;
}) {
  return (
    <p className={`text-left text-xs font-medium text-slate-400 ${className}`}>
      {title}
    </p>
  );
}

function BottomTabBar({
  active,
  onSearch,
  onTheme,
}: {
  active: "home" | "search" | "theme";
  onSearch: () => void;
  onTheme: () => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-5 border-t border-[#eee6da] bg-white px-3 py-3 text-[10px] text-slate-400">
      <TabItem
        active={active === "home"}
        label="홈"
        icon="⌂"
        onClick={() => undefined}
      />
      <TabItem
        active={active === "theme"}
        label="탐색"
        icon="◎"
        onClick={onTheme}
      />
      <TabItem active={false} label="룰렛" icon="▣" onClick={() => undefined} />
      <TabItem
        active={false}
        label="소장함"
        icon="♡"
        onClick={() => undefined}
      />
      <TabItem
        active={active === "search"}
        label="MY"
        icon="◌"
        onClick={onSearch}
      />
    </div>
  );
}

function TabItem({
  active,
  label,
  icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex flex-col items-center gap-1",
        active ? "text-[#6254ea]" : "text-slate-400",
      ].join(" ")}
    >
      <span className="text-sm">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default App;
