import React, { memo, useEffect, useState } from 'react';
import BaseFolder from './BaseFolder';
import { Bookmarks } from '../types';
import { MdMoreVert } from 'react-icons/md';
import { useBookmark } from '../context/bookmark';

type Props = {
  index: number;
  columnIndex: number;
  parentItemsNumber: number;
  openFolderId?: number;
  item: Bookmarks;
  openFolder: (folderId: number, columnIndex: number) => void;
};

const ColumnFolder = memo((props: Props) => {
  const contextMenu = React.createRef<HTMLDivElement>();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const { bookmark } = useBookmark();

  useEffect(() => {
    window.addEventListener('click', (event) => {
      showContextMenu && event.target !== contextMenu.current && setShowContextMenu(false);
    });
  }, []);

  const onClickMoreVert = () => {
    setShowContextMenu(true);
  };

  const deleteBookmark = () => {
    console.log('delete');
    bookmark.delete(props.item.id);
    setShowContextMenu(false);
  };

  return (
    <div
      className={`relative my-1 cursor-pointer rounded-md hover:bg-red-100 ${props.item.id === props.openFolderId ? 'bg-red-100' : ''}`}
      style={{ zIndex: props.parentItemsNumber - props.index }}
    >
      <BaseFolder
        id={props.item.id}
        status='close'
        title={props.item.title}
        size='lg'
        className={'w-[calc(100%-3rem)] px-1 py-1'}
        onClick={(event: MouseEvent) => {
          props.openFolder(props.item.id, props.columnIndex);
        }}
      />
      <div className='absolute right-0 top-1/2 z-50 flex -translate-y-1/2 select-none items-center'>
        <div className='rounded-md bg-gray-50 px-1 py-1'>{props.item.children ? props.item.children.length : 0}</div>
        <MdMoreVert onClick={onClickMoreVert} className='h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-700' />
        <div
          ref={contextMenu}
          className={`absolute right-0 top-7 z-[60] w-16 rounded-lg bg-white px-2 py-2 shadow-md ${showContextMenu ? '' : 'hidden'}`}
        >
          <span onClick={deleteBookmark} className='w-full cursor-pointer px-3 py-2 text-center'>
            削除
          </span>
        </div>
      </div>
      {/* {showContextMenu ? (
        <div
          onClick={() => {
            setShowContextMenu(false);
          }}
          className={`fixed left-0 top-0 z-50 h-screen w-screen bg-gray-100 ${showContextMenu ? '' : 'hidden'}`}
        />
      ) : null} */}
    </div>
  );
});

export default ColumnFolder;
