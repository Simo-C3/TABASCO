import React from 'react';
import { MdOutlineSearch } from 'react-icons/md';

type Props = {
  searchBookmark: (keyword: string) => void;
};

const Header = (props: Props) => {
  const searchBoxRef = React.createRef<HTMLInputElement>();

  const onClickSearchButton = () => {
    const searchKeyword = searchBoxRef.current?.value;
    if (searchKeyword && searchKeyword !== '') props.searchBookmark(searchKeyword);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchBoxEl = searchBoxRef.current;
    if (document.activeElement === searchBoxEl && searchBoxEl?.value && searchBoxEl.value !== '' && event.key === 'Enter') {
      props.searchBookmark(searchBoxEl.value);
    }
  };

  return (
    <header onKeyDown={onKeyDown} className='relative z-50 flex h-16 w-full items-center border border-gray-100 bg-white'>
      <div>TABASCO</div>
      <div className='absolute left-1/2 top-1/2 w-52 -translate-x-1/2 -translate-y-1/2'>
        <input
          ref={searchBoxRef}
          type='text'
          className='w-full rounded-full border-none bg-gray-100 py-1 pl-5 pr-8 text-base outline-none'
        />
        <MdOutlineSearch onClick={onClickSearchButton} className='absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2' />
      </div>
    </header>
  );
};

export default Header;
