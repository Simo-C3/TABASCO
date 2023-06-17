import React from 'react';
import { Bookmark } from '../helper/storage';

interface Share {
  title: string;
  pages: {
    title: string;
    url: string;
  }[];
}
const apiShareRequest = async (id: string): Promise<Share> => {
  const result = await fetch(`https://tabasco-server.kurichi.workers.dev/api/v1/share/${id}`);
  return await result.json();
};

const ShareImport = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const ref = React.useRef<HTMLInputElement>(null);
  const getShare = () => {
    const id = ref.current?.value;
    if (id) {
      console.log('ShareImport');
      apiShareRequest(id).then(async (result) => {
        console.log(result);

        const bookmark = new Bookmark();
        const groupId = await bookmark.create({
          title: result.title,
        });
        for (const page of result.pages) {
          await bookmark.create({
            title: page.title,
            url: page.url,
            parentId: groupId,
          });
          onClose();
        }
      });
    }
  };

  return (
    <>
      {isOpen && (
        <>
          <div className='absolute left-1/2 top-1/2 z-[60] flex h-52 w-80 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border bg-white py-3'>
            <div className='flex w-full flex-col items-center justify-center text-center !text-gray-700'>
              <span className='pb-6 text-lg'>共有</span>
              <input
                ref={ref}
                placeholder='共有IDを入力してください'
                className='mb-10 w-full max-w-[260px] rounded-md border-none bg-gray-100 px-2 py-1 outline-none'
              />
              <div className='cursor-pointer select-none rounded-lg bg-green-200 px-2 py-1 text-gray-700' onClick={getShare}>
                ブックマークを取り込む
              </div>
            </div>
          </div>
          <div className='absolute left-0 top-0 z-50 h-screen w-screen bg-gray-700 opacity-40' onClick={onClose}></div>
        </>
      )}
    </>
  );
};

export default ShareImport;
