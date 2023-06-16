import React from 'react';
import type { BookmarkID, Bookmarks } from '../types';
import BaseFolder from './BaseFolder';
import { MdDeleteForever } from 'react-icons/md';
import { Bookmark } from '../helper/storage';
import BaseLink from './BaseLink';

type PropsType = {
  contents: Bookmarks;
};

export const Page = ({ contents }: PropsType) => {
  const openPage = () => {
    window.open(contents.url);
  };

  const deleteBookmark = async () => {
    const bookmark = new Bookmark();
    await bookmark.delete(contents.id);
  };

  return (
    <div>
      <div className='flex justify-between'>
        <div className=' bg-white text-left  text-[16px] text-black hover:bg-blue-100 '>
          <BaseLink title={contents.title} icon={contents.icon || ''} link={contents.url} />
        </div>
        <div className='flex justify-center'>
          <MdDeleteForever onClick={deleteBookmark} />
        </div>
      </div>
    </div>
  );
};
