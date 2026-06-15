import { useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { navigateTo } from "../../shared/lib/router";
import {
  SearchIcon,
  SlidersIcon,
  UserCircleIcon,
} from "../../shared/ui/AppIcons";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type SearchStage = "home" | "filters" | "results";

type ResultCard = {
  category: "맛집" | "명소" | "루트";
  id: string;
  imageIcon: string;
  subtitle: string;
  title: string;
};

const recentSearches = ["성심당", "속초 물회", "부산 당일치기"];
const trendingKeywords = [
  "전주 한옥마을",
  "대구 뭉티기",
  "속초 영금정",
  "제주 산방산",
];

const regionOptions = ["전국", "수도권", "부산/경남", "강원", "제주", "전라", "충청"];
const themeOptions = ["맛집", "명소", "루트", "힐링", "등산", "계곡", "축제"];
const typeOptions = ["당일치기", "1박 2일", "혼자", "커플", "가족"];
const sortOptions = ["추천순", "인기순", "최신순"] as const;

const resultCards: ResultCard[] = [
  {
    id: "search-001",
    imageIcon: "🍖",
    category: "맛집",
    subtitle: "부산 서면",
    title: "부산 돼지국밥 골목",
  },
  {
    id: "search-002",
    imageIcon: "🌊",
    category: "명소",
    subtitle: "부산 수영구",
    title: "광안리 해수욕장",
  },
  {
    id: "search-003",
    imageIcon: "🍜",
    category: "맛집",
    subtitle: "부산 동래구",
    title: "밀면 맛집 투어",
  },
  {
    id: "search-004",
    imageIcon: "🏖",
    category: "루트",
    subtitle: "부산 해운대구",
    title: "해운대 당일 루트",
  },
];

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "검색", href: buildPath.search(), active: true },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
  {
    icon: <UserCircleIcon className="h-[18px] w-[18px]" />,
    label: "MY",
    href: buildPath.my(),
    active: false,
  },
];

const categoryTone: Record<ResultCard["category"], string> = {
  맛집: "bg-[#f2efff] text-[#6d58d8]",
  명소: "bg-[#edf7e9] text-[#6ea243]",
  루트: "bg-[#eaf3ff] text-[#3880d7]",
};

type FilterChipProps = {
  active: boolean;
  children: string;
  onClick?: () => void;
};

function FilterChip({ active, children, onClick }: FilterChipProps) {
  return (
    <button
      className={[
        "rounded-full px-3.5 py-2 text-[13px] font-medium transition whitespace-nowrap",
        active
          ? "bg-[#f1eeff] text-[#5f51d5] shadow-[0_8px_18px_rgba(95,81,213,0.12)]"
          : "bg-[#f7f1e8] text-slate-600 hover:bg-[#faf7f2]",
      ].join(" ")}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function SearchPhone() {
  const [stage, setStage] = useState<SearchStage>("home");
  const [keyword, setKeyword] = useState("부산");
  const [selectedRegions, setSelectedRegions] = useState<string[]>(["부산/경남"]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["맛집", "명소"]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["당일치기"]);
  const [selectedSort, setSelectedSort] =
    useState<(typeof sortOptions)[number]>("추천순");

  const appliedFilters = [...selectedRegions, ...selectedThemes, ...selectedTypes];

  const toggleItem = (
    list: string[],
    value: string,
    setList: (next: string[]) => void,
  ) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <header className="flex w-full items-center gap-3">
          <button
            aria-label="뒤로가기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] text-slate-700 transition hover:bg-[#f8f4ee]"
            type="button"
            onClick={() => (stage === "home" ? navigateTo(buildPath.home()) : setStage("home"))}
          >
            ←
          </button>

          <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-[22px] bg-[#f8f5ef] px-4">
            <SearchIcon className="h-[18px] w-[18px] shrink-0 text-slate-400" />
            <input
              className="min-w-0 flex-1 border-none bg-transparent text-[15px] font-medium text-slate-900 outline-none"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="지역, 맛집, 명소 검색"
            />
            {stage === "filters" ? (
              <button
                aria-label="검색어 지우기"
                className="text-base text-slate-400"
                type="button"
                onClick={() => setKeyword("")}
              >
                ×
              </button>
            ) : null}
          </div>

          <button
            aria-label="필터 열기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[20px] text-[#5f51d5] transition hover:bg-[#f6f1ff]"
            type="button"
            onClick={() => setStage(stage === "filters" ? "results" : "filters")}
          >
            <SlidersIcon className="h-[19px] w-[19px]" />
          </button>
        </header>

        {stage === "home" ? (
          <div className="no-scrollbar mt-6 flex-1 overflow-y-auto">
            <section>
              <h2 className="text-sm font-semibold text-slate-700">최근 검색</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {recentSearches.map((item) => (
                  <button
                    key={item}
                    className="rounded-full bg-[#f7f1e8] px-4 py-2 text-[13px] text-slate-600"
                    type="button"
                    onClick={() => setKeyword(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </section>

            <section className="mt-7 pt-5">
              <h2 className="text-sm font-semibold text-slate-700">인기 검색어</h2>
              <ol className="mt-3 space-y-3">
                {trendingKeywords.map((item, index) => (
                  <li key={item} className="flex items-center gap-3 text-[15px]">
                    <span className="w-4 text-center font-semibold text-[#5f51d5]">
                      {index + 1}
                    </span>
                    <button
                      className="text-left text-slate-700"
                      type="button"
                      onClick={() => {
                        setKeyword(item);
                        setStage("results");
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        ) : null}

        {stage === "filters" ? (
          <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
            <section>
              <h2 className="text-sm font-semibold text-slate-700">지역</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {regionOptions.map((option) => (
                  <FilterChip
                    key={option}
                    active={selectedRegions.includes(option)}
                    onClick={() => toggleItem(selectedRegions, option, setSelectedRegions)}
                  >
                    {option}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-slate-700">테마</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {themeOptions.map((option) => (
                  <FilterChip
                    key={option}
                    active={selectedThemes.includes(option)}
                    onClick={() => toggleItem(selectedThemes, option, setSelectedThemes)}
                  >
                    {option}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-slate-700">여행 유형</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {typeOptions.map((option) => (
                  <FilterChip
                    key={option}
                    active={selectedTypes.includes(option)}
                    onClick={() => toggleItem(selectedTypes, option, setSelectedTypes)}
                  >
                    {option}
                  </FilterChip>
                ))}
              </div>
            </section>

            <div className="mt-8 flex items-center justify-between pt-4">
              <button
                className="rounded-xl bg-[#f7f1e8] px-4 py-2 text-[13px] font-medium text-slate-600"
                type="button"
                onClick={() => {
                  setSelectedRegions([]);
                  setSelectedThemes([]);
                  setSelectedTypes([]);
                }}
              >
                초기화
              </button>
              <button
                className="rounded-xl bg-[#5f51d5] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(95,81,213,0.24)]"
                type="button"
                onClick={() => setStage("results")}
              >
                결과 보기
              </button>
            </div>
          </div>
        ) : null}

        {stage === "results" ? (
          <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
            <div className="flex flex-wrap gap-2">
              {appliedFilters.map((filter) => (
                <button
                  key={filter}
                  className="rounded-full bg-[#f1eeff] px-3 py-1.5 text-[11px] font-medium text-[#5f51d5]"
                  type="button"
                >
                  {filter} ×
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <p className="text-[13px] font-medium text-slate-600">결과 24개</p>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  className={[
                    "rounded-full px-3 py-1.5 text-[12px] font-medium transition",
                    selectedSort === option
                      ? "bg-[#f1eeff] text-[#5f51d5]"
                      : "bg-[#f7f1e8] text-slate-600",
                  ].join(" ")}
                  type="button"
                  onClick={() => setSelectedSort(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-2">
              {resultCards.map((card) => (
                <RouteLink
                  key={card.id}
                  className="flex items-center gap-3 rounded-[18px] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(99,75,43,0.04)]"
                  href={buildPath.contentDetail(card.id)}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ece7df] text-xl">
                    {card.imageIcon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-slate-900">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-slate-500">⌖ {card.subtitle}</p>
                  </div>
                  <span
                    className={[
                      "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                      categoryTone[card.category],
                    ].join(" ")}
                  >
                    {card.category}
                  </span>
                </RouteLink>
              ))}
            </div>
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

export function SearchPage() {
  return (
    <ShowcaseLayout phone={<SearchPhone />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          SEARCH
        </span>
        필터 / 검색
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        검색도 바로
        <br />
        필터링에 집중하게.
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        최근 검색, 인기 검색어, 지역과 테마 필터를 한 화면 안에서 빠르게 전환하고
        결과 리스트까지 자연스럽게 이어지는 검색 흐름입니다.
      </p>
    </ShowcaseLayout>
  );
}
