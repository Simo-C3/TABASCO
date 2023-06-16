import React, { useCallback, useMemo, useState } from 'react';
import type { Bookmarks } from '../types';
import { RootId } from '../config';
import { Page } from './page';
import { MdMoreVert } from 'react-icons/md';
import { Bookmark } from '../helper/storage';
import BaseFolder from './BaseFolder';

type PropsType = {
  contents: Bookmarks;
};

export const AccordionMenu = React.memo(({ contents }: PropsType) => {
  const isRoot = contents.id === RootId;
  const [isOpen, setIsOpen] = useState(isRoot);
  const [menuStatus, setMenuStatus] = useState(false);

  const handleClick = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [isOpen]);

  //フォルダの削除
  const pullDownClick = useCallback(() => {
    setMenuStatus((prev) => !prev);
  }, [menuStatus]);

  const folderDelete = useCallback(async () => {
    const bookmark = new Bookmark();
    await bookmark.delete(contents.id);
  }, [contents.id]);

  return (
    <>
      <div>
        {!isRoot && (
          <div className='relative flex w-full justify-between'>
            <BaseFolder id={contents.id} title={contents.title} onClick={handleClick} />
            <div>
              <MdMoreVert onClick={pullDownClick} />
            </div>
            {menuStatus ? (
              <div className='absolute  right-[0px] top-[20px] bg-white shadow-lg'>
                <div onClick={folderDelete}>
                  <span>削除する</span>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {isOpen && (
          <div className={isRoot ? '' : 'pl-5'}>
            {contents.children?.map((article) => {
              if (article.type === 'page') {
                return <Page contents={article} />;
              }
              return <AccordionMenu contents={article} />;
            })}
          </div>
        )}
      </div>
    </>
  );
});
