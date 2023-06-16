import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Bookmark } from './helper/storage';

import Column from './components/column';

const getQueryParam = (url: string, param: string): string | null => {
  const params = new URLSearchParams(new URL(url).search);
  return params.get(param);
};

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

const Options = () => {
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getShare();
  }, []);

  const getShare = () => {
    const url = window.location.href;
    const id = getQueryParam(url, 'id');
    if (id) {
      apiShareRequest(id).then(async (result) => {
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
        }
      });
    }
  };

  return (
    <div className='h-screen w-screen'>
      <div id='option-header' className='z-50 h-16 w-full border border-gray-100 bg-white'></div>
      <div className='flex h-[calc(100vh-4rem)] w-full'>
        <div id='option-sidebar' className='bottom-0 left-0 z-20 h-full w-16 bg-green-100' ref={sidebar}></div>
        <div id='option-content' className='h-full w-[calc(100vw-4rem)] overflow-x-auto overflow-y-hidden bg-white'>
          <Column />
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Options />);
