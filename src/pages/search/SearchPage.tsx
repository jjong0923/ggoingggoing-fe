import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { getContents } from "../../shared/apis/contents";
import {
  clearAuthSession,
  getRefreshToken,
  useAuthUser,
} from "../../shared/lib/authSession";
import {
  getPopularSearches,
  getRecentSearches,
  searchContents,
  searchContentsByFilter,
} from "../../shared/apis/search";
import type { ContentSummary } from "../../shared/apis/types";
import {
  getCategoryLabelFromContentType,
  getContentTypeFromCategoryLabel,
  getRegionIdFromLabel,
} from "../../shared/lib/apiMappings";
import { navigateTo } from "../../shared/lib/router";
import { SearchIcon, SlidersIcon } from "../../shared/ui/AppIcons";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type SearchStage = "home" | "filters" | "results";

type ResultCard = {
  category: "맛집" | "명소" | "루트";
  hot: boolean;
  id: string;
  subtitle: string;
  title: string;
  viewCount: number;
};

const regionOptions = [
  "전국",
  "수도권",
  "부산/경남",
  "강원",
  "제주",
  "전라",
  "충청",
];
const themeOptions = ["맛집", "명소", "루트", "힐링", "등산", "계곡", "축제"];
const typeOptions = ["당일치기", "1박 2일", "혼자", "커플", "가족"];
const sortOptions = ["추천순", "인기순", "최신순"] as const;

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "검색", href: buildPath.search(), active: true },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: false },
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
        "rounded-full px-3.5 py-2 text-[13px] font-medium whitespace-nowrap transition",
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

function toCategory(
  contentType: ContentSummary["contentType"],
): ResultCard["category"] {
  return getCategoryLabelFromContentType(contentType);
}

function mapContentToResultCard(content: ContentSummary): ResultCard {
  return {
    id: String(content.id),
    title: content.title,
    subtitle: `${content.regionName} · ${content.themeName}`,
    category: toCategory(content.contentType),
    viewCount: content.viewCount,
    hot: content.hot,
  };
}

function sortResults(
  cards: ResultCard[],
  sort: (typeof sortOptions)[number],
): ResultCard[] {
  const copiedCards = [...cards];

  if (sort === "인기순") {
    return copiedCards.sort((left, right) => right.viewCount - left.viewCount);
  }

  if (sort === "최신순") {
    return copiedCards.sort(
      (left, right) => Number(right.id) - Number(left.id),
    );
  }

  return copiedCards.sort(
    (left, right) => Number(right.hot) - Number(left.hot),
  );
}

function SearchPhone() {
  const [stage, setStage] = useState<SearchStage>("home");
  const [keyword, setKeyword] = useState("부산");
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    "부산/경남",
  ]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([
    "맛집",
    "명소",
  ]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["당일치기"]);
  const [selectedSort, setSelectedSort] =
    useState<(typeof sortOptions)[number]>("추천순");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [resultCards, setResultCards] = useState<ResultCard[]>([]);
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const appliedFilters = [
    ...selectedRegions,
    ...selectedThemes,
    ...selectedTypes,
  ];

  const sortedResults = useMemo(
    () => sortResults(resultCards, selectedSort),
    [resultCards, selectedSort],
  );

  const toggleItem = (
    list: string[],
    value: string,
    setList: (next: string[]) => void,
  ) => {
    setList(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value],
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadSearchHome = async () => {
      try {
        const [recent, popular] = await Promise.all([
          getRecentSearches(),
          getPopularSearches(),
        ]);

        if (!isMounted) {
          return;
        }

        setRecentSearches(recent);
        setTrendingKeywords(popular.map((item) => item.keyword));
      } catch (error) {
        console.error("Failed to load search metadata", error);
      }
    };

    void loadSearchHome();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (stage !== "results") {
      return;
    }

    let isMounted = true;

    const loadResults = async () => {
      setIsLoadingResults(true);
      setSearchError(null);

      try {
        const trimmedKeyword = keyword.trim();
        const hasRegionFilter =
          selectedRegions.length > 0 && !selectedRegions.includes("전국");
        const activeCategory = selectedThemes.find((theme) =>
          ["맛집", "명소", "루트"].includes(theme),
        );

        const contents =
          trimmedKeyword.length > 0
            ? await searchContents(trimmedKeyword)
            : hasRegionFilter || activeCategory
              ? await searchContentsByFilter({
                  regionId: hasRegionFilter
                    ? getRegionIdFromLabel(selectedRegions[0])
                    : undefined,
                  contentType: activeCategory
                    ? getContentTypeFromCategoryLabel(activeCategory)
                    : undefined,
                })
              : await getContents();

        if (!isMounted) {
          return;
        }

        const filteredContents = contents.filter((content) => {
          const category = toCategory(content.contentType);
          const matchesRegion =
            selectedRegions.length === 0 ||
            selectedRegions.includes("전국") ||
            selectedRegions.some((region) =>
              `${content.regionName} ${content.themeName}`.includes(
                region.replace("/경남", ""),
              ),
            );
          const matchesTheme =
            selectedThemes.length === 0 ||
            selectedThemes.some((theme) => category === theme);

          return matchesRegion && matchesTheme;
        });

        setResultCards(filteredContents.map(mapContentToResultCard));
      } catch (error) {
        console.error("Failed to load search results", error);
        if (isMounted) {
          setSearchError("검색 결과를 불러오지 못했어요.");
          setResultCards([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingResults(false);
        }
      }
    };

    void loadResults();

    return () => {
      isMounted = false;
    };
  }, [keyword, selectedRegions, selectedThemes, selectedTypes, stage]);

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <header className="flex w-full items-center gap-3">
          <button
            aria-label="뒤로가기"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[22px] text-slate-700 transition hover:bg-[#f8f4ee]"
            type="button"
            onClick={() =>
              stage === "home" ? navigateTo(buildPath.home()) : setStage("home")
            }
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
            onClick={() =>
              setStage(stage === "filters" ? "results" : "filters")
            }
          >
            <SlidersIcon className="h-[19px] w-[19px]" />
          </button>
        </header>

        {stage === "home" ? (
          <div className="no-scrollbar mt-6 flex-1 overflow-y-auto">
            <section>
              <h2 className="text-sm font-semibold text-slate-700">
                최근 검색
              </h2>
              {recentSearches.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item}
                      className="rounded-full bg-[#f7f1e8] px-4 py-2 text-[13px] text-slate-600"
                      type="button"
                      onClick={() => {
                        setKeyword(item);
                        setStage("results");
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-[13px] text-slate-500">
                  로그인 후 최근 검색어가 여기에 표시돼요.
                </p>
              )}
            </section>

            <section className="mt-7 pt-5">
              <h2 className="text-sm font-semibold text-slate-700">
                인기 검색어
              </h2>
              <ol className="mt-3 space-y-3">
                {trendingKeywords.map((item, index) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-[15px]"
                  >
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
                    onClick={() =>
                      toggleItem(selectedRegions, option, setSelectedRegions)
                    }
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
                    onClick={() =>
                      toggleItem(selectedThemes, option, setSelectedThemes)
                    }
                  >
                    {option}
                  </FilterChip>
                ))}
              </div>
            </section>

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-slate-700">
                여행 유형
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {typeOptions.map((option) => (
                  <FilterChip
                    key={option}
                    active={selectedTypes.includes(option)}
                    onClick={() =>
                      toggleItem(selectedTypes, option, setSelectedTypes)
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
              <p className="text-[13px] font-medium text-slate-600">
                {isLoadingResults
                  ? "검색 중..."
                  : `결과 ${sortedResults.length}개`}
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

            {searchError ? (
              <div className="mt-4 rounded-[18px] bg-[#fff1ee] px-4 py-3 text-[13px] text-[#b3543d]">
                {searchError}
              </div>
            ) : null}

            <div className="mt-5 space-y-2">
              {!isLoadingResults && sortedResults.length === 0 ? (
                <div className="rounded-[18px] bg-white px-4 py-10 text-center text-[14px] text-slate-500 shadow-[0_8px_20px_rgba(99,75,43,0.04)]">
                  조건에 맞는 검색 결과가 없어요.
                </div>
              ) : null}

              {sortedResults.map((card) => (
                <RouteLink
                  key={card.id}
                  className="flex items-center gap-3 rounded-[18px] bg-white px-3 py-3 shadow-[0_8px_20px_rgba(99,75,43,0.04)]"
                  href={buildPath.contentDetail(card.id)}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ece7df] text-sm font-semibold text-slate-700">
                    {card.title.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[14px] font-semibold text-slate-900">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-[12px] text-slate-500">
                      ⌖ {card.subtitle}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={[
                        "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                        categoryTone[card.category],
                      ].join(" ")}
                    >
                      {card.category}
                    </span>
                    {card.hot ? (
                      <span className="text-[10px] font-semibold text-[#ec7e52]">
                        HOT
                      </span>
                    ) : null}
                  </div>
                </RouteLink>
              ))}
            </div>
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

export function SearchPage() {
  const authUser = useAuthUser();

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
        인기 검색어와 키워드 검색, 인증이 필요한 최근 검색어까지 실제 API
        응답으로 바꾸고 결과 리스트를 그 흐름에 맞춰 연결했습니다.
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
