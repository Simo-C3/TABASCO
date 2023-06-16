import React, { useEffect, useState } from 'react';
import SearchField from './SearchField';
import { BaseBookmark } from '../types';

type Props = {
  searchBookmark: (keyword: string) => void;
  searchResult: BaseBookmark[];
  searchBookmarkUpdate: (folderId: number) => void;
};

const Header = (props: Props) => {
  return (
    <header className='relative z-50 flex h-16 w-full items-center justify-center border border-gray-100 bg-white'>
      <div className='absolute left-5 top-1/2 -translate-y-1/2'>TABASCO</div>
      <SearchField
        searchBookmark={props.searchBookmark}
        searchBookmarkUpdate={props.searchBookmarkUpdate}
        searchResult={props.searchResult}
        className='z-[101]'
      />
    </header>
  );
};

export default Header;
