import React from 'react';
import type { Bookmarks } from '../types';
import BaseFolder from './BaseFolder';

type PropsType = {
  contents: Bookmarks;
};

export const Page = ({ contents }: PropsType) => {
  const openPage = () => {
    window.open(contents.url);
  };

  return (
    <div>
      <div onClick={openPage} className=' hover:bg-blue-100 '>
        <BaseFolder id={contents.id} title={contents.title} icon={contents.icon || ''} />
      </div>
    </div>
  );
};
