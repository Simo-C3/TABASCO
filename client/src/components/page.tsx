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
    <div className='relative flex w-full items-center justify-between rounded-lg px-2 py-1 hover:bg-green-100'>
      <BaseLink title={contents.title} icon={contents.icon || ''} link={contents.url} className='' />
      <MdDeleteForever onClick={deleteBookmark} className='top-1/2 h-5 w-5 flex-shrink-0 text-gray-500 hover:text-gray-700' />
    </div>
  );
});
