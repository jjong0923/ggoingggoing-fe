import { useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { SearchIcon } from "../../shared/ui/AppIcons";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";

type CollectionTab = "folder" | "route";

type SavedCard = {
  accent: string;
  category: string;
  emoji: string;
  id: string;
  location: string;
  title: string;
};

type FolderItem = {
  count: number;
  id: string;
  preview: string[];
  title: string;
};

const folders: FolderItem[] = [
  {
    id: "folder-food",
    title: "먹고 싶은 거",
    count: 8,
    preview: ["🥐", "🍜", "🌮", "☕"],
  },
  {
    id: "folder-place",
    title: "가고 싶은 곳",
    count: 6,
    preview: ["🖼", "🌊", "🏯", "🌲"],
  },
  {
    id: "folder-route",
    title: "여름 여행 루트",
    count: 4,
    preview: ["🗺", "📍", "🛵", "🏖"],
  },
];

const savedCardsByFolder: Record<string, SavedCard[]> = {
  "folder-food": [
    {
      id: "roulette-daejeon-001",
      title: "성심당 튀김소보로",
      location: "대전 중구",
      category: "맛집",
      emoji: "🥐",
      accent: "#ffb8a4",
    },
    {
      id: "theme-noodle-2",
      title: "속초 물회",
      location: "강원 속초",
      category: "맛집",
      emoji: "🍲",
      accent: "#ff8f70",
    },
    {
      id: "content-002",
      title: "대구 뭉티기",
      location: "대구 중구",
      category: "맛집",
      emoji: "🥩",
      accent: "#ffc766",
    },
    {
      id: "search-001",
      title: "부산 돼지국밥",
      location: "부산 서면",
      category: "맛집",
      emoji: "🍚",
      accent: "#cbc2ff",
    },
  ],
  "folder-place": [
    {
      id: "search-002",
      title: "광안리 해수욕장",
      location: "부산 수영구",
      category: "명소",
      emoji: "🌊",
      accent: "#72d7c4",
    },
    {
      id: "content-003",
      title: "속초 영금정 일출",
      location: "강원 속초",
      category: "명소",
      emoji: "🌅",
      accent: "#c9c0ff",
    },
    {
      id: "content-004",
      title: "전주 한옥마을",
      location: "전북 전주",
      category: "명소",
      emoji: "🏯",
      accent: "#9fd3f6",
    },
  ],
  "folder-route": [
    {
      id: "search-004",
      title: "해운대 당일 루트",
      location: "부산 해운대",
      category: "루트",
      emoji: "🗺",
      accent: "#9fd3f6",
    },
    {
      id: "theme-route-2",
      title: "광안리 산책 루트",
      location: "부산 수영구",
      category: "루트",
      emoji: "🚶",
      accent: "#ffc766",
    },
  ],
};

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: false },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: true },
];

const sortChips = ["최근 저장순", "지역순", "테마순"];

function CollectionPhone() {
  const [tab, setTab] = useState<CollectionTab>("folder");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState(sortChips[0]);

  const selectedFolder = useMemo(
    () =>
      folders.find((folder) => folder.id === selectedFolderId) ?? folders[0],
    [selectedFolderId],
  );

  const savedCards = savedCardsByFolder[selectedFolder.id] ?? [];

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
        <header className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold tracking-[-0.04em] text-slate-900">
            소장함
          </h2>
          <div className="flex items-center gap-2">
            <button
              aria-label="검색"
              className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 transition hover:bg-[#f8f4ee]"
              type="button"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>
            <button
              aria-label="더보기"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[22px] text-slate-700 transition hover:bg-[#f8f4ee]"
              type="button"
            >
              ⋮
            </button>
          </div>
        </header>

        <div className="mt-4 flex items-center gap-5 border-b border-[#efe7dc] px-1 pb-3">
          {[
            { key: "folder" as const, label: "폴더" },
            { key: "route" as const, label: "루트" },
          ].map((item) => (
            <button
              key={item.key}
              className={[
                "relative pb-1 text-[14px] font-semibold transition",
                tab === item.key ? "text-[#5f51d5]" : "text-slate-400",
              ].join(" ")}
              type="button"
              onClick={() => {
                setTab(item.key);
                if (item.key === "folder") {
                  setSelectedFolderId(null);
                }
              }}
            >
              {item.label}
              {tab === item.key ? (
                <span className="absolute inset-x-0 -bottom-3 h-0.5 rounded-full bg-[#5f51d5]" />
              ) : null}
            </button>
          ))}
        </div>

        {tab === "folder" && selectedFolderId === null ? (
          <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
            <p className="text-[13px] font-medium text-slate-500">
              총 18개 소장
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className="rounded-[20px] border border-[#e9e1d7] bg-white p-3 text-left shadow-[0_10px_24px_rgba(99,75,43,0.06)]"
                  type="button"
                  onClick={() => setSelectedFolderId(folder.id)}
                >
                  <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-[16px]">
                    {folder.preview.map((item, index) => (
                      <div
                        key={`${folder.id}-${index}`}
                        className={[
                          "flex h-14 items-center justify-center text-xl",
                          index % 3 === 0
                            ? "bg-[#ffcfbf]"
                            : index % 3 === 1
                              ? "bg-[#ffe8b5]"
                              : "bg-[#ccebe5]",
                        ].join(" ")}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[14px] font-semibold text-slate-900">
                    {folder.title}
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    {folder.count}개
                  </p>
                </button>
              ))}

              <button
                className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d8d1c7] bg-[#fffdf9] p-3 text-slate-500"
                type="button"
              >
                <span className="text-[28px] leading-none">⊕</span>
                <span className="mt-2 text-[14px] font-semibold">새 폴더</span>
              </button>
            </div>
          </div>
        ) : null}

        {tab === "folder" && selectedFolderId !== null ? (
          <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[20px] text-slate-700 transition hover:bg-[#f8f4ee]"
                type="button"
                onClick={() => setSelectedFolderId(null)}
              >
                ←
              </button>
              <h3 className="text-[18px] font-semibold text-slate-900">
                {selectedFolder.title}
              </h3>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-[18px] text-slate-700 transition hover:bg-[#f8f4ee]"
                type="button"
              >
                ✎
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {sortChips.map((chip) => (
                <button
                  key={chip}
                  className={[
                    "rounded-full border px-3 py-1.5 text-[12px] font-medium transition",
                    selectedSort === chip
                      ? "border-[#d8d0ff] bg-[#f1eeff] text-[#5f51d5]"
                      : "border-[#e5ddd2] bg-white text-slate-500",
                  ].join(" ")}
                  type="button"
                  onClick={() => setSelectedSort(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {savedCards.map((card) => (
                <RouteLink
                  key={card.id}
                  className="overflow-hidden rounded-[20px] border border-[#e9e1d7] bg-white shadow-[0_10px_24px_rgba(99,75,43,0.06)]"
                  href={buildPath.contentDetail(card.id)}
                >
                  <div
                    className="relative flex h-24 items-start justify-between px-3 py-3"
                    style={{ backgroundColor: card.accent }}
                  >
                    <span className="text-[12px] font-semibold text-white/80">
                      {card.emoji}
                    </span>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[14px] text-[#ff7da6]">
                      ♡
                    </span>
                  </div>
                  <div className="px-3 py-3">
                    <h4 className="text-[14px] leading-5 font-semibold text-slate-900">
                      {card.title}
                    </h4>
                    <p className="mt-1 text-[12px] text-slate-500">
                      {card.location}
                    </p>
                    <span className="mt-3 inline-flex rounded-full bg-[#f1eeff] px-2.5 py-1 text-[10px] font-semibold text-[#6d58d8]">
                      {card.category}
                    </span>
                  </div>
                </RouteLink>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "route" ? (
          <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
            <div className="rounded-[24px] border border-[#e9e1d7] bg-white px-5 py-8 text-center shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f1e8] text-[30px] text-slate-500">
                🗺
              </div>
              <h3 className="mt-4 text-[22px] font-semibold tracking-[-0.04em] text-slate-900">
                저장된 루트가 없어요
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                AI 루트를 만들고
                <br />
                여기에 저장해보세요
              </p>
              <RouteLink
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[#5f51d5] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(95,81,213,0.24)]"
                href={buildPath.routeResult("saved-route-002")}
              >
                <p className="text-white">루트 만들러 가기</p>
              </RouteLink>
            </div>

            <div className="mt-5 border-t border-[#efe7dc] pt-4">
              <p className="text-[13px] font-semibold text-slate-500">
                이런 루트 어때요?
              </p>
              <RouteLink
                className="mt-3 flex items-center gap-3 rounded-[18px] bg-[#f7f1e8] px-4 py-4"
                href={buildPath.routeResult("saved-route-002")}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[20px] text-[#5f51d5]">
                  ⌖
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-semibold text-slate-900">
                    부산 당일치기 루트
                  </p>
                  <p className="mt-1 text-[12px] text-slate-500">
                    광안리 &gt; 돼지국밥 &gt; 감천문화마을
                  </p>
                </div>
                <span className="text-[22px] text-slate-400">›</span>
              </RouteLink>
            </div>
          </div>
        ) : null}

        <nav className="mt-3 border-t border-[#f1ebe2] pt-2">
          <ul className="grid grid-cols-4 gap-1">
            {tabItems.map((tabItem) => (
              <li key={tabItem.label}>
                <RouteLink
                  className="flex flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition hover:bg-[#faf7f2]"
                  href={tabItem.href}
                >
                  <span
                    className={[
                      "text-[18px] leading-none",
                      tabItem.active ? "text-[#5f51d5]" : "text-slate-500",
                    ].join(" ")}
                  >
                    {tabItem.icon}
                  </span>
                  <span
                    className={[
                      "text-[11px] leading-none font-semibold",
                      tabItem.active ? "text-[#5f51d5]" : "text-slate-500",
                    ].join(" ")}
                  >
                    {tabItem.label}
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

export function CollectionPage() {
  return (
    <ShowcaseLayout phone={<CollectionPhone />}>
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm text-slate-700 backdrop-blur">
        <span className="rounded-full bg-[#fff1d7] px-2 py-1 text-xs font-semibold text-[#c97c2e]">
          COLLECTION
        </span>
        폴더 / 루트 보관함
      </div>

      <h1 className="mt-8 max-w-2xl text-4xl font-semibold tracking-[-0.06em] text-slate-900 md:text-6xl">
        저장한 여행 취향을
        <br />
        폴더와 루트로 정리하게.
      </h1>

      <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
        폴더 탭에서는 저장한 장소를 묶어서 보고, 루트 탭에서는 비어 있는 상태와
        추천 루트 CTA까지 자연스럽게 이어지도록 구성했습니다.
      </p>
    </ShowcaseLayout>
  );
}
