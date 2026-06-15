import { useSyncExternalStore } from "react";

export type BookmarkFolder = {
  bookmarkIds: number[];
  id: string;
  name: string;
};

const STORAGE_KEY = "ggoingggoing.bookmark-folders";
const FOLDER_EVENT = "ggoingggoing:bookmark-folders-change";
const DEFAULT_FOLDERS: BookmarkFolder[] = [
  { id: "default-folder", name: "기본 폴더", bookmarkIds: [] },
];

let cachedRawFolders: string | null | undefined;
let cachedFolders: BookmarkFolder[] = DEFAULT_FOLDERS;

function normalizeFolders(value: unknown): BookmarkFolder[] {
  if (!Array.isArray(value)) {
    return DEFAULT_FOLDERS;
  }

  const folders = value
    .map((item) => {
      if (
        !item ||
        typeof item !== "object" ||
        typeof (item as BookmarkFolder).id !== "string" ||
        typeof (item as BookmarkFolder).name !== "string" ||
        !Array.isArray((item as BookmarkFolder).bookmarkIds)
      ) {
        return null;
      }

      return {
        id: (item as BookmarkFolder).id,
        name: (item as BookmarkFolder).name,
        bookmarkIds: (item as BookmarkFolder).bookmarkIds.filter(
          (bookmarkId): bookmarkId is number => typeof bookmarkId === "number",
        ),
      };
    })
    .filter((folder): folder is BookmarkFolder => folder !== null);

  return folders.length > 0 ? folders : DEFAULT_FOLDERS;
}

function readFolders(): BookmarkFolder[] {
  if (typeof window === "undefined") {
    return DEFAULT_FOLDERS;
  }

  const rawFolders = window.localStorage.getItem(STORAGE_KEY);

  if (cachedRawFolders === rawFolders) {
    return cachedFolders;
  }

  if (!rawFolders) {
    cachedRawFolders = rawFolders;
    cachedFolders = DEFAULT_FOLDERS;
    return cachedFolders;
  }

  try {
    cachedRawFolders = rawFolders;
    cachedFolders = normalizeFolders(JSON.parse(rawFolders));
    return cachedFolders;
  } catch {
    cachedRawFolders = rawFolders;
    cachedFolders = DEFAULT_FOLDERS;
    return cachedFolders;
  }
}

function writeFolders(nextFolders: BookmarkFolder[]) {
  if (typeof window === "undefined") {
    return;
  }

  const normalizedFolders = normalizeFolders(nextFolders);
  const serializedFolders = JSON.stringify(normalizedFolders);

  cachedRawFolders = serializedFolders;
  cachedFolders = normalizedFolders;
  window.localStorage.setItem(STORAGE_KEY, serializedFolders);
  window.dispatchEvent(new Event(FOLDER_EVENT));
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(FOLDER_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(FOLDER_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useBookmarkFolders() {
  return useSyncExternalStore(subscribe, readFolders, () => DEFAULT_FOLDERS);
}

export function getBookmarkFolders() {
  return readFolders();
}

export function createBookmarkFolder(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return null;
  }

  const currentFolders = readFolders();
  const nextFolder: BookmarkFolder = {
    id: `folder-${Date.now()}`,
    name: trimmedName,
    bookmarkIds: [],
  };

  writeFolders([...currentFolders, nextFolder]);

  return nextFolder;
}

export function deleteBookmarkFolder(folderId: string) {
  if (folderId === "default-folder") {
    return false;
  }

  const nextFolders = readFolders().filter((folder) => folder.id !== folderId);
  writeFolders(nextFolders.length > 0 ? nextFolders : DEFAULT_FOLDERS);

  return true;
}

export function addBookmarkToFolder(folderId: string, bookmarkId: number) {
  writeFolders(
    readFolders().map((folder) =>
      folder.id !== folderId
        ? folder
        : {
            ...folder,
            bookmarkIds: folder.bookmarkIds.includes(bookmarkId)
              ? folder.bookmarkIds
              : [...folder.bookmarkIds, bookmarkId],
          },
    ),
  );
}

export function removeBookmarkFromAllFolders(bookmarkId: number) {
  writeFolders(
    readFolders().map((folder) => ({
      ...folder,
      bookmarkIds: folder.bookmarkIds.filter((id) => id !== bookmarkId),
    })),
  );
}
