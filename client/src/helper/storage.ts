import { BookmarkStorageKey, RootId } from '../config';
import type { BaseBookmark, BookmarkID, Bookmarks, Folder, NewBookMark } from '../types';

export class Bookmark {
  private async load(): Promise<BaseBookmark[]> {
    return (await chrome.storage.sync.get(BookmarkStorageKey))[BookmarkStorageKey] ?? [];
  }

  private newId(bookmarks: BaseBookmark[]): BookmarkID {
    if (bookmarks.length === 0) return 1;
    return Math.max(...bookmarks.map((o) => o.id)) + 1;
  }

  private newIndex(bookmarks: BaseBookmark[], parentId: BookmarkID): number {
    if (bookmarks.length === 0) return 1;
    return Math.max(...bookmarks.filter((o) => o.parentId === parentId).map((o) => o.index)) + 1;
  }

  async all(): Promise<BaseBookmark[]> {
    return await this.load();
  }

  async one(id: BookmarkID): Promise<BaseBookmark | undefined> {
    const bookmarks = await this.load();
    console.log(bookmarks);

    const target = bookmarks.find((o) => o.id === id);
    console.log(target);
    return bookmarks.find((o) => o.id === id);
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

  async update(id: BookmarkID, data: Partial<BaseBookmark>): Promise<void> {
    const bookmarks = await this.load();
    const newBookmarks = bookmarks.map((bookmark) =>
      bookmark.id === id
        ? {
            ...bookmark,
            ...data,
          }
        : bookmark,
    );
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
  }

  async delete(id: BookmarkID): Promise<void> {
    const bookmarks = await this.load();
    const target = bookmarks.find((o) => o.id === id);
    if (target?.url === undefined) {
      const children = await this.getBookmarksInFolder(id);
      for (const child of children) {
        await this.delete(child.id);
      }
    }
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

  private async makeTree(bookmarks: BaseBookmark[], parentId: BookmarkID): Promise<Bookmarks[]> {
    const children = bookmarks.filter((o) => o.parentId === parentId);
    const result = await children.map(async (o): Promise<Bookmarks> => {
      const type = o.url ? 'page' : 'folder';
      const bookmark: Bookmarks = {
        id: o.id,
        type: type,
        title: o.title,
        url: o.url,
        icon: o.icon,
        summary: o.summary,
        children: await this.makeTree(bookmarks, o.id),
      };
      if (type === 'page') delete bookmark.children;
      return bookmark;
    });
    return await Promise.all(result);
  }

  async getBookmarkTree(): Promise<Bookmarks> {
    const bookmarks = await this.load();
    const root: Bookmarks = {
      id: RootId,
      type: 'folder',
      title: 'root',
      children: await this.makeTree(bookmarks, RootId),
    };

    return root;
  }

  onChanged<T extends Bookmarks | BaseBookmark[]>(type: 'array' | 'tree', callback: (bookmark: T) => void): () => void {
    const listener = async (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'sync') return;
      if (type === 'array') {
        const bookmarks = await this.all();
        callback(bookmarks as T);
      } else if (type === 'tree') {
        const bookmarks = await this.getBookmarkTree();
        callback(bookmarks as T);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }
}
