import React, { MouseEventHandler, memo, useEffect, useRef, useState } from 'react';
import { MdChevronRight, MdFolderOpen } from 'react-icons/md';

import { Bookmarks } from '../types';
import { Bookmark } from '../helper/storage';
import ColumnFolder from './ColumnFolder';
import ColumnLink from './ColumnLink';

type Props = {
  index: number;
  parentId: number;
  isFocus: boolean;
  openFolderId?: number;
  folderItems: Bookmarks[];
  className?: string;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  openFolder: (folderId: number, columnIndex: number) => void;
  updateBookmarks: () => Promise<void>;
};

const ColumnItem = memo((props: Props) => {
  const leftFrame = useRef<HTMLDivElement>(null);
  const newFolderTitleInput = useRef<HTMLInputElement>(null);
  const columnItemList = useRef<HTMLDivElement>(null);

  const [folders, setFolders] = useState<Bookmarks[]>([]);
  const [pages, setPages] = useState<Bookmarks[]>([]);
  const [showNewFolderTitleContainer, setShowNewFolderTitleContainer] = useState<boolean>(false);
  const [newFolderTitle, setNewFolderTitle] = useState<string>('');
  const [showContextMenuBlur, setShowContextMenuBlur] = useState<boolean>(false);

  useEffect(() => {
    leftFrame.current?.addEventListener('keypress', onWindowClickEventHandler);
  }, []);

  useEffect(() => {
    const folders = props.folderItems.filter((item) => item.type === 'folder');
    setFolders(folders);

    const pages = props.folderItems.filter((item) => item.type === 'page');
    setPages(pages);
  }, [props.folderItems]);

  useEffect(() => {
    newFolderTitleInput.current?.focus();
  }, [showNewFolderTitleContainer]);

  const newFolderClickHandler = () => {
    setShowNewFolderTitleContainer(true);
    newFolderTitleInput.current!.focus();
    columnItemList.current?.scrollTop;
  };

  const newFolderTitleBlurHandler = () => {
    newFolderTitleInput.current!.value = '';
    setShowNewFolderTitleContainer(false);
  };

  const onWindowClickEventHandler = async (event: KeyboardEvent) => {
    if (document.activeElement === newFolderTitleInput.current && newFolderTitleInput.current?.value !== '' && event.key === 'Enter') {
      await AddNewFolder();
    }
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

  const inputOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewFolderTitle(event.target.value);
  };

  const AddNewFolder = async () => {
    const bookmark: Bookmark = new Bookmark();
    await bookmark.create({ title: newFolderTitleInput.current?.value!, parentId: props.parentId });
    newFolderTitleInput.current!.value = '';
    setNewFolderTitle('');
    setShowNewFolderTitleContainer(false);
    props.updateBookmarks();
  };

  return (
    <>
      <div
        key={props.index}
        ref={leftFrame}
        onClick={props.onClick}
        className={`relative h-full w-[320px] overflow-hidden bg-white px-2 pb-0 pt-2 ${props.className}`}
        style={
          props.isFocus
            ? { border: '2px solid rgb(243, 244, 246)' }
            : { border: '2px solid white', borderRight: '1px solid rgb(243, 244, 246)' }
        }
      >
        <div
          ref={columnItemList}
          className={`column-item-scroll h-full overflow-y-auto overflow-x-hidden px-1 ${props.isFocus ? 'pb-16' : 'pb-6'}`}
        >
          {/* 新しいファイルの名前入力 */}
          <div className={`${showNewFolderTitleContainer ? '' : 'hidden'}`}>
            <div className='my-2 flex w-full items-center px-1'>
              <MdChevronRight className='h-5 w-5' />
              <MdFolderOpen className='ml-1 mr-2 h-5 w-5' />
              <input
                ref={newFolderTitleInput}
                value={newFolderTitle}
                onChange={inputOnChangeHandler}
                onBlur={newFolderTitleBlurHandler}
                className='mx-1 w-[calc(100%-3.25rem)] rounded-lg border-none bg-gray-100 px-2 py-1 outline-none'
              />
            </div>
          </div>
          {/* フォルダの表示 */}
          {folders.map((item: Bookmarks, index: number) => {
            return (
              <ColumnFolder
                key={index}
                index={index}
                parentItemsNumber={folders.length}
                openFolderId={props.openFolderId}
                item={item}
                columnIndex={props.index}
                openFolder={props.openFolder}
                setShowContextMenuBlur={setShowContextMenuBlur}
                showContextMenuBlur={showContextMenuBlur}
              />
            );
          })}
          {/* ページの表示 */}
          {pages.map((item: Bookmarks, index: number) => {
            return (
              <ColumnLink
                key={index}
                showContextMenuBlur={showContextMenuBlur}
                index={index}
                parentItemsNumber={folders.length}
                item={item}
                columnIndex={props.index}
                setShowContextMenuBlur={setShowContextMenuBlur}
              />
            );
          })}
        </div>
        <div
          id={`splitter-${props.index}`}
          key={props.index}
          onMouseDown={onMouseDownHandler}
          className='absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-white'
        />
        {props.isFocus ? (
          <div className='absolute  bottom-4 left-1/2 w-full  -translate-x-1/2 py-3'>
            <div
              onClick={newFolderClickHandler}
              id='new-folder-element'
              className='mx-auto my-0 w-32 cursor-pointer select-none rounded-lg bg-white px-3 py-1 text-center drop-shadow-md'
            >
              新しいフォルダ
            </div>
          </div>
        ) : null}
        <div
          onClick={() => {
            setShowContextMenuBlur(false);
          }}
          className={`fixed left-0 top-0 z-[51] h-screen w-screen ${showContextMenuBlur ? '' : 'hidden'}`}
        />
      </div>
    </>
  );
});

export default ColumnItem;
