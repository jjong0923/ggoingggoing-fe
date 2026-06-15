import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { getContents, getHotContents } from "../../shared/apis/contents";
import type { ContentSummary } from "../../shared/apis/types";
import { logout } from "../../shared/apis/auth";
import {
  clearAuthSession,
  getRefreshToken,
  useAuthUser,
} from "../../shared/lib/authSession";
import {
  getCategoryLabelFromContentType,
  getContentTypeFromCategoryLabel,
  getRegionIdFromLabel,
} from "../../shared/lib/apiMappings";
import {
  BellIcon,
  SearchIcon,
  SlidersIcon,
} from "../../shared/ui/AppIcons";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type FeedCard = {
  id: string;
  badge?: "HOT";
  category: "맛집" | "명소" | "루트";
  imageLabel: string;
  location: string;
  region: string;
  title: string;
};

const recentSearches = ["성심당", "속초 물회", "부산 당일치기"];
const trendingKeywords = [
  "전주 한옥마을",
  "대구 뭉티기",
  "속초 영금정",
  "제주 산방산",
];

const searchRegionOptions = ["전국", "수도권", "부산/경남", "강원", "제주", "전라", "충청"];
const searchThemeOptions = ["맛집", "명소", "루트", "힐링", "등산", "계곡", "축제"];
const searchTypeOptions = ["당일치기", "1박 2일", "혼자", "커플", "가족"];
const sortOptions = ["추천순", "인기순", "최신순"] as const;
const categoryOptions = ["전체", "맛집", "명소"] as const;
const regionOptions = ["전체", "수도권", "부산/경남", "강원", "제주", "전라", "충청"] as const;

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: true },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: false },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
];

const categoryTone: Record<FeedCard["category"], string> = {
  맛집: "bg-[#f2efff] text-[#6d58d8]",
  명소: "bg-[#edf7e9] text-[#6ea243]",
  루트: "bg-[#eaf3ff] text-[#3880d7]",
};

function mapContentToFeedCard(content: ContentSummary): FeedCard {
  return {
    id: String(content.id),
    badge: content.hot ? "HOT" : undefined,
    category: getCategoryLabelFromContentType(content.contentType),
    imageLabel: content.title,
    location: content.themeName,
    region: content.regionName,
    title: content.title,
  };
}

function FilterChip({
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

function HomePhone() {
  const [feedCards, setFeedCards] = useState<FeedCard[]>([]);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [selectedRegion, setSelectedRegion] = useState<string>("전체");
  const [showSearch, setShowSearch] = useState(false);
  const [searchStage, setSearchStage] = useState<"home" | "filters" | "results">("home");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchRegions, setSearchRegions] = useState<string[]>(["부산/경남"]);
  const [searchThemes, setSearchThemes] = useState<string[]>(["맛집", "명소"]);
  const [searchTypes, setSearchTypes] = useState<string[]>(["당일치기"]);
  const [selectedSort, setSelectedSort] =
    useState<(typeof sortOptions)[number]>("추천순");

  const filteredCards = useMemo(() => feedCards, [feedCards]);

  const highlightedCards = filteredCards.slice(0, 2).map((card) => card.id);
  const appliedSearchFilters = [...searchRegions, ...searchThemes, ...searchTypes];

  const searchResults = useMemo(() => {
    const lowerKeyword = searchKeyword.trim().toLowerCase();

    return feedCards.filter((card) => {
      const matchesKeyword =
        lowerKeyword.length === 0 ||
        [card.title, card.location, card.region, card.imageLabel]
          .join(" ")
          .toLowerCase()
          .includes(lowerKeyword);

      const matchesRegion =
        searchRegions.length === 0 ||
        searchRegions.some((region) => card.region.includes(region) || card.location.includes(region));

      const matchesTheme =
        searchThemes.length === 0 || searchThemes.includes(card.category);

      return matchesKeyword && matchesRegion && matchesTheme;
    });
  }, [searchKeyword, searchRegions, searchThemes]);

  const toggleSearchItem = (
    list: string[],
    value: string,
    setList: (next: string[]) => void,
  ) => {
    setList(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  useEffect(() => {
    let isMounted = true;

    const loadContents = async () => {
      try {
        const shouldLoadHot =
          selectedCategory === "전체" && selectedRegion === "전체";
        const contents = shouldLoadHot
          ? await getHotContents()
          : await getContents({
              contentType:
                selectedCategory === "전체"
                  ? undefined
                  : getContentTypeFromCategoryLabel(selectedCategory),
              regionId:
                selectedRegion === "전체"
                  ? undefined
                  : getRegionIdFromLabel(selectedRegion),
            });

        if (!isMounted) {
          return;
        }

        setFeedCards(contents.map(mapContentToFeedCard));
      } catch (error) {
        console.error("Failed to load hot contents", error);
      } finally {
        if (isMounted) {
          setIsLoadingFeed(false);
        }
      }
    };

    void loadContents();

    return () => {
      isMounted = false;
    };
  }, [feedCards, searchKeyword, searchRegions, searchThemes]);

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div
        className={[
          "relative flex h-[min(80vh,770px)] min-h-[650px] flex-col",
          showSearch ? "overflow-visible" : "overflow-hidden",
        ].join(" ")}
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-[28px] font-semibold tracking-[-0.05em] text-slate-900">
              꼬잉꼬잉
            </span>
            <span className="text-xl">🐷</span>
          </div>
          <div className="flex items-center gap-3 text-xl text-slate-700">
            <button
              aria-label="필터"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] transition hover:bg-[#f8f4ee]"
              type="button"
            >
              ☰
            </button>
            <button
              aria-label="검색"
              className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-[#f8f4ee]"
              type="button"
              onClick={() => {
                setShowSearch(true);
                setSearchStage("home");
              }}
            >
              <SearchIcon className="h-[20px] w-[20px] text-slate-700" />
            </button>
            <button
              aria-label="알림"
              className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-slate-700 transition hover:bg-[#f8f4ee]"
              type="button"
            >
              <BellIcon className="h-[20px] w-[20px]" />
            </button>
          </div>
        </header>

        <div className="mt-3 rounded-[24px] bg-[#fbf7f1] px-4 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8da1c4]">
              Category
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  className={[
                    "rounded-full px-4 py-2 text-[14px] font-medium transition",
                    selectedCategory === category
                      ? "bg-[#f1eeff] text-[#5f51d5]"
                      : "bg-white text-slate-600",
                  ].join(" ")}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8da1c4]">
              Region
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <button
                  key={region}
                  className={[
                    "rounded-full px-4 py-2 text-[14px] font-medium transition",
                    selectedRegion === region
                      ? "bg-[#f1eeff] text-[#5f51d5]"
                      : "bg-white text-slate-600",
                  ].join(" ")}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-500">
              {isLoadingFeed ? "추천 불러오는 중..." : `총 ${filteredCards.length}개 추천`}
            </p>
            {(selectedCategory !== "전체" || selectedRegion !== "전체") ? (
              <button
                className="text-[12px] font-semibold text-[#5f51d5]"
                type="button"
                onClick={() => {
                  setSelectedCategory("전체");
                  setSelectedRegion("전체");
                }}
              >
                필터 초기화
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!isLoadingFeed && filteredCards.length === 0 ? (
              <div className="col-span-2 rounded-[24px] bg-white px-5 py-10 text-center text-[14px] text-slate-500 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
                현재 조건에 맞는 컨텐츠가 없어요.
              </div>
            ) : null}
            {filteredCards.map((card) => {
              const isHighlighted = highlightedCards.includes(card.id);

              return (
                <RouteLink
                  key={card.id}
                  className={[
                    "flex h-[258px] w-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_10px_24px_rgba(99,75,43,0.06)] transition",
                    isHighlighted
                      ? "bg-[#fcfbff] shadow-[0_18px_34px_rgba(95,81,213,0.14)]"
                      : "",
                  ].join(" ")}
                  href={buildPath.contentDetail(card.id)}
                >
                  <div
                    className={[
                      "p-4",
                      isHighlighted ? "bg-[#efeaff]" : "bg-[#ebebeb]",
                    ].join(" ")}
                  >
                    <div
                      className={[
                        "flex h-[96px] items-center justify-center rounded-2xl text-sm font-semibold",
                        isHighlighted
                          ? "bg-[linear-gradient(135deg,#6a5dde_0%,#a491ff_100%)] text-white"
                          : "bg-[#cfcfcf] text-white",
                      ].join(" ")}
                    >
                      {card.imageLabel}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col px-4 pb-4 pt-3">
                    <h2 className="text-[15px] font-semibold leading-5 tracking-[-0.03em] text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">
                      {card.location}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[12px] text-slate-500">
                      <span>⌖</span>
                      <span>{card.region}</span>
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <span
                        className={[
                          "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
                          categoryTone[card.category],
                        ].join(" ")}
                      >
                        {card.category}
                      </span>

                      <div className="flex items-center gap-2">
                        {card.badge ? (
                          <span className="rounded-full bg-[#ffe9df] px-2.5 py-1 text-[10px] font-semibold text-[#ec7e52]">
                            HOT
                          </span>
                        ) : null}
                        <button
                          aria-label={`${card.title} 찜하기`}
                          className="text-lg leading-none text-[#ff7da6]"
                          type="button"
                        >
                          ♥
                        </button>
                      </div>
                    </div>
                  </div>
                </RouteLink>
              );
            })}
          </div>
        </div>

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

        {showSearch ? (
          <div className="absolute -inset-x-5 top-2 bottom-24 z-20 overflow-hidden rounded-[30px] border border-white/90 bg-[linear-gradient(180deg,rgba(248,244,255,0.96)_0%,rgba(255,253,250,0.94)_48%,rgba(255,255,255,0.92)_100%)] px-5 py-5 shadow-[0_24px_48px_rgba(95,81,213,0.16)] backdrop-blur-sm md:-inset-x-6">
            <div className="absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_top,#dcd4ff_0%,rgba(220,212,255,0)_72%)]" />
            <div className="flex h-full flex-col overflow-hidden">
              <div className="relative mb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7b6ce8]">
                  Quick Search
                </p>
                <p className="mt-1 text-[13px] text-slate-500">
                  홈 피드 위에서 바로 조건을 좁혀볼 수 있어요
                </p>
              </div>

              <header className="flex w-full items-center gap-3">
                <button
                  aria-label="검색 닫기"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] text-slate-700 transition hover:bg-[#f8f4ee]"
                  type="button"
                  onClick={() => setShowSearch(false)}
                >
                  ←
                </button>

                <div className="flex h-12 min-w-0 flex-1 items-center gap-2 rounded-[22px] border border-white/80 bg-white/75 px-4 shadow-[0_10px_24px_rgba(95,81,213,0.08)]">
                  <SearchIcon className="h-[18px] w-[18px] shrink-0 text-slate-400" />
                  <input
                    className="min-w-0 flex-1 border-none bg-transparent text-[15px] font-medium text-slate-900 outline-none"
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="가고 싶은 지역이나 장소를 검색해보세요"
                  />
                  {searchStage === "filters" ? (
                    <button
                      aria-label="검색어 지우기"
                      className="text-base text-slate-400"
                      type="button"
                      onClick={() => setSearchKeyword("")}
                    >
                      ×
                    </button>
                  ) : null}
                </div>

                <button
                  aria-label="필터 열기"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#5f51d5] transition hover:bg-[#f6f1ff]"
                  type="button"
                  onClick={() =>
                    setSearchStage((current) =>
                      current === "filters" ? "results" : "filters",
                    )
                  }
                >
                  <SlidersIcon className="h-[19px] w-[19px]" />
                </button>
              </header>

              {searchStage === "home" ? (
                <div className="no-scrollbar mt-6 flex-1 overflow-y-auto">
                  <section className="rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
                    <h2 className="text-sm font-semibold text-slate-700">최근 검색</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recentSearches.map((item) => (
                        <button
                          key={item}
                          className="rounded-full bg-[#f4efff] px-4 py-2 text-[13px] font-medium text-[#5f51d5]"
                          type="button"
                          onClick={() => setSearchKeyword(item)}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="mt-4 rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
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
                              setSearchKeyword(item);
                              setSearchStage("results");
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

              {searchStage === "filters" ? (
                <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
                  <section className="rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
                    <h2 className="text-sm font-semibold text-slate-700">지역</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {searchRegionOptions.map((option) => (
                        <FilterChip
                          key={option}
                          active={searchRegions.includes(option)}
                          onClick={() =>
                            toggleSearchItem(searchRegions, option, setSearchRegions)
                          }
                        >
                          {option}
                        </FilterChip>
                      ))}
                    </div>
                  </section>

                  <section className="mt-4 rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
                    <h2 className="text-sm font-semibold text-slate-700">테마</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {searchThemeOptions.map((option) => (
                        <FilterChip
                          key={option}
                          active={searchThemes.includes(option)}
                          onClick={() =>
                            toggleSearchItem(searchThemes, option, setSearchThemes)
                          }
                        >
                          {option}
                        </FilterChip>
                      ))}
                    </div>
                  </section>

                  <section className="mt-4 rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
                    <h2 className="text-sm font-semibold text-slate-700">여행 유형</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {searchTypeOptions.map((option) => (
                        <FilterChip
                          key={option}
                          active={searchTypes.includes(option)}
                          onClick={() =>
                            toggleSearchItem(searchTypes, option, setSearchTypes)
                          }
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
                        setSearchRegions([]);
                        setSearchThemes([]);
                        setSearchTypes([]);
                      }}
                    >
                      초기화
                    </button>
                    <button
                      className="rounded-xl bg-[#5f51d5] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_12px_24px_rgba(95,81,213,0.24)]"
                      type="button"
                      onClick={() => setSearchStage("results")}
                    >
                      결과 보기
                    </button>
                  </div>
                </div>
              ) : null}

              {searchStage === "results" ? (
                <div className="no-scrollbar mt-5 flex-1 overflow-y-auto pr-1">
                  <div className="rounded-[22px] bg-white/72 px-4 py-4 shadow-[0_10px_24px_rgba(95,81,213,0.06)]">
                    <div className="flex flex-wrap gap-2">
                    {appliedSearchFilters.map((filter) => (
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
                      <p className="text-[13px] font-medium text-slate-600">
                        결과 {searchResults.length}개
                      </p>
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
                  </div>

                  <div className="mt-4 space-y-2">
                    {searchResults.map((card) => (
                      <RouteLink
                        key={card.id}
                        className="flex items-center gap-3 rounded-[18px] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(99,75,43,0.04)]"
                        href={buildPath.contentDetail(card.id)}
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ece7df] text-sm font-semibold text-slate-700">
                          {card.imageLabel}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-[14px] font-semibold text-slate-900">
                            {card.title}
                          </h3>
                          <p className="mt-1 text-[12px] text-slate-500">⌖ {card.location}</p>
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
            </div>
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
}

export function HomePage() {
  const authUser = useAuthUser();

  return (
    <ShowcaseLayout phone={<HomePhone />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          HOME
        </span>
        메인 피드
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        취향에 맞는 여행을
        <br />
        바로 둘러보는 홈.
      </h1>

      <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 md:text-lg">
        홈에서는 추천 카드와 카테고리 필터를 먼저 보여주고, 원하는 장소나 루트로
        바로 들어갈 수 있게 구성했습니다.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {authUser ? (
          <>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deee] bg-white/80 px-5 py-3 text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{authUser.nickname}</span>
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
              <p className="text-white">
                로그인
              </p>
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
