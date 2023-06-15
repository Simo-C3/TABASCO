import React, { RefObject, useEffect, useRef, useState, createRef } from 'react';
import ReactDOM, { render } from 'react-dom';
import ColumnItem from './columnItem';

import { Bookmark } from '../helper/storage';
import { Bookmarks } from '../types';

type Props = {
  rerendering: (status: boolean) => void;
};

const Column = (props: Props) => {
  const leftContentKey = useRef<number>(0);
  const columnItems = useRef<HTMLDivElement>(null);

  const [openFolders, setOpenFolders] = useState<Bookmarks[]>([]);
  const [focusColumnIndex, setFocusColumnIndex] = useState<number>(0);

  const initAsync = async () => {
    // ストレージからフォルダ一覧を取得
    const bookmark = new Bookmark();
    const folderTree = await bookmark.getBookmarkTree();
    setOpenFolders([folderTree]);
  };

  useEffect(() => {
    initAsync();
  }, []);

  // useEffect(() => {
  //   // removeEventListeners();
  //   // フォルダを開いたら再描画
  //   render();
  //   // フォルダを開いたらイベントリスナーを再登録
  //   // addEventListeners();
  // }, [openFolders]);

  const openFolder = (columnIndex: number, folderId: number) => {
    const newOpenFolder = openFolders[columnIndex].children?.find((folder: Bookmarks) => {
      return folder.id === folderId;
    });
    if (columnIndex < openFolders.length - 1) {
      const newOpenFolders = openFolders.slice(0, columnIndex + 1);
      setOpenFolders([...newOpenFolders, newOpenFolder!]);
    } else {
      setOpenFolders([...openFolders, newOpenFolder!]);
    }
    console.log(openFolders);
  };

  // const onFocus = (columnIndex: number) => {
  //   setFocusColumnIndex(columnIndex);
  // };

  // const render = () => {
  //   const children = Array.from(columnItems.current!.children);
  //   for (const item of children) {
  //     columnItems.current!.removeChild(item);
  //   }
  //   leftFrame.current = [];
  //   splitter.current = [];

  //   openFolders.forEach((folder, index) => {
  //     const child = document.createElement('div');
  //     columnItems.current!.appendChild(child);

  //     ReactDOM.render(
  //       <ColumnItem
  //         index={index}
  //         leftContentKey={leftContentKey.current}
  //         openFolderId={index + 1 < openFolders.length ? openFolders[index + 1].id : -1}
  //         folderItems={folder.children!}
  //         onFocus={onFocus}
  //         openFolder={openFolder}
  //       />,
  //       child,
  //     );
  //   });
  // };

  return (
    <div ref={columnItems} className='flex h-full w-fit min-w-full'>
      {openFolders.map((folder, index) => {
        return (
          <ColumnItem
            key={index}
            index={index}
            isFocus={index === focusColumnIndex}
            openFolderId={index + 1 < openFolders.length ? openFolders[index + 1].id : -1}
            folderItems={folder.children!}
            onClick={() => {
              setFocusColumnIndex(index);
            }}
            openFolder={openFolder}
          />
        );
      })}
    </div>
  );
};

export default Column;
