import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { AccordionMenu } from './components/accordionMenu';
import { Bookmark } from './helper/storage';
import { BaseBookmark, Bookmarks } from './types';
import { RootId } from './config';

const Sidebar = () => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [bookmarks, setBookmarks] = useState<BaseBookmark[]>([]);
  const [count, setCount] = useState(0);
  const testBookmarks: Bookmarks = {
    id: RootId,
    type: 'folder',
    title: 'root',
    children: [
      {
        id: 1,
        title: 'tabasco',
        type: 'folder',
        children: [
          {
            id: 2,
            title: 'kurichi',
            url: 'https://google.com',
            type: 'page',
          },
          {
            id: 3,
            title: 'tim',
            url: 'https://twitter.com',
            type: 'page',
          },
          {
            id: 4,
            title: 'shimomo',
            url: 'https://youtube.com',
            type: 'page',
          },
        ],
      },
      {
        id: 100,
        title: 'notion',
        url: 'https://notion.so',
        type: 'page',
      },
    ],
  };

  window.addEventListener('mousemove', (e: MouseEvent) => {
    if (!sidebarStatus && window.innerWidth - e.clientX < 10) {
      setSidebarStatus(true);
      const sideBarElement = document.getElementById('tabasco-side-bar');
      sideBarElement?.classList.remove('inactive');
      sideBarElement?.classList.add('active');
    } else if (sidebarStatus && window.innerWidth - e.clientX > document.getElementById('tabasco-side-bar-content')?.clientWidth!) {
      setSidebarStatus(false);
      const sideBarElement = document.getElementById('tabasco-side-bar');
      sideBarElement?.classList.remove('active');
      sideBarElement?.classList.add('inactive');
    }
  });

  useEffect(() => {
    const onChangedStorage = async (changes: { [key: string]: any }, namespace: 'sync' | 'local' | 'managed' | 'session') => {
      if (namespace !== 'sync') return;
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.all();
      setBookmarks(bookmarks);
    };
    chrome.storage.onChanged.addListener(onChangedStorage);

    (async () => {
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.all();
      setBookmarks(bookmarks);
    })();

    return () => {
      chrome.storage.onChanged.removeListener(onChangedStorage);
    };
  }, []);

  return (
    <>
      <div
        id='tabasco-side-bar-content'
        className={`absolute right-0 top-0 z-50 h-full w-[350px] bg-white px-10 py-20 text-gray-700 ${
          sidebarStatus ? '-translate-x-0' : 'translate-x-[350px]'
        }`}
      >
        <span>Hello World</span>
        <div>{count}</div>
        {bookmarks.map((bookmark) => {
          return (
            <div>
              {bookmark.title}
              {bookmark.url}
            </div>
          );
        })}
        <br />
        <AccordionMenu contents={testBookmarks} />
      </div>
    </>
  );
};

const root: HTMLDivElement = document.createElement('div');
root.id = 'tabasco-side-bar';
root.classList.add('inactive');
document.body.appendChild(root);
ReactDOM.render(<Sidebar />, root);
