import { RootId } from "../config";
import type { BaseBookmark, BookmarkID, NewBookMark } from "../types";

export class Bookmark {
  private bookmarks: BaseBookmark[] = [];
  private currentId: BookmarkID = 0;

  constructor() {
    this.loadBookmark();
  }

  async loadBookmark(): Promise<void> {
    await chrome.storage.sync.get(
      "bookmarks",
      (items: { [key: string]: BaseBookmark[] }) => {
        this.bookmarks = items.bookmarks;
      }
    );
  }

  all(): BaseBookmark[] {
    return this.bookmarks;
  }

  one(id: BookmarkID): BaseBookmark | undefined {
    return this.bookmarks.find((o) => o.id == id);
  }

  async create(bookmark: NewBookMark): Promise<BookmarkID> {
    const data: BaseBookmark = {
      ...bookmark,
      id: this.currentId + 1,
      index:
        Math.max(
          ...this.bookmarks
            .filter((o) => o.parentId == data.parentId)
            .map((o) => o.index)
        ) + 1,
      dateAddedLocal: new Date().getTime().toString(),
      dateAddedUTC: new Date().getUTCDate().toString(),
    };
    const newBookmarks = [...this.bookmarks, data].sort((l, r) => {
      return l.parentId === r.parentId
        ? l.index + r.index
        : l.parentId + r.parentId;
    });
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
    await this.loadBookmark();
    return data.id;
  }

  async update(id: BookmarkID, data: BaseBookmark): Promise<void> {
    const newBookmarks = this.bookmarks.map((bookmark) =>
      bookmark.id === id ? data : bookmark
    );
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
    await this.loadBookmark();
  }

  async delete(id: BookmarkID): Promise<void> {
    const newBookmarks = this.bookmarks.filter(
      (bookmark) => bookmark.id !== id
    );
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
    await this.loadBookmark();
  }

  getBookmarksInFolder(parentId: BookmarkID) {
    return this.bookmarks.filter((o) => o.parentId == parentId);
  }

  getFolders(): BaseBookmark[] {
    return this.bookmarks.filter((o) => typeof o.url === undefined);
  }

  getFullPath = async (bookmark: BaseBookmark): Promise<string> => {
    let fullPath = bookmark.title;
    let parent = await this.one(bookmark.parentId);

    while (parent) {
      fullPath = `${parent.title}/${fullPath}`;
      parent = await this.one(parent.parentId);
    }

    return fullPath;
  };
}
