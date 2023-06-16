import React, { useEffect, useState } from 'react';
import ColumnItem from './columnItem';

import { Bookmark } from '../helper/storage';
import { Bookmarks } from '../types';

type Props = {
  updateBookmarks: () => Promise<void>;
};

const Column = (props: Props) => {
  const [openFolders, setOpenFolders] = useState<Bookmarks[]>([]);
  const [focusColumnIndex, setFocusColumnIndex] = useState<number>(0);

  useEffect(() => {
    const f = async () => {
      const bookmark = new Bookmark();
      const folderTree = await bookmark.getBookmarkTree();
      setOpenFolders([folderTree]);
      bookmark.onChanged<Bookmarks>('tree', (changeInfo: Bookmarks) => {
        setOpenFolders((prev) => {
          const newOpenFolders: Bookmarks[] = [];
          var newFolders: Bookmarks[] = [changeInfo];
          prev.forEach((folder) => {
            newFolders.forEach((newFolder) => {
              if (folder.id === newFolder.id) {
                newOpenFolders.push(newFolder);
                newFolders = newFolder.children!;
              }
            });
          });
          return [...newOpenFolders];
        });
      });
    };
    f();
  }, []);

  useEffect(() => {
    const optionContent = document.getElementById('option-content');
    if (optionContent) {
      optionContent.scrollLeft = optionContent.scrollWidth;
    }
  });

  const openFolder = (folderId: number, columnIndex: number) => {
    if (openFolders[columnIndex].children) {
      const newOpenFolder = openFolders[columnIndex].children?.find((folder) => {
        return folder.id === folderId;
      })!;
      const parentFolders = openFolders.slice(0, columnIndex + 1);
      setOpenFolders([...parentFolders, newOpenFolder]);
    }
  };

  return (
    <div className='flex h-full w-fit min-w-full'>
      {openFolders.map((folder, index) => {
        return (
          <ColumnItem
            key={index}
            index={index}
            parentId={folder.id}
            isFocus={index === focusColumnIndex}
            openFolderId={index + 1 < openFolders.length ? openFolders[index + 1].id : -1}
            folderItems={folder.children!}
            onClick={() => {
              setFocusColumnIndex(index);
            }}
            openFolder={openFolder}
            updateBookmarks={props.updateBookmarks}
          />
        );
      })}
    </div>
  );
};

export default Column;
