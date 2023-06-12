import type { BaseBookmark, NewBookMark } from "../types";

export const getAllBookmarks = async (): Promise<BaseBookmark[]> => {
  let bookmarks: BaseBookmark[] = [];
  await chrome.storage.sync.get(
    "bookmarks",
    (items: { [key: string]: BaseBookmark[] }) => {
      bookmarks = items["bookmarks"];
    }
  );
  return bookmarks;
};

export const newBookmarks = async (data: NewBookMark): Promise<void> => {
  let bookmarks = await getAllBookmarks();
  const bookmark: BaseBookmark = {
    ...data,
    id: Math.max(...bookmarks.map((o) => o.id)) + 1,
    // 親が同じ要素の中で最大のindex+1
    index:
      Math.max(
        ...bookmarks
          .filter((o) => o.parentId == data.parentId)
          .map((o) => o.index)
      ) + 1,
    dateAddedLocal: new Date().getTime().toString(),
    dateAddedUTC: new Date().getUTCDate().toString(),
  };
  bookmarks.push(bookmark);
  bookmarks = bookmarks.sort((l, r) => {
    return l.parentId === r.parentId
      ? l.index + r.index
      : l.parentId + r.parentId;
  });
  await chrome.storage.sync.set({ bookmarks: bookmarks });
};
