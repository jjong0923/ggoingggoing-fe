import { buildPath } from "../../app/router/routePaths";
import { navigateTo } from "../../shared/lib/router";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type ContentDetailPageProps = {
  contentId: string;
};

type RelatedPlace = {
  accent: string;
  emoji: string;
  id: string;
  location: string;
  title: string;
};

type ContentDetailData = {
  category: "맛집" | "명소" | "루트";
  description: string;
  emoji: string;
  hashtags: string[];
  id: string;
  likeCount: string;
  location: string;
  parking: string;
  price: string;
  recommendedRouteLabel: string;
  recommendedRouteStops: string;
  relatedPlaces: RelatedPlace[];
  title: string;
  visitTime: string;
  waiting: string;
};

const detailEntries: ContentDetailData[] = [
  {
    id: "roulette-daejeon-001",
    title: "성심당 튀김소보로",
    category: "맛집",
    emoji: "🥐",
    location: "대전 중구",
    likeCount: "2,341",
    visitTime: "당일치기",
    description:
      "대전의 대표 빵집. 1956년부터 이어온 역사와 함께 튀김소보로, 부추빵으로 전국적으로 유명해요. 줄 서서 먹는 맛집의 정석 같은 곳이에요.",
    price: "1,000 - 5,000원",
    parking: "인근 유료",
    waiting: "주말 혼잡",
    hashtags: ["# 대전맛집", "# 베이커리", "# 줄서는맛집", "# 당일치기"],
    recommendedRouteLabel: "대전 당일치기 루트",
    recommendedRouteStops: "성심당 > 칼국수 > 한밭수목원",
    relatedPlaces: [
      {
        id: "theme-noodle-2",
        title: "칼국수거리",
        location: "대전 중구",
        emoji: "🍜",
        accent: "#ff8f70",
      },
      {
        id: "daejeon-garden-001",
        title: "한밭수목원",
        location: "대전 서구",
        emoji: "🏯",
        accent: "#72d7c4",
      },
      {
        id: "daejeon-bread-002",
        title: "성심당 본점",
        location: "대전 중구",
        emoji: "🥖",
        accent: "#c9c0ff",
      },
    ],
  },
  {
    id: "search-001",
    title: "부산 돼지국밥 골목",
    category: "맛집",
    emoji: "🍖",
    location: "부산 부산진구",
    likeCount: "1,128",
    visitTime: "당일치기",
    description:
      "로컬 분위기가 짙은 국밥 골목이에요. 아침 식사부터 해장 코스까지 부담 없이 들르기 좋고, 주변 시장 동선과도 잘 이어집니다.",
    price: "9,000 - 13,000원",
    parking: "시장 공영주차장",
    waiting: "점심 혼잡",
    hashtags: ["# 부산맛집", "# 국밥", "# 로컬", "# 당일치기"],
    recommendedRouteLabel: "부산 시장 먹방 루트",
    recommendedRouteStops: "돼지국밥 > 국제시장 > 감천문화마을",
    relatedPlaces: [
      {
        id: "theme-seafood-1",
        title: "수산시장 골목",
        location: "부산 중구",
        emoji: "🦞",
        accent: "#ffb28f",
      },
      {
        id: "theme-night-2",
        title: "더베이101",
        location: "부산 해운대",
        emoji: "🌃",
        accent: "#92dfd1",
      },
      {
        id: "theme-photo-1",
        title: "감천문화마을",
        location: "부산 사하구",
        emoji: "🎨",
        accent: "#c8c0ff",
      },
    ],
  },
  {
    id: "search-002",
    title: "광안리 해수욕장",
    category: "명소",
    emoji: "🌊",
    location: "부산 수영구",
    likeCount: "3,082",
    visitTime: "당일치기",
    description:
      "낮에는 탁 트인 바다, 밤에는 브리지 야경이 매력적인 대표 해변이에요. 산책과 카페 투어를 묶기 좋은 코스입니다.",
    price: "무료",
    parking: "인근 공영주차장",
    waiting: "해질녘 혼잡",
    hashtags: ["# 부산명소", "# 바다", "# 야경", "# 산책"],
    recommendedRouteLabel: "광안리 야경 루트",
    recommendedRouteStops: "광안리 > 민락수변공원 > 더베이101",
    relatedPlaces: [
      {
        id: "theme-night-2",
        title: "더베이101",
        location: "부산 해운대",
        emoji: "✨",
        accent: "#ff9f7c",
      },
      {
        id: "theme-cafe-1",
        title: "해운대 카페 4선",
        location: "부산 해운대",
        emoji: "☕",
        accent: "#72d7c4",
      },
      {
        id: "theme-route-2",
        title: "광안리 산책 루트",
        location: "부산 수영구",
        emoji: "🚶",
        accent: "#c9c0ff",
      },
    ],
  },
  {
    id: "search-003",
    title: "밀면 맛집 투어",
    category: "맛집",
    emoji: "🍜",
    location: "부산 동래구",
    likeCount: "884",
    visitTime: "당일치기",
    description:
      "여름철 특히 인기 많은 부산 밀면 라인을 따라가는 코스예요. 깔끔한 한 끼와 가벼운 동선이 장점입니다.",
    price: "8,000 - 11,000원",
    parking: "매장별 상이",
    waiting: "점심 대기",
    hashtags: ["# 부산맛집", "# 밀면", "# 점심코스", "# 당일치기"],
    recommendedRouteLabel: "부산 면 투어 루트",
    recommendedRouteStops: "밀면 > 전통시장 > 카페",
    relatedPlaces: [
      {
        id: "theme-noodle-1",
        title: "밀면 거리",
        location: "부산 중구",
        emoji: "🥢",
        accent: "#ff9f7c",
      },
      {
        id: "theme-soup-1",
        title: "돼지국밥 골목",
        location: "부산 서면",
        emoji: "🍲",
        accent: "#72d7c4",
      },
      {
        id: "theme-cafe-1",
        title: "해운대 카페 4선",
        location: "부산 해운대",
        emoji: "🍰",
        accent: "#c9c0ff",
      },
    ],
  },
  {
    id: "search-004",
    title: "해운대 당일 루트",
    category: "루트",
    emoji: "🏖",
    location: "부산 해운대구",
    likeCount: "1,562",
    visitTime: "당일치기",
    description:
      "바다, 산책, 카페를 반나절 안에 묶어 즐기기 좋은 대표 루트예요. 이동 난도가 낮아서 첫 부산 여행에도 잘 맞습니다.",
    price: "장소별 상이",
    parking: "구간별 공영주차장",
    waiting: "주말 보통",
    hashtags: ["# 부산루트", "# 해운대", "# 바다", "# 데이트"],
    recommendedRouteLabel: "해운대 반나절 루트",
    recommendedRouteStops: "블루라인파크 > 해변 산책 > 오션뷰 카페",
    relatedPlaces: [
      {
        id: "theme-cafe-1",
        title: "해운대 카페 4선",
        location: "부산 해운대",
        emoji: "☕",
        accent: "#ff9f7c",
      },
      {
        id: "theme-night-2",
        title: "더베이101",
        location: "부산 해운대",
        emoji: "🌃",
        accent: "#72d7c4",
      },
      {
        id: "search-002",
        title: "광안리 해수욕장",
        location: "부산 수영구",
        emoji: "🌊",
        accent: "#c9c0ff",
      },
    ],
  },
];

const detailMap = new Map(detailEntries.map((entry) => [entry.id, entry]));

const fallbackEntry: ContentDetailData = {
  id: "default-content",
  title: "성심당 튀김소보로",
  category: "맛집",
  emoji: "🥐",
  location: "대전 중구",
  likeCount: "2,341",
  visitTime: "당일치기",
  description:
    "대전의 대표 빵집. 1956년부터 이어온 역사와 함께 튀김소보로와 부추빵으로 전국적으로 유명해요.",
  price: "1,000 - 5,000원",
  parking: "인근 유료",
  waiting: "주말 혼잡",
  hashtags: ["# 대전맛집", "# 베이커리", "# 줄서는맛집", "# 당일치기"],
  recommendedRouteLabel: "대전 당일치기 루트",
  recommendedRouteStops: "성심당 > 칼국수 > 한밭수목원",
  relatedPlaces: [
    {
      id: "theme-noodle-2",
      title: "칼국수거리",
      location: "대전 중구",
      emoji: "🍜",
      accent: "#ff8f70",
    },
    {
      id: "daejeon-garden-001",
      title: "한밭수목원",
      location: "대전 서구",
      emoji: "🏯",
      accent: "#72d7c4",
    },
    {
      id: "daejeon-bread-002",
      title: "성심당 본점",
      location: "대전 중구",
      emoji: "🥖",
      accent: "#c9c0ff",
    },
  ],
};

const categoryTone: Record<ContentDetailData["category"], string> = {
  맛집: "bg-[#f2efff] text-[#6d58d8]",
  명소: "bg-[#edf7e9] text-[#5f8f4a]",
  루트: "bg-[#eaf3ff] text-[#3d78ce]",
};

function DetailMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[16px] bg-[#f6f1e8] px-3 py-3">
      <p className="text-[11px] font-semibold text-slate-400">{label}</p>
      <p className="mt-1 text-[12px] font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ContentDetailPhone({ detail }: { detail: ContentDetailData }) {
  const routeTarget =
    detail.category === "루트"
      ? buildPath.routeResult(detail.id)
      : buildPath.routeResult(`route-for-${detail.id}`);

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <div className="no-scrollbar flex-1 overflow-y-auto pr-1">
          <section className="overflow-hidden rounded-[28px] border border-[#d8d1c7] bg-white shadow-[0_16px_40px_rgba(91,72,40,0.08)]">
            <div className="relative flex h-48 items-start justify-between bg-[#ffb9a5] px-5 py-5">
              <button
                aria-label="뒤로가기"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[21px] text-slate-700 shadow-[0_8px_18px_rgba(64,54,40,0.08)]"
                type="button"
                onClick={() => {
                  if (window.history.length > 1) {
                    window.history.back();
                    return;
                  }

                  navigateTo(buildPath.home());
                }}
              >
                ←
              </button>

              <div className="flex gap-2">
                <button
                  aria-label="공유하기"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[20px] text-slate-700 shadow-[0_8px_18px_rgba(64,54,40,0.08)]"
                  type="button"
                >
                  ⌘
                </button>
                <button
                  aria-label="소장하기"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-[19px] text-[#ff6b8f] shadow-[0_8px_18px_rgba(64,54,40,0.08)]"
                  type="button"
                >
                  ♡
                </button>
              </div>

              <div className="absolute inset-x-0 top-[54px] flex justify-center text-[58px]">
                {detail.emoji}
              </div>
            </div>

            <div className="px-5 py-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[18px] font-semibold tracking-[-0.04em] text-slate-900">
                    {detail.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
                    <span>⌖ {detail.location}</span>
                    <span>♡ {detail.likeCount}</span>
                    <span>◔ {detail.visitTime}</span>
                  </div>
                </div>
                <span
                  className={[
                    "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold",
                    categoryTone[detail.category],
                  ].join(" ")}
                >
                  {detail.category}
                </span>
              </div>

              <p className="mt-4 text-[13px] leading-6 text-slate-600">{detail.description}</p>

              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <DetailMetric label="영업시간" value="08:00 - 22:00" />
                <DetailMetric label="가격대" value={detail.price} />
                <DetailMetric label="주차" value={detail.parking} />
                <DetailMetric label="혼잡도" value={detail.waiting} />
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-[28px] border border-[#d8d1c7] bg-white px-5 py-5 shadow-[0_16px_36px_rgba(91,72,40,0.06)]">
            <button
              className="flex h-[92px] w-full flex-col items-center justify-center rounded-[18px] border border-[#d8d1c7] bg-[#f4f1e8] text-slate-600"
              type="button"
            >
              <span className="text-[28px]">⌘</span>
              <span className="mt-1 text-[14px] font-semibold">지도 보기</span>
            </button>

            <div className="mt-4 flex flex-wrap gap-2">
              {detail.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#f2efff] px-3 py-1.5 text-[12px] font-semibold text-[#6d58d8]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-[#ede6dc] pt-4">
              <h3 className="text-[14px] font-semibold text-slate-900">이런 곳도 있어요</h3>
              <div className="no-scrollbar mt-3 overflow-x-auto pb-1">
                <div className="flex min-w-max gap-3">
                  {detail.relatedPlaces.map((place) => (
                    <RouteLink
                      key={place.id}
                      className="w-[112px] overflow-hidden rounded-[16px] border border-[#e5ddd2] bg-white"
                      href={buildPath.contentDetail(place.id)}
                    >
                      <div
                        className="flex h-[74px] items-center justify-center text-[28px]"
                        style={{ backgroundColor: place.accent }}
                      >
                        {place.emoji}
                      </div>
                      <div className="px-3 py-2">
                        <p className="truncate text-[13px] font-semibold text-slate-900">
                          {place.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">{place.location}</p>
                      </div>
                    </RouteLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#ede6dc] pt-4">
              <h3 className="text-[14px] font-semibold text-slate-900">같은 지역 루트</h3>
              <RouteLink
                className="mt-3 flex items-center gap-3 rounded-[18px] bg-[#f6f1e8] px-4 py-4"
                href={routeTarget}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[22px] text-[#5f51d5]">
                  ⌖
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-slate-900">
                    {detail.recommendedRouteLabel}
                  </p>
                  <p className="mt-1 truncate text-[12px] text-slate-500">
                    {detail.recommendedRouteStops}
                  </p>
                </div>
                <span className="text-[22px] text-slate-400">›</span>
              </RouteLink>
            </div>

            <div className="mt-5 grid grid-cols-[1fr_110px] gap-3">
              <RouteLink
                className="flex items-center justify-center rounded-[18px] border border-[#d5d0c7] bg-white px-4 py-4 text-[16px] font-semibold text-slate-900 shadow-[0_10px_20px_rgba(91,72,40,0.06)]"
                href={routeTarget}
              >
                AI 루트 만들기
              </RouteLink>
              <RouteLink
                className="flex items-center justify-center rounded-[18px] border border-[#d5d0c7] bg-white px-4 py-4 text-[15px] font-semibold text-slate-900 shadow-[0_10px_20px_rgba(91,72,40,0.06)]"
                href={buildPath.collection()}
              >
                ♡ 소장
              </RouteLink>
            </div>
          </section>
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ContentDetailPage({ contentId }: ContentDetailPageProps) {
  const detail = detailMap.get(contentId) ?? fallbackEntry;

  return (
    <ShowcaseLayout phone={<ContentDetailPhone detail={detail} />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          DETAIL
        </span>
        상세 + 추천 + CTA
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        결과를 눌렀을 때
        <br />
        바로 설득되는 상세 화면.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        룰렛 결과나 탐색 리스트에서 진입한 뒤, 기본 정보 확인부터 지도, 비슷한 장소,
        같은 지역 루트, AI 루트 만들기와 소장까지 한 흐름으로 이어지게 구성했습니다.
      </p>
    </ShowcaseLayout>
  );
}
