export type BaseBookmark = {
  index: number;
  title: string;
  url: string | null;
  icon: string | null;
  id: number;
  parentId: number;
  dateAddedLocal: string;
  dateAddedUTC: string;
};

export type NewBookMark = {
  title: string;
  url: string | null;
  icon: string | null;
  parentId: number;
};

export type SidebarBucket = {
  bookmarks: BaseBookmark[];
};
