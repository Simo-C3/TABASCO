import React, { useEffect, useMemo, useState } from 'react';
import ColumnItem from './columnItem';

import { Bookmark } from '../helper/storage';
import { Bookmarks } from '../types';

const Column = () => {
  const [openFolders, setOpenFolders] = useState<Bookmarks[]>([]);
  const [focusColumnIndex, setFocusColumnIndex] = useState<number>(0);

  useEffect(() => {
    const f = async () => {
      const bookmark = new Bookmark();
      const folderTree = await bookmark.getBookmarkTree();
      setOpenFolders([folderTree]);
    };
    f();
  }, []);

  return (
    <div className='flex h-full w-fit min-w-full'>
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
            openFolder={(folderId) => {
              const newOpenFolder = folder.children?.find((folder) => folder.id === folderId)!;
              const parentFolders = openFolders.slice(0, index + 1);
              setOpenFolders([...parentFolders, newOpenFolder]);
            }}
          />
        );
      })}
    </div>
  );
};

export default Column;
