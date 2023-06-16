import React, { memo, useEffect, useState } from 'react';
import BaseFolder from './BaseFolder';
import { Bookmarks } from '../types';
import { MdMoreVert } from 'react-icons/md';
import BaseLink from './BaseLink';

type Props = {
  index: number;
  columnIndex: number;
  openFolderId?: number;
  item: Bookmarks;
  openFolder: (folderId: number, columnIndex: number) => void;
};

const ColumnLink = memo((props: Props) => {
  const contextMenu = React.createRef<HTMLDivElement>();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);

  const onClickMoreVert = () => {
    setShowContextMenu(true);
  };

  return (
    <div
      className={`relative my-1 cursor-pointer rounded-md hover:bg-green-100 ${props.item.id === props.openFolderId ? 'bg-green-100' : ''}`}
      style={{ zIndex: 1000 - props.index }}
    >
      <BaseLink title={props.item.title} icon={props.item.icon} size='lg' className={'w-[calc(100%-3rem)] px-1 py-1'} />
      <div className='absolute right-0 top-1/2 flex -translate-y-1/2 select-none items-center'>
        <div className='rounded-md bg-gray-50 px-1 py-1'>{props.item.children ? props.item.children.length : 0}</div>
        <MdMoreVert onClick={onClickMoreVert} className='h-4 w-4 cursor-pointer text-gray-400 hover:text-gray-700' />
        <div
          ref={contextMenu}
          className={`absolute right-0 top-7 z-50 w-16 rounded-lg bg-white px-2 py-2 shadow-md ${showContextMenu ? '' : 'hidden'}`}
        >
          <span className='w-full cursor-pointer px-3 py-2 text-center'>削除</span>
        </div>
      </div>
      <div
        onClick={() => {
          setShowContextMenu(false);
        }}
        className={`fixed left-0 top-0 z-40 h-screen w-screen ${showContextMenu ? '' : 'hidden'}`}
      />
    </div>
  );
});

export default ColumnLink;
