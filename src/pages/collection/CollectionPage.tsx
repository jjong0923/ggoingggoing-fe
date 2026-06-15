import { useEffect, useMemo, useState } from "react";
import { buildPath } from "../../app/router/routePaths";
import { logout } from "../../shared/apis/auth";
import { getBookmarks } from "../../shared/apis/bookmarks";
import type { BookmarkSummary, ContentType } from "../../shared/apis/types";
import { SearchIcon } from "../../shared/ui/AppIcons";
import { PhoneFrame } from "../../shared/ui/PhoneFrame";
import { RouteLink } from "../../shared/ui/RouteLink";
import { ShowcaseLayout } from "../../shared/ui/ShowcaseLayout";
import {
  createBookmarkFolder,
  deleteBookmarkFolder,
  useBookmarkFolders,
} from "../../shared/lib/bookmarkFolders";
import {
  createCustomRoute,
  deleteCustomRoute,
  useCustomRoutes,
} from "../../shared/lib/customRoutes";
import {
  clearAuthSession,
  getRefreshToken,
  useAuthUser,
} from "../../shared/lib/authSession";
import { navigateTo } from "../../shared/lib/router";

type CollectionTab = "folder" | "route";

type SavedCard = {
  accent: string;
  bookmarkId?: number;
  category: string;
  emoji: string;
  id: string;
  location: string;
  summary?: string;
  title: string;
};

type FolderItem = {
  count: number;
  id: string;
  preview: string[];
  title: string;
};

type RouteCandidateBookmark = BookmarkSummary & {
  folderNames: string[];
};

const tabItems = [
  { icon: "⌂", label: "홈", href: buildPath.home(), active: false },
  { icon: "⌕", label: "탐색", href: buildPath.theme(), active: false },
  { icon: "◫", label: "룰렛", href: buildPath.roulette(), active: false },
  { icon: "♡", label: "소장", href: buildPath.collection(), active: true },
];

const sortChips = ["최근 저장순", "지역순", "테마순"];

function getSavedCardMeta(contentType: ContentType) {
  if (contentType === "RESTAURANT" || contentType === "CAFE") {
    return { accent: "#ffb8a4", category: "맛집", emoji: "🥐" };
  }

  if (contentType === "ATTRACTION") {
    return { accent: "#72d7c4", category: "명소", emoji: "🌊" };
  }

  return { accent: "#9fd3f6", category: "루트", emoji: "🗺" };
}

function mapBookmarkToSavedCard(bookmark: BookmarkSummary): SavedCard {
  const meta = getSavedCardMeta(bookmark.contentType);

  return {
    id: String(bookmark.contentId),
    bookmarkId: bookmark.bookmarkId,
    title: bookmark.contentTitle,
    location: `${bookmark.regionName} · ${bookmark.themeName}`,
    summary: bookmark.contentSummary,
    ...meta,
  };
}

function buildFolders(
  bookmarks: BookmarkSummary[],
  foldersFromStorage: ReturnType<typeof useBookmarkFolders>,
): FolderItem[] {
  return foldersFromStorage
    .map((folder) => {
      const relatedBookmarks = folder.bookmarkIds
        .map((bookmarkId) =>
          bookmarks.find((bookmark) => bookmark.bookmarkId === bookmarkId),
        )
        .filter((bookmark): bookmark is BookmarkSummary => Boolean(bookmark));

      return {
        id: folder.id,
        title: folder.name,
        count: relatedBookmarks.length,
        preview: relatedBookmarks
          .slice(0, 4)
          .map((bookmark) => getSavedCardMeta(bookmark.contentType).emoji),
      };
    })
    .filter((folder) => folder.count > 0);
}

function buildSavedCardsByFolder(
  bookmarks: BookmarkSummary[],
  foldersFromStorage: ReturnType<typeof useBookmarkFolders>,
): Record<string, SavedCard[]> {
  return foldersFromStorage.reduce<Record<string, SavedCard[]>>((accumulator, folder) => {
    accumulator[folder.id] = folder.bookmarkIds
      .map((bookmarkId) =>
        bookmarks.find((bookmark) => bookmark.bookmarkId === bookmarkId),
      )
      .filter((bookmark): bookmark is BookmarkSummary => Boolean(bookmark))
      .map(mapBookmarkToSavedCard);

    return accumulator;
  }, {});
}

function buildRouteCandidateBookmarks(
  bookmarks: BookmarkSummary[],
  foldersFromStorage: ReturnType<typeof useBookmarkFolders>,
) {
  const folderNameByBookmarkId = foldersFromStorage.reduce<Record<number, string[]>>(
    (accumulator, folder) => {
      folder.bookmarkIds.forEach((bookmarkId) => {
        accumulator[bookmarkId] = [...(accumulator[bookmarkId] ?? []), folder.name];
      });

      return accumulator;
    },
    {},
  );

  return bookmarks
    .filter((bookmark) => (folderNameByBookmarkId[bookmark.bookmarkId] ?? []).length > 0)
    .map((bookmark) => ({
      ...bookmark,
      folderNames: folderNameByBookmarkId[bookmark.bookmarkId] ?? [],
    })) satisfies RouteCandidateBookmark[];
}

function CollectionPhone() {
  const [tab, setTab] = useState<CollectionTab>(() =>
    typeof window !== "undefined" && window.location.hash === "#route"
      ? "route"
      : "folder",
  );
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedSort, setSelectedSort] = useState(sortChips[0]);
  const authUser = useAuthUser();
  const bookmarkFolders = useBookmarkFolders();
  const [bookmarks, setBookmarks] = useState<BookmarkSummary[]>([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [isDeleteFolderModalOpen, setIsDeleteFolderModalOpen] = useState(false);
  const [selectedRouteBookmarkIds, setSelectedRouteBookmarkIds] = useState<number[]>([]);
  const [routeName, setRouteName] = useState("");
  const [routeToDeleteId, setRouteToDeleteId] = useState<number | null>(null);
  const customRoutes = useCustomRoutes();

  useEffect(() => {
    if (!authUser) {
      setBookmarks([]);
      setBookmarkError(null);
      setIsLoadingBookmarks(false);
      return;
    }

    let isMounted = true;

    const loadBookmarks = async () => {
      setIsLoadingBookmarks(true);
      setBookmarkError(null);

      try {
        const nextBookmarks = await getBookmarks();

        if (!isMounted) {
          return;
        }

        setBookmarks(nextBookmarks);
      } catch (error) {
        console.error("Failed to load bookmarks", error);
        if (isMounted) {
          setBookmarks([]);
          setBookmarkError("찜 목록을 불러오지 못했어요.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookmarks(false);
        }
      }
    };

    void loadBookmarks();

    return () => {
      isMounted = false;
    };
  }, [authUser]);

  const folders = useMemo(
    () => buildFolders(bookmarks, bookmarkFolders),
    [bookmarkFolders, bookmarks],
  );
  const savedCardsByFolder = useMemo(
    () => buildSavedCardsByFolder(bookmarks, bookmarkFolders),
    [bookmarkFolders, bookmarks],
  );
  const selectedFolder = useMemo(
    () =>
      folders.find((folder) => folder.id === selectedFolderId) ?? folders[0],
    [folders, selectedFolderId],
  );
  const selectedRouteToDelete =
    customRoutes.find((route) => route.routeId === routeToDeleteId) ?? null;
  const routeCandidateBookmarks = useMemo(
    () => buildRouteCandidateBookmarks(bookmarks, bookmarkFolders),
    [bookmarkFolders, bookmarks],
  );

  const savedCards = selectedFolder
    ? (savedCardsByFolder[selectedFolder.id] ?? [])
    : [];
  const folderPreviewPlaceholders = ["", "", "", ""];

  useEffect(() => {
    const syncTabWithHash = () => {
      if (window.location.hash === "#route") {
        setTab("route");
        setSelectedFolderId(null);
      }
    };

    syncTabWithHash();
    window.addEventListener("popstate", syncTabWithHash);

    return () => window.removeEventListener("popstate", syncTabWithHash);
  }, []);

  const toggleRouteBookmark = (bookmarkId: number) => {
    setSelectedRouteBookmarkIds((current) => {
      if (current.includes(bookmarkId)) {
        return current.filter((id) => id !== bookmarkId);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, bookmarkId];
    });
  };

  const handleCreateRoute = () => {
    const selectedBookmarks = routeCandidateBookmarks.filter((bookmark) =>
      selectedRouteBookmarkIds.includes(bookmark.bookmarkId),
    );
    const nextRoute = createCustomRoute(routeName || "새 루트", selectedBookmarks);

    if (!nextRoute) {
      return;
    }

    setRouteName("");
    setSelectedRouteBookmarkIds([]);
    navigateTo(buildPath.routeResult(String(nextRoute.routeId)));
  };

  return (
    <PhoneFrame className="max-h-[850px] max-w-[430px]">
      <div className="relative flex h-[min(80vh,770px)] min-h-[650px] flex-col overflow-hidden">
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
              총 {bookmarks.length}개 소장
            </p>

            {bookmarkError ? (
              <div className="mt-4 rounded-[20px] bg-[#fff1ee] px-4 py-4 text-[13px] text-[#b3543d]">
                {bookmarkError}
              </div>
            ) : null}

            {isLoadingBookmarks ? (
              <div className="mt-4 rounded-[20px] bg-white px-4 py-10 text-center text-[14px] text-slate-500 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
                찜 목록을 불러오는 중이에요.
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="mt-4 rounded-[20px] bg-white px-4 py-10 text-center text-[14px] text-slate-500 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
                저장된 찜이 아직 없어요.
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {folders.map((folder) => (
                  <button
                    key={folder.id}
                    className="rounded-[20px] border border-[#e9e1d7] bg-white p-3 text-left shadow-[0_10px_24px_rgba(99,75,43,0.06)]"
                    type="button"
                    onClick={() => setSelectedFolderId(folder.id)}
                  >
                    <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-[16px]">
                      {folderPreviewPlaceholders.map((_, index) => {
                        const item = folder.preview[index] ?? "";

                        return (
                          <div
                            key={`${folder.id}-${index}`}
                            className={[
                              "flex h-14 items-center justify-center text-xl",
                              !item ? "text-transparent" : "",
                              index % 3 === 0
                                ? "bg-[#ffcfbf]"
                                : index % 3 === 1
                                  ? "bg-[#ffe8b5]"
                                  : "bg-[#ccebe5]",
                            ].join(" ")}
                          >
                            {item}
                          </div>
                        );
                      })}
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
                  onClick={() => setIsCreateFolderModalOpen(true)}
                >
                  <span className="text-[34px] leading-none text-slate-400">⧉+</span>
                  <span className="mt-2 text-[14px] font-semibold">새 폴더</span>
                </button>
              </div>
            )}
          </div>
        ) : null}

        {tab === "folder" && selectedFolderId !== null && selectedFolder ? (
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
                onClick={() => setIsDeleteFolderModalOpen(true)}
              >
                🗑
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
                    {card.summary ? (
                      <p className="mt-2 line-clamp-2 text-[11px] leading-5 text-slate-500">
                        {card.summary}
                      </p>
                    ) : null}
                    <span className="mt-3 inline-flex rounded-full bg-[#f1eeff] px-2.5 py-1 text-[10px] font-semibold text-[#6d58d8]">
                      {card.category}
                    </span>
                  </div>
                </RouteLink>
              ))}
            </div>

            {savedCards.length === 0 ? (
              <div className="mt-4 rounded-[20px] bg-white px-4 py-10 text-center text-[14px] text-slate-500 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
                이 폴더에는 아직 찜한 항목이 없어요.
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === "route" ? (
          <div className="no-scrollbar mt-4 flex-1 overflow-y-auto pr-1">
            <div className="rounded-[24px] border border-[#e9e1d7] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Route Builder
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-slate-900">
                소장한 장소로 새 루트 만들기
              </h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">
                폴더가 달라도 괜찮아요. 소장한 찜 전체에서 최대 3개까지 골라 루트 이름만 정하면 바로 결과를 볼 수 있어요.
              </p>

              <div className="mt-4">
                <p className="text-[12px] font-semibold text-slate-500">
                  장소 선택 ({selectedRouteBookmarkIds.length}/3)
                </p>
                <div className="mt-3 space-y-2">
                  {routeCandidateBookmarks.map((bookmark) => {
                    const checked = selectedRouteBookmarkIds.includes(bookmark.bookmarkId);

                    return (
                      <button
                        key={bookmark.bookmarkId}
                        className={[
                          "flex w-full items-start gap-3 rounded-[18px] border px-4 py-3 text-left transition",
                          checked
                            ? "border-[#d8d0ff] bg-[#f8f5ff]"
                            : "border-[#e9e1d7] bg-white",
                        ].join(" ")}
                        type="button"
                        onClick={() => toggleRouteBookmark(bookmark.bookmarkId)}
                      >
                        <span
                          className={[
                            "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[11px]",
                            checked
                              ? "border-[#5f51d5] bg-[#5f51d5] text-white"
                              : "border-[#d7cfc4] text-transparent",
                          ].join(" ")}
                        >
                          ✓
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[14px] font-semibold text-slate-900">
                            {bookmark.contentTitle}
                          </p>
                          <p className="mt-1 text-[12px] text-slate-500">
                            {bookmark.regionName} · {bookmark.themeName}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {bookmark.folderNames.map((folderName) => (
                              <span
                                key={`${bookmark.bookmarkId}-${folderName}`}
                                className="rounded-full bg-[#f7f1e8] px-2 py-1 text-[10px] font-medium text-slate-500"
                              >
                                {folderName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  {routeCandidateBookmarks.length === 0 ? (
                    <div className="rounded-[18px] bg-[#fbf7f1] px-4 py-5 text-center text-[13px] text-slate-500">
                      루트로 묶을 찜 항목이 아직 없어요.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[12px] font-semibold text-slate-500">루트 이름</p>
                <input
                  className="mt-3 w-full rounded-[18px] border border-[#e8dfd3] bg-white px-4 py-3 text-[14px] text-slate-900 outline-none"
                  placeholder="예: 주말 대전 먹방 루트"
                  value={routeName}
                  onChange={(event) => setRouteName(event.target.value)}
                />
              </div>

              <button
                className={[
                  "mt-5 w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(95,81,213,0.24)]",
                  selectedRouteBookmarkIds.length > 0
                    ? "bg-[#5f51d5]"
                    : "cursor-not-allowed bg-slate-300 shadow-none",
                ].join(" ")}
                disabled={selectedRouteBookmarkIds.length === 0}
                type="button"
                onClick={handleCreateRoute}
              >
                선택한 장소로 루트 만들기
              </button>
            </div>

            <div className="mt-4 rounded-[24px] border border-[#e9e1d7] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(99,75,43,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
                    My Routes
                  </p>
                  <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.04em] text-slate-900">
                    내가 만든 루트
                  </h3>
                </div>
                <span className="rounded-full bg-[#f6f0e7] px-3 py-1 text-[12px] font-semibold text-slate-600">
                  {customRoutes.length}개
                </span>
              </div>

              {customRoutes.length === 0 ? (
                <div className="mt-4 rounded-[18px] bg-[#fbf7f1] px-4 py-8 text-center text-[13px] text-slate-500">
                  아직 만든 루트가 없어요. 위에서 소장한 장소를 골라 첫 루트를 만들어보세요.
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  {customRoutes.map((route) => (
                    <div
                      key={route.routeId}
                      className="rounded-[20px] border border-[#ebe2d7] bg-[#fffdfa] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          className="min-w-0 flex-1 text-left"
                          type="button"
                          onClick={() =>
                            navigateTo(buildPath.routeResult(String(route.routeId)))
                          }
                        >
                          <p className="text-[15px] font-semibold text-slate-900">
                            {route.title}
                          </p>
                          <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-slate-500">
                            {route.summary}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {route.places.slice(0, 3).map((place) => (
                              <span
                                key={place.routePlaceId}
                                className="rounded-full bg-[#f1eeff] px-2.5 py-1 text-[11px] font-medium text-[#5f51d5]"
                              >
                                {place.name}
                              </span>
                            ))}
                          </div>
                        </button>

                        <button
                          className="shrink-0 rounded-full bg-[#fff1f1] px-3 py-2 text-[12px] font-semibold text-[#d95f5f]"
                          type="button"
                          onClick={() => setRouteToDeleteId(route.routeId)}
                        >
                          삭제
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span>{route.places.length}곳</span>
                        <span>{Math.round(route.totalDurationMinutes / 60)}시간 코스</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

        {isCreateFolderModalOpen ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(33,26,20,0.16)] px-5 py-8 backdrop-blur-[2px]">
            <div className="w-full max-w-[280px] rounded-[26px] border border-white/80 bg-white px-5 py-5 shadow-[0_22px_40px_rgba(50,40,30,0.18)]">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8da1c4] uppercase">
                Create Folder
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-slate-900">
                새 폴더 만들기
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                폴더 이름만 정하면 바로 소장함에 추가돼요.
              </p>

              <input
                className="mt-4 w-full rounded-[18px] border border-[#e8dfd3] bg-white px-4 py-3 text-[14px] text-slate-900 outline-none"
                placeholder="새 폴더 이름"
                value={newFolderName}
                onChange={(event) => setNewFolderName(event.target.value)}
              />

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  className="rounded-[16px] border border-[#d9d0c5] px-4 py-3 text-[14px] font-semibold text-slate-700"
                  type="button"
                  onClick={() => {
                    setIsCreateFolderModalOpen(false);
                    setNewFolderName("");
                  }}
                >
                  취소
                </button>
                <button
                  className="rounded-[16px] bg-[#5f51d5] px-4 py-3 text-[14px] font-semibold text-white"
                  type="button"
                  onClick={() => {
                    const nextFolder = createBookmarkFolder(newFolderName || "새 폴더");
                    if (nextFolder) {
                      setIsCreateFolderModalOpen(false);
                      setNewFolderName("");
                    }
                  }}
                >
                  만들기
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {isDeleteFolderModalOpen && selectedFolder ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(33,26,20,0.16)] px-5 py-8 backdrop-blur-[2px]">
            <div className="w-full max-w-[280px] rounded-[26px] border border-white/80 bg-white px-5 py-5 shadow-[0_22px_40px_rgba(50,40,30,0.18)]">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8da1c4] uppercase">
                Delete Folder
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-slate-900">
                폴더를 삭제할까요?
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                {selectedFolder.title} 폴더가 목록에서 사라져요. 찜 자체는 삭제되지 않아요.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  className="rounded-[16px] border border-[#d9d0c5] px-4 py-3 text-[14px] font-semibold text-slate-700"
                  type="button"
                  onClick={() => setIsDeleteFolderModalOpen(false)}
                >
                  취소
                </button>
                <button
                  className="rounded-[16px] bg-[#d95f5f] px-4 py-3 text-[14px] font-semibold text-white"
                  type="button"
                  onClick={() => {
                    const deleted = deleteBookmarkFolder(selectedFolder.id);

                    if (deleted) {
                      setSelectedFolderId(null);
                    }

                    setIsDeleteFolderModalOpen(false);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {selectedRouteToDelete ? (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-[rgba(33,26,20,0.16)] px-5 py-8 backdrop-blur-[2px]">
            <div className="w-full max-w-[280px] rounded-[26px] border border-white/80 bg-white px-5 py-5 shadow-[0_22px_40px_rgba(50,40,30,0.18)]">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8da1c4] uppercase">
                Delete Route
              </p>
              <h3 className="mt-2 text-[20px] font-semibold tracking-[-0.04em] text-slate-900">
                루트를 삭제할까요?
              </h3>
              <p className="mt-2 text-[13px] leading-5 text-slate-500">
                {selectedRouteToDelete.title} 루트가 목록에서 사라져요.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  className="rounded-[16px] border border-[#d9d0c5] px-4 py-3 text-[14px] font-semibold text-slate-700"
                  type="button"
                  onClick={() => setRouteToDeleteId(null)}
                >
                  취소
                </button>
                <button
                  className="rounded-[16px] bg-[#d95f5f] px-4 py-3 text-[14px] font-semibold text-white"
                  type="button"
                  onClick={() => {
                    deleteCustomRoute(selectedRouteToDelete.routeId);
                    setRouteToDeleteId(null);
                  }}
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </PhoneFrame>
  );
}

export function CollectionPage() {
  const authUser = useAuthUser();

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
