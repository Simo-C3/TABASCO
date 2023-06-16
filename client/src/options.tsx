import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Bookmark } from './helper/storage';

import Column from './components/column';
import { BaseBookmark } from './types';
import Header from './components/Header';
import { BookmarkProvider } from './context/bookmark';

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

  useEffect(() => {
    const f = async () => {
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.all();
      setBookmarks(bookmarks);
    };
    f();
    getShare();
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

  const getShare = () => {
    const url = window.location.href;
    const id = getQueryParam(url, 'id');
    if (id) {
      apiShareRequest(id).then(async (result) => {
        const bookmark = new Bookmark();
        const groupId = await bookmark.create({
          title: result.title,
        });
        for (const page of result.pages) {
          await bookmark.create({
            title: page.title,
            url: page.url,
            parentId: groupId,
          });
        }
      });
    }
  };

  return (
    <div className='h-screen w-screen'>
      <Header searchBookmark={searchBookmark} searchResult={searchResult} searchBookmarkUpdate={searchBookmarkUpdate} />
      <div id='option-content' className='h-[calc(100vh-4rem)] w-[calc(100vw-4rem)] overflow-x-auto overflow-y-hidden bg-white'>
        <Column updateBookmarks={updateBookmarks} fullPathWithId={fullPathWithId} />
      </div>
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
