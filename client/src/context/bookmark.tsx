import React, { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { BookmarkStorageKey } from '../config';
import { Bookmark } from '../helper/storagev2';

//Context
interface ContextInterface {
  bookmark: Bookmark;
}

const BookmarkContext = createContext({} as ContextInterface);

export const useBookmark = () => {
  return useContext(BookmarkContext);
};

export const BookmarkProvider = ({ children }: PropsWithChildren<{}>) => {
  const [bookmark, setBookmark] = useState<Bookmark>(new Bookmark());

  const loadBookmark = async () => {
    const bookmarks = (await chrome.storage.sync.get(BookmarkStorageKey))[BookmarkStorageKey];
    setBookmark(new Bookmark(bookmarks));
  };

  useEffect(() => {
    loadBookmark();

    const listener = async (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName !== 'sync') return;
      loadBookmark();
    };

    chrome.storage.onChanged.addListener(listener);
    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, []);

  return <BookmarkContext.Provider value={{ bookmark }}>{children}</BookmarkContext.Provider>;
};
