import { Bookmark } from '../helper/storage';

export type BookmarkID = number;
export type BookmarkType = 'page' | 'folder';

export type BaseBookmark = {
  id: BookmarkID;
  index: number;
  title: string;
  url?: string;
  icon?: string;
  parentId: number;
  dateAddedLocal: string;
  dateAddedUTC: string;
};

export type NewBookMark = {
  title: string;
  url?: string;
  icon?: string;
  parentId?: number;
};

export type Bookmarks = {
  id: BookmarkID;
  type: BookmarkType;
  title: string;
  icon?: string;
  url?: string;
  children?: Bookmarks[];
};

export type SidebarBucket = {
  bookmarks: BaseBookmark[];
};
