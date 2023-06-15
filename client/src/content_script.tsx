import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// twind
import { twind, cssom, observe } from '@twind/core';
import 'construct-style-sheets-polyfill';
import config from './twind.config';

import './index.css';
import { AccordionMenu } from './components/accordionMenu';
import { Bookmark } from './helper/storage';
import type { Bookmarks } from './types';

const Sidebar = () => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmarks>();
  const [count, setCount] = useState(0);

  window.addEventListener('mousemove', (e: MouseEvent) => {
    const sideBarElement = document.getElementById('tabasco-side-bar');
    const sideBarContentElement = sideBarElement?.shadowRoot;
    if (!sidebarStatus && window.innerWidth - e.clientX < 10) {
      setSidebarStatus(true);
      sideBarElement?.classList.remove('inactive');
      sideBarElement?.classList.add('active');
    } else if (
      sidebarStatus &&
      window.innerWidth - e.clientX > sideBarContentElement?.getElementById('tabasco-side-bar-content')?.clientWidth!
    ) {
      setSidebarStatus(false);
      sideBarElement?.classList.remove('active');
      sideBarElement?.classList.add('inactive');
    }
  });

  useEffect(() => {
    const onChangedStorage = async (changes: { [key: string]: any }, namespace: 'sync' | 'local' | 'managed' | 'session') => {
      if (namespace !== 'sync') return;
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.getBookmarkTree();
      setBookmarks(bookmarks);
    };
    chrome.storage.onChanged.addListener(onChangedStorage);

    (async () => {
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.getBookmarkTree();
      setBookmarks(bookmarks);
    })();

    return () => {
      chrome.storage.onChanged.removeListener(onChangedStorage);
    };
  }, []);

  return (
    <>
      <div>
        <div
          id='tabasco-side-bar-content'
          className={` absolute right-[0px] top-[0x] z-50 h-full w-[350px] bg-white py-[40px] pl-[35px] pr-[20px]  text-gray-700 ${
            sidebarStatus ? '-translate-x-0' : 'translate-x-[350px] '
          }`}
          style={{ transition: 'transform 0.5s ease-in-out 0s' }}
        >
          <div className='mb-[25px] flex justify-center'>
            <h1 className='  text-[26px] font-bold'>TABASCO!!!</h1>
          </div>
          {bookmarks && <AccordionMenu contents={bookmarks} />}
        </div>
      </div>
    </>
  );
};

const sheet = cssom(new CSSStyleSheet());
const tw = twind(config, sheet);

const root: HTMLDivElement = document.createElement('div');
root.id = 'tabasco-side-bar';
root.classList.add('inactive');
const shadowRoot = root.attachShadow({ mode: 'open' });
root.style.lineHeight = '18px';
shadowRoot.adoptedStyleSheets = [sheet.target];
observe(tw, shadowRoot);
const shadow = createRoot(shadowRoot);
document.body.appendChild(root);
shadow.render(<Sidebar />);
