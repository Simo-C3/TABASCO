import React, { memo, useEffect, useState } from 'react';
import { Bookmarks } from '../types';
import { MdMoreVert } from 'react-icons/md';
import BaseLink from './BaseLink';
import { Bookmark } from '../helper/storage';

type Props = {
  index: number;
  columnIndex: number;
  openFolderId?: number;
  item: Bookmarks;
  parentItemsNumber: number;
  showContextMenuBlur: boolean;
  setShowContextMenuBlur: (show: boolean) => void;
};

const ColumnLink = memo((props: Props) => {
  const contextMenu = React.createRef<HTMLDivElement>();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

  useEffect(() => {
    if (!props.showContextMenuBlur) {
      setShowContextMenu(props.showContextMenuBlur);
    }
  }, [props.showContextMenuBlur]);
  const onClickMoreVert = () => {
    setShowContextMenu(true);
    props.setShowContextMenuBlur(true);
  };

  const deleteBookmark = () => {
    console.log('delete');
    const bookmark: Bookmark = new Bookmark();
    bookmark.delete(props.item.id);
    setShowContextMenu(false);
  };

  const shareFolder = () => {};

  return (
    <div
      className={`relative my-1 cursor-pointer rounded-md hover:bg-green-100 ${props.item.id === props.openFolderId ? 'bg-green-100' : ''}`}
      style={{ zIndex: props.parentItemsNumber + 51 - props.index }}
    >
      <BaseLink title={props.item.title} icon={props.item.icon} size='lg' className={'w-[calc(100%-2rem)] px-1 py-1'} />
      <div className='absolute right-0 top-1/2 flex -translate-y-1/2 select-none items-center'>
        <div className='rounded-md bg-gray-50 px-1 py-1'>{props.item.children ? props.item.children.length : 0}</div>
        <MdMoreVert onClick={onClickMoreVert} className='h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-700' />
        <div
          ref={contextMenu}
          className={`absolute right-0 top-7 z-50 w-16 rounded-lg bg-white px-2 py-2 shadow-md ${showContextMenu ? '' : 'hidden'}`}
        >
          <div onClick={shareFolder} className='mb-1 w-full  cursor-pointer rounded-lg px-3 py-1 text-center hover:bg-gray-100'>
            <span>共有</span>
          </div>
          <div onClick={deleteBookmark} className='w-full cursor-pointer rounded-lg px-3 py-1 text-center hover:bg-gray-100'>
            <span>削除</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ColumnLink;
