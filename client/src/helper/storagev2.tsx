import { BookmarkStorageKey, RootId } from '../config';
import type { BaseBookmark, BookmarkID, BookmarkTree, Bookmarks, Folder, NewBookMark } from '../types';

export class Bookmark {
  private latestId = RootId;
  private readonly bookmarks: BaseBookmark[];
  constructor(bookmarks?: BaseBookmark[]) {
    this.bookmarks = bookmarks ?? [];
    if (bookmarks && bookmarks.length > 0) this.latestId = Math.max(...bookmarks.map((o) => o.id));
  }

  array(): BaseBookmark[] {
    return this.bookmarks;
  }

  tree(): BookmarkTree {
    const root: Bookmarks = {
      id: RootId,
      type: 'folder',
      title: 'root',
      children: this.makeTree(RootId),
    };

    return root;
  }

  find(id: number): BaseBookmark | undefined {
    return this.bookmarks.find((o) => o.id === id);
  }

  async create(bookmark: NewBookMark): Promise<BookmarkID> {
    if (bookmark.parentId && !this.find(bookmark.parentId)) throw new Error(`ParentId ${bookmark.parentId} not found`);

    const parentId = bookmark.parentId ?? RootId;
    const data: BaseBookmark = {
      ...bookmark,
      id: ++this.latestId,
      parentId: parentId,
      index: this.newIndex(parentId),
      dateAddedLocal: new Date().getTime().toString(),
      dateAddedUTC: new Date().getTime().toString(),
    };

    const newBookmarks = [...this.bookmarks, data].sort((l, r) => {
      return l.parentId === r.parentId ? l.index + r.index : l.parentId + r.parentId;
    });

    await chrome.storage.sync.set({ bookmarks: newBookmarks });
    return data.id;
  }

  async update(id: BookmarkID, data: Partial<BaseBookmark>): Promise<void> {
    const newBookmarks = this.bookmarks.map((bookmark) =>
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
    const target = this.find(id);
    if (target?.url === undefined) {
      const children = await this.getChildren(id);
      for (const child of children) {
        await this.delete(child.id);
      }
    }

    const newBookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== id);
    await chrome.storage.sync.set({ bookmarks: newBookmarks });
  }

  async clear(): Promise<void> {
    await chrome.storage.sync.remove(BookmarkStorageKey);
  }

  folders(): Folder[] {
    return this.bookmarks.filter((o) => o.url === undefined).map((o) => ({ id: o.id, title: o.title, icon: o.icon }));
  }

  getChildren(parentId: number): BaseBookmark[] {
    return this.bookmarks.filter((o) => o.parentId === parentId);
  }

  getFullPath(id: BookmarkID): string {
    const target = this.find(id);
    if (target === undefined) return '';

    let fullPath = target.title;
    let parent = this.find(target.parentId);
    while (parent) {
      fullPath = `${parent.title}/${fullPath}`;
      parent = this.find(parent.parentId);
    }

    return fullPath;
  }

  getParents(id: BookmarkID): BaseBookmark[] {
    const target = this.find(id);
    if (target === undefined) return [];

    const parent = this.getParents(target.parentId);

    return [...parent, target];
  }

  // Private Functions
  private newIndex(parentId: BookmarkID): number {
    const children = this.getChildren(parentId);
    if (children.length === 0) return 1;
    return Math.max(...children.map((o) => o.index)) + 1;
  }

  private makeTree(parentId: BookmarkID): BookmarkTree[] {
    const children = this.getChildren(parentId);
    const result = children.map((o) => {
      const type = o.url ? 'page' : 'folder';
      const bookmark: BookmarkTree = {
        id: o.id,
        type: type,
        title: o.title,
        url: o.url,
        icon: o.icon,
        summary: o.summary,
        children: this.makeTree(o.id),
      };
      if (type === 'page') delete bookmark.children;
      return bookmark;
    });
    return result;
  }
}
