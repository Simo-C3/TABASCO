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
    const bookmark = new Bookmark();
    (async () => setBookmarks(await bookmark.getBookmarkTree()))();
    const unsubscribe = bookmark.onChanged<Bookmarks>('tree', (newBookmarks) => {
      setBookmarks(newBookmarks);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div
        id='tabasco-side-bar-content'
        className={`absolute right-0 top-0 z-50 h-full w-[350px] bg-white px-10 py-20 text-gray-700 ${
          sidebarStatus ? '-translate-x-0' : 'translate-x-[350px]'
        }`}
        style={{ transition: 'transform 0.5s ease-in-out 0s' }}
      >
        <span>Hello World</span>
        {bookmarks && <AccordionMenu contents={bookmarks} />}
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
