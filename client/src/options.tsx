import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Bookmark } from './helper/storage';

import Column from './components/column';
import { BaseBookmark } from './types';
import Header from './components/Header';
import { BookmarkProvider } from './context/bookmark';
import ShareImport from './components/ShareImport';

const getQueryParam = (url: string, param: string): string | null => {
  const params = new URLSearchParams(new URL(url).search);
  return params.get(param);
};

interface Share {
  title: string;
  pages: {
    title: string;
    url: string;
  }[];
}

const apiShareRequest = async (id: string): Promise<Share> => {
  const result = await fetch(`https://tabasco-server.kurichi.workers.dev/api/v1/share/${id}`);
  return await result.json();
};

const Options = () => {
  const [bookmarks, setBookmarks] = useState<BaseBookmark[]>([]);
  const [searchResult, setSearchResult] = useState<BaseBookmark[]>([]);
  const [fullPathWithId, setFullPathWithId] = useState<number[]>([]);
  const [isOpenShareModal, setIsOpenShareModal] = useState<boolean>(false);

  useEffect(() => {
    const f = async () => {
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.all();
      setBookmarks(bookmarks);
    };
    f();
  }, []);

  const updateBookmarks = async () => {
    const bookmark = new Bookmark();
    const bookmarkAll = await bookmark.all();
    setBookmarks(bookmarkAll);
  };

  const searchBookmark = (query: string) => {
    const searchResult = bookmarks.filter((bookmark) => {
      return bookmark.title.includes(query) || bookmark.url?.includes(query);
    });
    console.log(searchResult);
    setSearchResult(searchResult);
  };

  const searchBookmarkUpdate = async (folderId: number) => {
    console.log('searchBookmarkUpdate', folderId);
    const bookmark = new Bookmark();
    bookmark.getFullPathWithId(folderId).then((result) => {
      setFullPathWithId(result);
    });
  };

  const openShareModal = () => {
    setIsOpenShareModal(true);
  };

  return (
    <div className='relative h-screen w-screen'>
      <Header
        searchBookmark={searchBookmark}
        searchResult={searchResult}
        searchBookmarkUpdate={searchBookmarkUpdate}
        getShare={openShareModal}
      />
      <div id='option-content' className='h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] overflow-x-auto overflow-y-hidden bg-white'>
        <Column updateBookmarks={updateBookmarks} fullPathWithId={fullPathWithId} />
      </div>
      <ShareImport
        isOpen={isOpenShareModal}
        onClose={() => {
          setIsOpenShareModal(false);
        }}
      />
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <BookmarkProvider>
    <Options />
  </BookmarkProvider>,
);
