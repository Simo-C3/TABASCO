import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MdFullscreen } from 'react-icons/md';

// twind
import { twind, cssom, observe } from '@twind/core';
import 'construct-style-sheets-polyfill';
import config from './twind.config';

import './index.css';
import { AccordionMenu } from './components/accordionMenu';
import { IconContext } from 'react-icons/lib';
import { BookmarkProvider, useBookmark } from './context/bookmark';

const Sidebar = () => {
  const { bookmark } = useBookmark();
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        id='tabasco-side-bar-content'
        className={` absolute right-[0px] top-[0x] z-50  h-full w-[350px] overflow-y-auto bg-white py-[40px]  pl-[35px] pr-[20px] text-gray-700 ${
          sidebarStatus ? '-translate-x-0' : ' translate-x-[350px] '
        }`}
        style={{ transition: 'transform 0.5s ease-in-out 0s' }}
      >
        <div className='absolute right-[15px]  top-[20px]' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <button className=' bg-white '>
            <IconContext.Provider value={{ size: '20px', color: !isHovered ? '#c0c0c0' : '#696969' }}>
              <MdFullscreen className='' />
            </IconContext.Provider>
          </button>
        </div>

        <div className='mb-[25px] flex justify-center'>
          <h1 className='  text-[26px] font-bold'>TABASCO!!!</h1>
        </div>
        <AccordionMenu contents={bookmark.tree()} />
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
shadow.render(
  <BookmarkProvider>
    <Sidebar />
  </BookmarkProvider>,
);
