import React, { useState } from 'react';
import type { Bookmarks } from '../types';
import { RootId } from '../config';
import { Page } from './page';
import { MdFolderOpen } from 'react-icons/md';
import { MdMoreVert } from 'react-icons/md';
import { Bookmark } from '../helper/storage';
import BaseFolder from './BaseFolder';

type PropsType = {
  contents: Bookmarks;
};

export const AccordionMenu = ({ contents }: PropsType) => {
  const [isOpen, setIsOpen] = useState(false);
  const isRoot = contents.id === RootId;
  const [menuStatus, setMenuStatus] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  //配列の表示
  const SetArticle = () => {
    return (
      <div className={isRoot ? '' : 'pl-5'}>
        {contents.children?.map((article) => {
          if (article.type === 'page') {
            return <Page contents={article} />;
          }
          return <AccordionMenu contents={article} />;
        })}
      </div>
    );
    ('');
  };

  if (isRoot) {
    return <SetArticle />;
  }

  //フォルダの削除
  const pullDownClick = () => {
    setMenuStatus((prev) => !prev);
  };
  const folderDelete = async () => {
    const bookmark = new Bookmark();
    await bookmark.delete(contents.id);
  };

  return (
    <>
      <div>
        <div className='relative flex w-full justify-between'>
          <div onClick={handleClick}>
            <BaseFolder id={contents.id} title={contents.title} />
          </div>
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
        {isOpen && <SetArticle />}
      </div>
    </>
  );
};
