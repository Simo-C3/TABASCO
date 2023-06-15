import React, { useEffect, useRef } from 'react';
import type { Folder } from '../types';
import { MdExpandMore } from 'react-icons/md';
import ReactDOM from 'react-dom';
import BaseFolder from './BaseFolder';
import { Bookmark } from '../helper/storage';
import { RootId } from '../config';

type FoldersPropsType = {
  folders: Folder[];
  onSelected: (id: number) => void;
};

const Folders = ({ folders, onSelected }: FoldersPropsType) => {
  const selectedFolderContainer = useRef<HTMLDivElement>(null);
  const selectedFolder = useRef<HTMLDivElement>(null);
  const folderContainer = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const folderElement = useRef<HTMLDivElement>(null);
  const newFolder = useRef<HTMLDivElement>(null);

  const childEventListeners = new Map<HTMLDivElement, () => void>();

  let isOpen = false;

  useEffect(() => {
    // フォルダ一覧を描画
    renderFolders(folders);

    if (folders.length === 0) {
      ReactDOM.render(<BaseFolder title='' icon='' size='lg' />, selectedFolder.current);
    } else {
      ReactDOM.render(<BaseFolder title={folders[0].title} icon={folders[0].icon} size='lg' />, selectedFolder.current);
    }

    selectedFolderContainer.current?.addEventListener('click', openFolderToggle);
    input.current?.addEventListener('input', searchFolder);
    newFolder.current?.addEventListener('click', createFolder);

    return () => {
      // イベントを削除
      for (const [element, event] of childEventListeners) {
        element.removeEventListener('click', event);
      }
      selectedFolderContainer.current?.removeEventListener('click', openFolderToggle);
      newFolder.current?.removeEventListener('click', createFolder);
    };
  }, []);

  const openFolderToggle = () => {
    isOpen = !isOpen;
    if (isOpen) {
      folderContainer.current?.classList.add('open');
    } else {
      folderContainer.current?.classList.remove('open');
    }
  };

  const searchFolder = (e: Event) => {
    const keyword = (e.target as HTMLInputElement).value;
    if (keyword === '') {
      newFolder.current?.classList.add('hidden');
    } else {
      newFolder.current?.classList.remove('hidden');
      newFolder.current!.textContent = `新しいフォルダーを作成: ${keyword}`;
    }
    const children = folderElement.current?.children!;
    for (const child of children) {
      const title = child.textContent;
      if (title && title.includes(keyword)) {
        child.classList.remove('hidden');
      } else {
        child.classList.add('hidden');
      }
    }
  };

  const createFolder = async () => {
    const bookmark = new Bookmark();
    const title = input.current?.value!;
    if (title === '') return;

    const icon = '';
    const id = await bookmark.create({
      title: title,
      icon: icon,
    });

    ReactDOM.render(<BaseFolder title={title} icon={icon} size='lg' />, selectedFolder.current);
    onSelected(id);
    const folders = await bookmark.getFolders();
    renderFolders(folders);
    input.current!.value = '';
  };

  const renderFolders = (folders: Folder[]) => {
    const children = folderElement.current?.children!;
    for (const child of children) {
      const event = childEventListeners.get(child as HTMLDivElement);
      if (event) {
        child.removeEventListener('click', event);
        folderElement.current?.removeChild(child);
        childEventListeners.delete(child as HTMLDivElement);
      }
    }

    for (const folder of folders) {
      const child = document.createElement('div');
      const clickEvent = () => {
        ReactDOM.render(<BaseFolder title={folder.title} icon={folder.icon} size='lg' />, selectedFolder.current);
        onSelected(folder.id);
      };
      child.addEventListener('click', clickEvent);
      childEventListeners.set(child, clickEvent);
      ReactDOM.render(<BaseFolder title={folder.title} icon={folder.icon} />, child);
      folderElement.current?.appendChild(child);
    }
  };

  return (
    <div>
      <div
        id='selected-folder'
        ref={selectedFolderContainer}
        className='flex cursor-pointer items-center justify-between border-b border-solid border-gray-100 py-2'
      >
        <span className='text-base'>Add to</span>
        <div className='flex items-center'>
          <div ref={selectedFolder} />
          <MdExpandMore className='mx-1 text-lg' />
        </div>
      </div>
      <div id='folder-selector' ref={folderContainer} className='overflow-hidden transition-all'>
        <input ref={input} className='mb-2 w-full rounded-lg bg-gray-200 px-3 py-1' />
        <div ref={folderElement} />
        <div ref={newFolder} className='hidden border-black'>
          新しいフォルダーを作成
        </div>
      </div>
    </div>
  );
};

export default Folders;
