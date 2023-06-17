import React, { memo, useEffect, useState } from 'react';
import BaseFolder from './BaseFolder';
import { Bookmarks } from '../types';
import { MdMoreVert } from 'react-icons/md';
import { Bookmark } from '../helper/storage';

type Props = {
  index: number;
  columnIndex: number;
  parentItemsNumber: number;
  openFolderId?: number;
  item: Bookmarks;
  openFolder: (folderId: number, columnIndex: number) => void;
  setShowContextMenuBlur: (show: boolean) => void;
  showContextMenuBlur: boolean;
};

const ColumnFolder = memo((props: Props) => {
  const contextMenu = React.createRef<HTMLDivElement>();
  const [showContextMenu, setShowContextMenu] = useState<boolean>(false);
  const MoreVertRef = React.createRef<HTMLDivElement>();

  const onClickMoreVert = () => {
    setShowContextMenu(true);
    props.setShowContextMenuBlur(true);
  };

  useEffect(() => {
    if (!props.showContextMenuBlur) {
      setShowContextMenu(props.showContextMenuBlur);
    }
  }, [props.showContextMenuBlur]);

  const deleteBookmark = () => {
    console.log('delete');
    const bookmark: Bookmark = new Bookmark();
    bookmark.delete(props.item.id);
    setShowContextMenu(false);
  };

  const shareFolder = () => {
    fetch('https://tabasco-server.kurichi.workers.dev/api/v1/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: props.item.title,
        pages: props.item.children
          ?.filter((o) => o.type === 'page')
          .map((child) => ({
            title: child.title,
            url: child.url,
          })),
      }),
    }).then(async (res) => {
      const json = await res.json();
      const id = json.id;
      console.log(id);

      await navigator.clipboard.writeText(id);
      alert('The ID for sharing has been copied to the clipboard.');
    });
  };

  return (
    <div
      className={`relative my-1 cursor-pointer rounded-md hover:bg-red-100 ${props.item.id === props.openFolderId ? 'bg-red-100' : ''}`}
      style={{ zIndex: props.parentItemsNumber + 101 - props.index }}
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
        <div ref={MoreVertRef} onClick={onClickMoreVert} className='cursor-pointer text-gray-400 hover:text-gray-700'>
          <MdMoreVert className='h-4 w-4' />
        </div>
        <div
          ref={contextMenu}
          className={`absolute right-0 top-7 z-[60] w-20 rounded-lg bg-white px-2 py-2 shadow-md ${showContextMenu ? '' : 'hidden'}`}
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

export default ColumnFolder;
