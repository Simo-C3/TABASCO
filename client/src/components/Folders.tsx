import React, { useState } from 'react';
import type { Folder } from '../types';
import { MdExpandMore } from 'react-icons/md';
import BaseFolder from './BaseFolder';
import { useBookmark } from '../context/bookmark';

type FoldersPropsType = {
  folders: Folder[];
  onSelected: (id: number) => void;
};

const Folders = React.memo(({ folders, onSelected }: FoldersPropsType) => {
  const { bookmark } = useBookmark();
  const [newFolderTitle, setNewFolderTitle] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);

  const createNewFolder = async () => {
    const icon = '';
    const id = await bookmark.create({
      title: newFolderTitle,
      icon,
    });

    onSelected(id);
    setNewFolderTitle('');
    setCurrentFolder({
      id,
      title: newFolderTitle,
      icon,
    });
  };

  return (
    <div>
      <div
        id='selected-folder'
        className='flex cursor-pointer items-center justify-between border-b border-solid border-gray-100 py-2'
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        <span className='text-base'>Add to</span>
        <div className='flex items-center'>
          {currentFolder && <BaseFolder {...currentFolder} />}
          <MdExpandMore className='mx-1 text-lg' />
        </div>
      </div>
      <div id='folder-selector' className={`overflow-hidden transition-all ${isOpen ? 'open' : ''}`}>
        <input
          value={newFolderTitle}
          onChange={(e) => {
            setNewFolderTitle(e.target.value);
          }}
          className='mb-2 w-full rounded-lg bg-gray-200 px-3 py-1'
        />
        {folders?.map(
          (folder, index) =>
            folder.title.includes(newFolderTitle) && (
              <BaseFolder
                key={index}
                {...folder}
                onClick={() => {
                  onSelected(folder.id);
                  setCurrentFolder(folder);
                }}
              />
            ),
        )}
        {newFolderTitle !== '' && (
          <div className='border-black' onClick={() => createNewFolder()}>
            新しいフォルダーを作成: {newFolderTitle}
          </div>
        )}
      </div>
    </div>
  );
});

export default Folders;
