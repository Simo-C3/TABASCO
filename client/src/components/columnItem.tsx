import React, { useEffect, useRef, useState } from 'react';
import { MdChevronRight, MdFolderOpen } from 'react-icons/md';

import BaseFolder from './BaseFolder';
import BaseLink from './BaseLink';
import { Bookmarks } from '../types';

type Props = {
  index: number;
  isFocus: boolean;
  openFolderId?: number;
  folderItems: Bookmarks[];
  className?: string;
  onClick?: (e: MouseEvent) => void;
  openFolder: (folderId: number, columnIndex: number) => void;
};

const ColumnItem = (props: Props) => {
  const leftFrame = useRef<HTMLDivElement>(null);
  const splitter = useRef<HTMLDivElement>(null);
  const newFolderButton = useRef<HTMLInputElement>(null);
  const newFolderTitleInput = useRef<HTMLInputElement>(null);
  const newFolderTitleContainer = useRef<HTMLDivElement>(null);

  const [folders, setFolders] = useState<Bookmarks[]>([]);
  const [pages, setPages] = useState<Bookmarks[]>([]);

  useEffect(() => {
    const folders = props.folderItems.filter((item) => item.type === 'folder');
    setFolders(folders);

    const pages = props.folderItems.filter((item) => item.type === 'page');
    setPages(pages);
  }, [props.folderItems]);

  useEffect(() => {
    props.onClick && leftFrame.current?.addEventListener('click', props.onClick, false);
    newFolderButton.current?.addEventListener('click', newFolderClickHandler, false);
    splitter.current?.addEventListener('mousedown', onMouseDownHandler, false);

    return () => {
      props.onClick && leftFrame.current?.addEventListener('click', props.onClick, false);
      newFolderButton.current?.removeEventListener('click', newFolderClickHandler, false);
      splitter.current?.addEventListener('mousedown', onMouseDownHandler, false);
    };
  }, [props.isFocus]);

  const newFolderClickHandler = () => {
    if (newFolderTitleInput.current) newFolderTitleInput.current!.addEventListener('blur', newFolderTitleBlurHandler, false);
    newFolderTitleContainer.current?.classList.remove('hidden');
    newFolderTitleInput.current!.focus();
  };

  const newFolderTitleBlurHandler = () => {
    newFolderTitleInput.current!.value = '';
    newFolderTitleContainer.current?.classList.add('hidden');
    if (newFolderTitleInput.current) newFolderTitleInput.current!.removeEventListener('blur', newFolderTitleBlurHandler, false);
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
        className={`relative h-full w-[320px] overflow-hidden bg-white px-2 pb-0 pt-2 ${props.className}`}
        style={
          props.isFocus
            ? { border: '2px solid rgb(243, 244, 246)' }
            : { border: '2px solid white', borderRight: '1px solid rgb(243, 244, 246)' }
        }
      >
        <div className={`column-item-scroll h-full overflow-y-auto overflow-x-hidden px-1 ${props.isFocus ? 'pb-16' : 'pb-6'}`}>
          {/* 新しいファイルの名前入力 */}
          <div ref={newFolderTitleContainer} className='hidden'>
            <div className='my-2 flex w-full items-center px-1'>
              <MdChevronRight className='h-5 w-5' />
              <MdFolderOpen className='ml-1 mr-2 h-5 w-5' />
              <input
                ref={newFolderTitleInput}
                className='mx-1 w-[calc(100%-3.25rem)] rounded-lg border-none bg-gray-100 px-2 py-1 outline-none'
              />
            </div>
          </div>
          {/* フォルダの表示 */}
          {folders.map((item: Bookmarks, index: number) => {
            return (
              <BaseFolder
                key={index}
                id={item.id}
                status='close'
                title={item.title}
                icon={item.icon}
                size='lg'
                className={`my-1 cursor-pointer rounded-md px-1 py-1 hover:bg-red-100 ${
                  item.id === props.openFolderId ? 'bg-red-100' : ''
                }`}
                onClick={() => {
                  props.openFolder(item.id, index);
                }}
              />
            );
          })}
          {/* ページの表示 */}
          {pages.map((item: Bookmarks, index: number) => {
            return (
              <BaseLink
                key={index}
                title={item.title}
                link={item.url}
                icon={item.icon}
                size='lg'
                className='my-1 rounded-md px-1 py-1 pl-6 pr-1 hover:bg-green-100'
              />
            );
          })}
        </div>
        <div
          id={`splitter-${props.index}`}
          key={props.index}
          ref={splitter}
          className='absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-white'
        />
        {props.isFocus ? (
          <div className='absolute  bottom-4 left-1/2 w-full  -translate-x-1/2 py-3'>
            <div
              ref={newFolderButton}
              id='new-folder-element'
              className='mx-auto my-0 w-32 cursor-pointer select-none rounded-lg bg-white px-3 py-1 text-center drop-shadow-md'
            >
              新しいフォルダ
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ColumnItem;
