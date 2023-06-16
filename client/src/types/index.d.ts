export type BookmarkID = number;
export type BookmarkType = 'page' | 'folder';

export type BaseBookmark = {
  id: BookmarkID;
  index: number;
  title: string;
  url?: string;
  icon?: string;
  summary?: string;
  parentId: number;
  dateAddedLocal: string;
  dateAddedUTC: string;
};

export type NewBookMark = {
  title: string;
  url?: string;
  icon?: string;
  parentId?: number;
  summary?: string;
};

export type Bookmarks = {
  id: BookmarkID;
  type: BookmarkType;
  title: string;
  icon?: string;
  url?: string;
  summary?: string;
  children?: Bookmarks[];
};

export type BookmarkTree = {
  id: BookmarkID;
  type: BookmarkType;
  title: string;
  icon?: string;
  url?: string;
  summary?: string;
  children?: Bookmarks[];
};

export type SidebarBucket = {
  bookmarks: BaseBookmark[];
};

export type Folder = {
  id: BookmarkID;
  title: string;
  icon?: string;
};
