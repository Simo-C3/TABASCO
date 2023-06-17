import React, { useCallback, useEffect, useState } from 'react';
import type { Bookmarks } from '../types';
import { RootId } from '../config';
import { Page } from './page';
import { MdMoreVert, MdOutlineStickyNote2 } from 'react-icons/md';
import BaseFolder from './BaseFolder';
import { useBookmark } from '../context/bookmark';

type PropsType = {
  contents: Bookmarks;
};

export const AccordionMenu = React.memo(({ contents }: PropsType) => {
  const { bookmark } = useBookmark();
  const isRoot = contents.id === RootId;
  const [isOpen, setIsOpen] = useState(isRoot);
  const [menuStatus, setMenuStatus] = useState(false);
  const contextMenu = React.createRef<HTMLDivElement>();

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  useEffect(() => {
    const shadowRoot = document.getElementById('tabasco-side-bar')?.shadowRoot;
    shadowRoot?.getElementById('tabasco-side-bar-content')?.addEventListener('click', (event) => {
      if (menuStatus && event.target !== contextMenu.current) {
        setMenuStatus((prev) => {
          return false;
        });
      }
    });
  }, [menuStatus]);

  //フォルダの削除
  const pullDownClick = useCallback(() => {
    setMenuStatus((prev) => !prev);
  }, [menuStatus]);

  const folderDelete = useCallback(async () => {
    await bookmark.delete(contents.id);
  }, [contents.id]);

  return (
    <>
      {!isRoot && (
        <div className='relative flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1 hover:bg-green-100'>
          <BaseFolder id={contents.id} title={contents.title} status={isOpen ? 'open' : 'close'} onClick={handleClick} />
          <div>
            {contents.summary ? (
              <div className='relative'>
                <MdOutlineStickyNote2 className='group h-5 w-5' />
                <div className='absolute right-0 top-6 rounded-lg bg-white px-2 py-1 drop-shadow-md group-hover:block'>
                  {contents.summary}
                </div>
              </div>
            ) : null}
            <MdMoreVert onClick={pullDownClick} className='h-5 w-5' />
          </div>
          {menuStatus ? (
            <div ref={contextMenu} className='absolute right-0 top-8 z-50 rounded-lg bg-white px-3 py-2 drop-shadow-md'>
              <div onClick={folderDelete} className='text-sm'>
                <span>削除する</span>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {isOpen && (
        <div className={`${isRoot ? '' : 'ml-5'}`}>
          {contents.children?.map((article, index) => {
            if (article.type === 'page') {
              return <Page key={index} contents={article} />;
            }
            return <AccordionMenu key={index} contents={article} />;
          })}
        </div>
      )}
    </>
  );
});
