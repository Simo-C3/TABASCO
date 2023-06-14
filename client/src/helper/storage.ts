import { BookmarkStorageKey, RootId } from '../config';
import type { BaseBookmark, BookmarkID, Folder, NewBookMark } from '../types';

export class Bookmark {
  private async load(): Promise<BaseBookmark[]> {
    return (await chrome.storage.sync.get(BookmarkStorageKey))[BookmarkStorageKey] ?? [];
  }

  private newId(bookmarks: BaseBookmark[]): BookmarkID {
    return Math.max(...bookmarks.map((o) => o.id)) + 1;
  }

  private newIndex(bookmarks: BaseBookmark[], parentId: BookmarkID): number {
    return Math.max(...bookmarks.filter((o) => o.parentId === parentId).map((o) => o.index)) + 1;
  }

  async all(): Promise<BaseBookmark[]> {
    return await this.load();
  }

  async one(id: BookmarkID): Promise<BaseBookmark | undefined> {
    const bookmarks = await this.load();
    return bookmarks.find((o) => o.id == id);
  }

  async create(bookmark: NewBookMark): Promise<BookmarkID> {
    const bookmarks = await this.load();
    const parentId = bookmark.parentId ?? RootId;
    const data: BaseBookmark = {
      ...bookmark,
      id: this.newId(bookmarks),
      parentId: parentId,
      index: this.newIndex(bookmarks, parentId),
      dateAddedLocal: new Date().getTime().toString(),
      dateAddedUTC: new Date().getTime().toString(),
    };

    const newBookmarks = [...bookmarks, data].sort((l, r) => {
      return l.parentId === r.parentId ? l.index + r.index : l.parentId + r.parentId;
    });

    await chrome.storage.sync.set({ bookmarks: newBookmarks });
    return data.id;
  }

  async update(id: BookmarkID, data: BaseBookmark): Promise<void> {
    const bookmarks = await this.load();
    const newBookmarks = bookmarks.map((bookmark) => (bookmark.id === id ? data : bookmark));
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
  }

  async delete(id: BookmarkID): Promise<void> {
    const bookmarks = await this.load();
    const newBookmarks = bookmarks.filter((bookmark) => bookmark.id !== id);
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
  }

  async clear(): Promise<void> {
    await chrome.storage.sync.remove(BookmarkStorageKey);
  }

  async getBookmarksInFolder(parentId: BookmarkID) {
    const bookmarks = await this.load();
    return bookmarks.filter((o) => o.parentId == parentId);
  }

  async getFolders(): Promise<Folder[]> {
    const bookmarks = await this.load();
    return bookmarks.filter((o) => o.url === undefined || o.url === '').map((o) => ({ id: o.id, title: o.title, icon: o.icon! }));
  }

  async getFullPath(bookmark: BaseBookmark): Promise<string> {
    let fullPath = bookmark.title;
    let parent = await this.one(bookmark.parentId);

    while (parent) {
      fullPath = `${parent.title}/${fullPath}`;
      parent = await this.one(parent.parentId);
    }

    return fullPath;
  }
}
