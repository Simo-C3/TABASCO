import React from 'react';
import type { Bookmarks } from '../types';
import { MdDeleteForever } from 'react-icons/md';
import BaseLink from './BaseLink';
import { useBookmark } from '../context/bookmark';

type PropsType = {
  contents: Bookmarks;
};

export const Page = React.memo(({ contents }: PropsType) => {
  const { bookmark } = useBookmark();
  const deleteBookmark = async () => {
    await bookmark.delete(contents.id);
  };

  return (
    <div>
      <div className=' flex  justify-between '>
        <div className='overflow-hidden bg-white text-left text-[16px] text-black hover:bg-blue-100'>
          <BaseLink title={contents.title} icon={contents.icon || ''} link={contents.url} />
        </div>
        <div className='flex justify-center'>
          <MdDeleteForever onClick={deleteBookmark} />
        </div>
      </div>
    </div>
  );
});
