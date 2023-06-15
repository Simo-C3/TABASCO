import React, { RefObject, createRef, useEffect, useRef, useState } from 'react';
import { Bookmarks } from '../types';

import BaseFolder from './BaseFolder';
import BaseLink from './BaseLink';
import { MdChevronRight } from 'react-icons/md';

type Props = {
  index: number;
  leftContentKey: number;
  openFolderId?: number;
  folderItems: Bookmarks[];
  leftFrame: RefObject<HTMLDivElement>;
  splitter: RefObject<HTMLDivElement>;
  className?: string;
  openFolder: (columnIndex: number, folderId: number) => void;
  rerendering: (status: boolean) => void;
};

const ColumnItem = (props: Props) => {
  const folders = useRef<Bookmarks[]>([]);
  const pages = useRef<Bookmarks[]>([]);
  const folderElements = useRef<RefObject<HTMLDivElement>[]>([]);

  const newFolderElement = useRef<HTMLInputElement>(null);
  const newFolderTitleElement = useRef<HTMLInputElement>(null);
  const showNewFolderTitleElement = useRef<boolean>(false);

  const folderElementsEventListeners = new Map<HTMLDivElement, (event: MouseEvent) => void>();

  folders.current = props.folderItems.filter((item) => {
    return item.type === 'folder';
  });

  pages.current = props.folderItems.filter((item) => {
    return item.type === 'page';
  });

  folders.current.forEach((_, index) => {
    folderElements.current[index] = createRef<HTMLDivElement>();
  });

  useEffect(() => {
    folders.current.forEach((folder, index) => {
      folderElements.current[index].current!.addEventListener('click', folderClickHandler(folder.id), false);
      folderElementsEventListeners.set(folderElements.current[index].current!, folderClickHandler(folder.id));
    });

    if (newFolderElement.current) newFolderElement.current!.addEventListener('click', newFolderClickHandler, false);

    return () => {
      for (const [element, event] of folderElementsEventListeners) {
        element.removeEventListener('click', event);
      }
      newFolderElement.current!.removeEventListener('click', newFolderClickHandler, false);
    };
  }, []);

  const folderClickHandler = (id: number) => {
    return (event: MouseEvent) => {
      props.openFolder(props.index, id);
      newFolderElement.current?.addEventListener('click', newFolderClickHandler, false);
    };
  };

  const newFolderClickHandler = (event: MouseEvent) => {
    console.log('newFolderClickHandler');
    showNewFolderTitleElement.current = true;
    props.rerendering(true);
    if (newFolderTitleElement.current) newFolderTitleElement.current!.addEventListener('blur', newFolderTitleBlurHandler, false);
    newFolderTitleElement.current!.focus();
  };

  const newFolderTitleBlurHandler = () => {
    showNewFolderTitleElement.current = false;
    newFolderTitleElement.current!.value = '';
    if (newFolderTitleElement.current) newFolderTitleElement.current!.removeEventListener('blur', newFolderTitleBlurHandler, false);
    props.rerendering(true);
  };

  return (
    <>
      <div
        key={props.index}
        ref={props.leftFrame}
        className={`relative h-full basis-80 overflow-y-auto overflow-x-hidden bg-white px-3 ${
          props.leftContentKey === props.index ? 'pb-6 pt-3' : 'py-3'
        } ${props.className}`}
      >
        {props.leftContentKey === props.index && showNewFolderTitleElement.current ? (
          <div className='my-2 flex w-full items-center px-1'>
            <MdChevronRight className='h-5 w-5' />
            <input ref={newFolderTitleElement} className='mx-1 w-[calc(100%-1.25rem)] rounded-lg bg-gray-100 px-2 py-1' />
          </div>
        ) : null}
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
            />
          );
        })}
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
          ref={props.splitter}
          className='absolute right-0 top-0 h-full w-[6px] cursor-col-resize bg-white'
        />
        {props.leftContentKey === props.index ? (
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
