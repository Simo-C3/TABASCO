import React, { RefObject, useEffect, useRef, useState, createRef } from 'react';
import ColumnItem from './columnItem';

import { Bookmark } from '../helper/storage';
import { BaseBookmark, Bookmarks } from '../types';
import { RootId } from '../config';

type Props = {
  rerendering: (status: boolean) => void;
};

const Column = (props: Props) => {
  const leftFrame = useRef<RefObject<HTMLDivElement>[]>([]);
  const splitter = useRef<RefObject<HTMLDivElement>[]>([]);
  const leftContentKey = useRef<number>(0);
  const columnItems = useRef<HTMLDivElement>(null);

  const [openFolders, setOpenFolders] = useState<Bookmarks[]>([]);

  const onMouseDownEventListeners = new Map<HTMLDivElement, (event: MouseEvent) => void>();
  const onMouseClickEventListeners = new Map<HTMLDivElement, (event: MouseEvent) => void>();

  openFolders.forEach((_, index) => {
    leftFrame.current[index] = createRef<HTMLDivElement>();
    splitter.current[index] = createRef<HTMLDivElement>();
  });

  const initAsync = async () => {
    // ストレージからフォルダ一覧を取得
    const bookmark = new Bookmark();
    const folderTree = await bookmark.getBookmarkTree();
    setOpenFolders([folderTree]);
    removeEventListeners();
    addEventListeners();
    selectedLeftFrameHandler();
  };

  useEffect(() => {
    initAsync();

    return () => {
      removeEventListeners();
    };
  }, []);

  useEffect(() => {
    // フォルダを開いたら再描画
    props.rerendering(true);
    // フォルダを開いたらイベントリスナーを再登録
    addEventListeners();
  }, [openFolders]);

  const addEventListeners = () => {
    // 全てのスプリッターのマウスダウンイベントを登録
    splitter.current.forEach((item, index) => {
      const func = onMouseDownHandler(index);
      if (item.current) item.current.addEventListener('mousedown', func, false);
      onMouseDownEventListeners.set(item.current!, func);
    });
    leftFrame.current.forEach((item, index) => {
      const func = onLeftFrameMouseClickHandler(index);
      if (item.current) item.current.addEventListener('click', func, false);
      onMouseClickEventListeners.set(item.current!, func);
    });
  };

  const removeEventListeners = () => {
    for (const [element, event] of onMouseDownEventListeners) {
      if (element) element.removeEventListener('mousedown', event, false);
    }
    for (const [element, event] of onMouseClickEventListeners) {
      if (element) element.removeEventListener('click', event, false);
    }
    onMouseDownEventListeners.clear();
    document.removeEventListener('mouseup', onMouseUpHandler, false);
  };

  const selectedLeftFrameHandler = () => {
    leftFrame.current.forEach((item, key) => {
      if (key === leftContentKey.current) {
        if (item.current) item.current.style.border = '3px solid rgb(255, 246, 246)';
      } else {
        if (item.current) item.current.style.borderColor = 'white';
      }
    });
  };

  const onLeftFrameMouseClickHandler = (index: number) => {
    return (event: MouseEvent) => {
      console.log(index);
      leftContentKey.current = index;
      selectedLeftFrameHandler();
      props.rerendering(true);
    };
  };

  const onMouseDownHandler = (key: number) => {
    return (event: MouseEvent) => {
      console.log(key);
      leftContentKey.current = key;

      const body = document.body;
      body.style.cursor = 'col-resize';

      // ドラッグ開始
      document.addEventListener('mousemove', onMouseMoveHandler, false);
      // マウスアップしたらドラッグ終了
      document.addEventListener('mouseup', onMouseUpHandler, false);
    };
  };

  const onMouseUpHandler = () => {
    document.removeEventListener('mousemove', onMouseMoveHandler, false);
    const body = document.body;
    body.style.cursor = 'auto';
  };

  // 対象のleftFrameのサイズを変更する
  const onMouseMoveHandler = (event: MouseEvent) => {
    // leftFrameの位置を取得
    const leftFramePosition = leftFrame.current![leftContentKey.current].current!.getBoundingClientRect();
    // 更新後のleftFrameサイズを計算
    const size = Math.floor(event.clientX - leftFramePosition.x - 3);
    const newSize = size < 200 ? '200px' : `${size}px`;
    // leftFrameのサイズを更新
    leftFrame.current![leftContentKey.current].current!.style.flexBasis = newSize;
  };

  const openFolder = (columnIndex: number, folderId: number) => {
    const newOpenFolder = openFolders[columnIndex].children?.find((folder: Bookmarks) => {
      return folder.id === folderId;
    });
    removeEventListeners();
    if (columnIndex + 1 < openFolders.length) {
      const newOpenFolders = openFolders.slice(0, columnIndex + 1);
      setOpenFolders([...newOpenFolders, newOpenFolder!]);
    } else {
      setOpenFolders([...openFolders, newOpenFolder!]);
    }
  };

  return (
    <>
      <div ref={columnItems} className='flex h-full w-fit min-w-full'>
        {openFolders.map((item: Bookmarks, index: number) => {
          return item?.children ? (
            <ColumnItem
              index={index}
              leftContentKey={leftContentKey.current}
              openFolderId={index + 1 < openFolders.length ? openFolders[index + 1].id : -1}
              parentID={item.id}
              folderItems={item?.children}
              leftFrame={leftFrame.current![index]}
              splitter={splitter.current![index]}
              openFolder={openFolder}
              rerendering={props.rerendering}
            />
          ) : null;
        })}
      </div>
    </>
  );
};

export default Column;
