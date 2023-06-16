import React, { useEffect, useRef, useState } from 'react';
import './index.css';
import { Bookmark } from './helper/storage';
import { RootId } from './config';
import Folders from './components/Folders';
import Summary from './components/Summary';
import { getTextByBody } from './helper/summary';
import { createRoot } from 'react-dom/client';
import { BaseBookmark, BookmarkID, Folder, NewBookMark } from './types';

const Popup = () => {
  let bodyText = '';
  let summary = { isEnabled: false, format: 'default', language: 'jp' };

  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderID, setCurrentFolderID] = useState<BookmarkID>(RootId);
  const [summarizing, setSummarizing] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [icon, setIcon] = useState<string>('');

  const titleInput = useRef<HTMLInputElement>(null);

  const getTabInfo = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    setUrl(activeTab.url!);
    setIcon(activeTab.favIconUrl!);
    titleInput.current!.value = activeTab.title!;
    titleInput.current?.select();

    const tabId = activeTab.id;
    const bodies = await chrome.scripting.executeScript({
      target: { tabId: tabId! },
      func: getTextByBody,
    });
    bodyText = bodies[0].result;
  };

  const asyncInit = async () => {
    // ストレージからフォルダ一覧を取得
    const bookmark = new Bookmark();
    const folders = await bookmark.getFolders();
    setFolders(folders);

    const unsubscribe = bookmark.onChanged<BaseBookmark[]>('array', () => {
      bookmark.getFolders().then((folders) => {
        setFolders(folders);
      });
    });

    return () => {
      unsubscribe();
    };
  };

  useEffect(() => {
    getTabInfo();
    asyncInit();
  }, []);

  const addBookmark = async () => {
    const bookmark = new Bookmark();
    const title = titleInput.current!.value;
    const data: NewBookMark = { title, url, parentId: currentFolderID, icon };
    if (summary.isEnabled) {
      data.summary = summaryText;
    }
    await bookmark.create(data);

    window.close();
  };

  const clearBookmark = async () => {
    const bookmark = new Bookmark();
    await bookmark.clear();
    window.close();
  };

  const summarize = () => {
    setSummarizing(true);
    fetch('https://tabasco-server.kurichi.workers.dev/api/v1/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: titleInput.current!.value,
        text: bodyText,
      }),
    })
      .then(async (res) => {
        const json = await res.json();
        setSummaryText(json.text);
        setSummarizing(false);
      })
      .catch((err) => {
        setSummaryText('要約に失敗しました');
        setSummarizing(false);
      });
  };

  return (
    <>
      <div className='w-80 overflow-hidden rounded-xl px-3 py-3 text-gray-600'>
        <div className='border-b border-solid border-gray-100 pb-3 text-sm'>
          <input ref={titleInput} autoFocus className='w-full rounded-lg bg-gray-200 px-3 py-2' />
        </div>
        <Folders
          folders={folders}
          onSelected={(id) => {
            setCurrentFolderID(id);
          }}
        />
        <Summary
          onChange={(v) => {
            summary = v;
          }}
        />
        <div className='my-2 flex items-center justify-between py-1 text-base'>
          <div className='flex items-center'>
            <input id='summary-input' type='checkbox' className='mx-3' />
            <span>リマインド</span>
          </div>
          <select name='language' id='summary-language-select'>
            <option value='1d'>1日後</option>
            <option value='2d'>2日後</option>
          </select>
        </div>
        <div className='mt-5 flex items-center justify-around text-base'>
          <button
            className='pointer-events-auto block cursor-pointer rounded-lg bg-blue-600 px-7 py-1 text-white'
            id='storage-clear-button'
            onClick={summarize}
            disabled={summarizing}
          >
            {summarizing ? '要約中...' : '要約'}
          </button>
          <button
            className='pointer-events-auto block cursor-pointer rounded-lg bg-green-600 px-7 py-1 text-white'
            id='add-bookmark-button'
            onClick={addBookmark}
          >
            追加
          </button>
        </div>
        <button className='' onClick={clearBookmark} id='storage-clear-button'>
          clear
        </button>
        <div>{summaryText}</div>
      </div>
    </>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Popup />);
