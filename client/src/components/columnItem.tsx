import React, { RefObject, createRef, useEffect, useRef, useState } from 'react';
import { Bookmarks } from '../types';

import BaseFolder from './BaseFolder';
import BaseLink from './BaseLink';
import { MdChevronRight } from 'react-icons/md';
import { render } from 'react-dom';

type Props = {
  index: number;
  isFocus: boolean;
  openFolderId?: number;
  folderItems: Bookmarks[];
  className?: string;
  onClick?: (e: MouseEvent) => void;
  openFolder: (columnIndex: number, folderId: number) => void;
};

const ColumnItem = (props: Props) => {
  const folders = useRef<Bookmarks[]>([]);
  const pages = useRef<Bookmarks[]>([]);
  const folderElements = useRef<RefObject<HTMLDivElement>[]>([]);

  const newFolderElement = useRef<HTMLInputElement>(null);
  const newFolderTitleElement = useRef<HTMLInputElement>(null);
  const newFolderTitleContainer = useRef<HTMLDivElement>(null);
  const showNewFolderTitleElement = useRef<boolean>(false);
  const leftFrame = useRef<HTMLDivElement>(null);
  const splitter = useRef<HTMLDivElement>(null);

  folders.current = props.folderItems.filter((item) => {
    return item.type === 'folder';
  });

  pages.current = props.folderItems.filter((item) => {
    return item.type === 'page';
  });

  useEffect(() => {
    // folders.current.forEach((folder, index) => {
    //   const event = folderClickHandler(folder.id);
    //   folderElements.current[index].current!.addEventListener('click', event, false);
    //   folderElementsEventListeners.set(folderElements.current[index].current!, event);
    // });

    console.log(props.index, props.isFocus);
    newFolderElement.current?.addEventListener('click', newFolderClickHandler, false);
    props.onClick && leftFrame.current?.addEventListener('click', props.onClick, false);
    splitter.current?.addEventListener('mousedown', onMouseDownHandler, false);

    return () => {
      console.log('return', props.index);
      // for (const [element, event] of folderElementsEventListeners) {
      //   element.removeEventListener('click', event);
      // }
      // folderElementsEventListeners.clear();
      newFolderElement.current?.removeEventListener('click', newFolderClickHandler, false);
    };
  }, [props.isFocus]);

  // const folderClickHandler = (id: number) => {
  //   return () => {
  //     props.openFolder(props.index, id);
  //   };
  // };

  // const onLeftFrameMouseClickHandler = () => {
  //   props.onClick();
  //   leftFrame.current!.style.border = '3px solid rgb(255, 246, 246)';
  // };

  const newFolderClickHandler = () => {
    console.log('newFolderClickHandler');
    showNewFolderTitleElement.current = true;
    if (newFolderTitleElement.current) newFolderTitleElement.current!.addEventListener('blur', newFolderTitleBlurHandler, false);
    newFolderTitleContainer.current?.classList.remove('hidden');
    newFolderTitleElement.current!.focus();
  };

  const newFolderTitleBlurHandler = () => {
    showNewFolderTitleElement.current = false;
    newFolderTitleElement.current!.value = '';
    newFolderTitleContainer.current?.classList.add('hidden');
    if (newFolderTitleElement.current) newFolderTitleElement.current!.removeEventListener('blur', newFolderTitleBlurHandler, false);
  };

  const onMouseDownHandler = () => {
    const body = document.body;
    body.style.cursor = 'col-resize';

    // ドラッグ開始
    document.addEventListener('mousemove', onMouseMoveHandler, false);
    // マウスアップしたらドラッグ終了
    document.addEventListener('mouseup', onMouseUpHandler, false);
  };

  const onMouseUpHandler = () => {
    document.removeEventListener('mousemove', onMouseMoveHandler, false);
    const body = document.body;
    body.style.cursor = 'auto';
    document.removeEventListener('mouseup', onMouseUpHandler, false);
  };

  // 対象のleftFrameのサイズを変更する
  const onMouseMoveHandler = (event: MouseEvent) => {
    // leftFrameの位置を取得
    const leftFramePosition = leftFrame.current!.getBoundingClientRect();
    // 更新後のleftFrameサイズを計算
    const size = Math.floor(event.clientX - leftFramePosition.x - 3);
    const newSize = size < 200 ? '200px' : `${size}px`;
    // leftFrameのサイズを更新
    leftFrame.current!.style.width = newSize;
  };

  return (
    <>
      <div
        key={props.index}
        ref={leftFrame}
        className={`relative h-full w-[320px] overflow-y-auto overflow-x-hidden bg-white px-3 ${
          props.isFocus ? '3px solid rgb(255, 246, 246) pb-6 pt-3' : 'py-3'
        } ${props.className}`}
      >
        {/* 新しいファイルの名前入力 */}
        <div ref={newFolderTitleContainer} className='my-2 flex hidden w-full items-center px-1'>
          <MdChevronRight className='h-5 w-5' />
          <input ref={newFolderTitleElement} className='mx-1 w-[calc(100%-1.25rem)] rounded-lg bg-gray-100 px-2 py-1' />
        </div>
        {/* フォルダの表示 */}
        {folders.current.map((item: Bookmarks, index: number) => {
          return (
            <BaseFolder
              key={index}
              id={item.id}
              columnId={props.index}
              status='close'
              title={item.title}
              icon={item.icon}
              size='lg'
              folderElement={folderElements.current[index]}
              className={`my-1 cursor-pointer rounded-md px-1 py-1 hover:bg-red-100 ${item.id === props.openFolderId ? 'bg-red-100' : ''}`}
              onClick={() => {
                props.openFolder(props.index, item.id);
              }}
            />
          );
        })}
        {/* ページの表示 */}
        {pages.current.map((item: Bookmarks, index: number) => {
          return (
            <BaseLink
              key={index}
              title={item.title}
              link={item.url}
              icon={item.icon}
              size='lg'
              className='my-1 rounded-md px-1 py-1 pl-6 pr-1 hover:bg-red-100'
            />
          );
        })}
        <div
          id={`splitter-${props.index}`}
          key={props.index}
          ref={splitter}
          className='absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-gray-500'
        />
        {props.isFocus ? (
          <div
            ref={newFolderElement}
            id='new-folder-element'
            className='sticky bottom-1 left-1/2 m-0 w-32 -translate-x-1/2 cursor-pointer select-none rounded-lg bg-white px-3 py-1 text-center drop-shadow-md'
          >
            新しいフォルダ
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ColumnItem;
