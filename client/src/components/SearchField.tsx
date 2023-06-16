import React, { createRef, useEffect, useState } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { BaseBookmark } from '../types';
import BaseFolder from './BaseFolder';
import BaseLink from './BaseLink';

type Props = {
  searchBookmark: (keyword: string) => void;
  className?: string;
  searchResult: BaseBookmark[];
  searchBookmarkUpdate: (folderId: number) => void;
};

const SearchField = (props: Props) => {
  const searchBoxRef = createRef<HTMLInputElement>();
  const searchResultListRef = createRef<HTMLDivElement>();
  const searchResultItemRef = createRef<HTMLDivElement>();

  const [showSearchResult, setShowSearchResult] = useState<boolean>(false);
  const [selectingSearchResultIndex, setSelectingSearchResultIndex] = useState<number>(-1);
  const [selectedSearchResult, setSelectedSearchResult] = useState<number | null>(null);
  const [searchResultListHeight, setSearchResultListHeight] = useState<number>(0);
  const [selectedSearchResultItemPosition, setSelectedSearchResultItemPosition] = useState<number>(0);
  const [searchResultState, setSearchResultState] = useState<BaseBookmark[]>([]);

  const onClickSearchButton = () => {
    console.log('onClickSearchButton');
    const searchKeyword = searchBoxRef.current?.value;
    if (searchKeyword && searchKeyword !== '') props.searchBookmark(searchKeyword);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchBoxEl = searchBoxRef.current;
    if (document.activeElement === searchBoxEl && searchBoxEl?.value && searchBoxEl.value !== '' && event.key === 'Enter') {
      props.searchBookmark(searchBoxEl.value);
    }
    selectSearchResultHandler(event);
  };

  useEffect(() => {
    if (!showSearchResult) {
      setSelectingSearchResultIndex(-1);
      setSelectedSearchResultItemPosition(0);
      setSearchResultState([]);
    }
  }, [showSearchResult]);

  useEffect(() => {
    setSearchResultState(props.searchResult);
  }, [props.searchResult]);

  useEffect(() => {
    setSearchResultListHeight(searchResultListRef.current?.clientHeight!);
  }, [searchResultListRef]);

  useEffect(() => {
    searchBoxRef.current?.focus();
    setShowSearchResult(searchResultState.length > 0);
  }, [searchResultState]);

  useEffect(() => {
    console.log(selectedSearchResult);
    props.searchBookmarkUpdate(selectedSearchResult!);
    setShowSearchResult(false);
  }, [selectedSearchResult]);

  const scrollDownHandler = (searchResultItemHeight: number) => {
    if (selectedSearchResultItemPosition + searchResultItemHeight > searchResultListHeight - searchResultItemHeight) {
      searchResultListRef.current?.scrollBy(0, searchResultItemHeight);
    } else {
      setSelectedSearchResultItemPosition((prev) => {
        return prev + searchResultItemHeight;
      });
    }
  };

  const scrollUpHandler = (searchResultItemHeight: number) => {
    if (selectedSearchResultItemPosition - searchResultItemHeight < searchResultItemHeight) {
      searchResultListRef.current?.scrollBy(0, -searchResultItemHeight);
    } else {
      setSelectedSearchResultItemPosition((prev) => {
        return prev - searchResultItemHeight;
      });
    }
  };

  const selectSearchResultHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const searchResultItemHeight = searchResultItemRef.current?.clientHeight || 0;
    if (document.activeElement !== searchBoxRef.current || selectingSearchResultIndex !== -1) {
      switch (event.key) {
        case 'ArrowDown':
          setSelectingSearchResultIndex((prev) => {
            if (prev + 1 >= props.searchResult.length) {
              searchResultListRef.current?.scrollTo(0, 0);
              setSelectedSearchResultItemPosition(0);
              return 0;
            } else {
              scrollDownHandler(searchResultItemHeight);

              return prev + 1;
            }
          });
          event.preventDefault();
          break;
        case 'Tab':
          setSelectingSearchResultIndex((prev) => {
            if (prev + 1 >= props.searchResult.length) {
              searchResultListRef.current?.scrollTo(0, 0);
              setSelectedSearchResultItemPosition(0);
              return 0;
            } else {
              scrollDownHandler(searchResultItemHeight);
              return prev + 1;
            }
          });
          event.preventDefault();
          break;
        case 'ArrowUp':
          setSelectingSearchResultIndex((prev) => {
            if (prev - 1 < 0) {
              searchResultListRef.current?.scrollTo(0, searchResultItemRef.current?.offsetHeight! * props.searchResult.length);
              setSelectedSearchResultItemPosition(searchResultListHeight);
              return props.searchResult.length - 1;
            } else {
              scrollUpHandler(searchResultItemHeight);
              return prev - 1;
            }
          });
          event.preventDefault();
          break;
        case 'Enter':
          if (
            !searchResultState[selectingSearchResultIndex].url ||
            searchResultState[selectingSearchResultIndex].url === null ||
            searchResultState[selectingSearchResultIndex].url === ''
          ) {
            console.log(selectingSearchResultIndex);
            setSelectedSearchResult(searchResultState[selectingSearchResultIndex].id);
          } else {
            setSelectedSearchResult(null);
            setSelectingSearchResultIndex(-1);
            setSelectedSearchResultItemPosition(0);
            window.open(searchResultState[selectingSearchResultIndex].url, '_blank');
          }
          break;
        default:
          break;
      }
    } else {
      if (event.key === 'ArrowDown') {
        setSelectingSearchResultIndex(0);
      }
    }
  };

  return (
    <div className={`${props.className} relative`}>
      <div onKeyDown={onKeyDown} className='relative z-[101] w-[40vw] min-w-[13rem] max-w-md'>
        <input
          id='header-search-box'
          ref={searchBoxRef}
          onChange={(event) => {
            searchBoxRef.current?.value === '' ? setShowSearchResult(false) : null;
          }}
          type='text'
          className='w-full rounded-full border-none bg-gray-100 py-1 pl-5 pr-8 text-base outline-none'
        />
        <MdOutlineSearch onClick={onClickSearchButton} className='absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer' />
      </div>
      {searchResultState.length > 0 && (
        <div
          ref={searchResultListRef}
          className={`absolute left-1/2 top-10 z-[101] max-h-[60vh] min-w-[200px] max-w-[60vw] -translate-x-1/2 overflow-y-auto overflow-x-hidden rounded-xl bg-white px-3 py-2 drop-shadow-xl ${
            showSearchResult ? '' : 'hidden'
          }`}
        >
          {searchResultState.map((item, index) => {
            return (
              <div
                ref={searchResultItemRef}
                key={index}
                className={`rounded-lg hover:bg-gray-100 ${selectingSearchResultIndex === index ? 'bg-gray-100' : 'bg-white'}`}
              >
                {item.url ? (
                  <BaseLink title={item.title} icon={item.icon} link={item.url} className='w-[calc(100%-3rem)] px-1 py-1' />
                ) : (
                  <BaseFolder
                    onClick={() => {
                      console.log(item.url);
                      setSelectedSearchResult(item.id);
                    }}
                    id={item.id}
                    title={item.title}
                    className='w-[calc(100%-0.5rem)] cursor-pointer px-1 py-1'
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {showSearchResult ? (
        <div
          onClick={() => {
            setShowSearchResult(false);
          }}
          className='fixed left-0 top-0 z-[100] h-screen w-screen'
        />
      ) : null}
    </div>
  );
};

export default SearchField;
