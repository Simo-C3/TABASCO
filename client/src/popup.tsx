import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Bookmark } from './helper/storage';
import { RootId } from './config';
import Folders from './components/Folders';
import Summary from './components/Summary';
import { getTextByBody } from './helper/summary';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  let url = '';
  let icon = '';
  let selectedFolderID = RootId;
  let summary = { isEnabled: false, format: 'default', language: 'jp' };
  let textToSummarize = '';
  let summarizedText: string;

  // html element references
  const addBookmarkButton = useRef<HTMLButtonElement>(null);
  const clearBookmarkButton = useRef<HTMLButtonElement>(null);
  const summaryButton = useRef<HTMLButtonElement>(null);
  const titleInput = useRef<HTMLInputElement>(null);
  const folderElement = useRef<HTMLDivElement>(null);
  const summaryElement = useRef<HTMLDivElement>(null);

  const asyncInit = async () => {
    // 現在のタブ情報取得
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];
    url = activeTab.url!;
    icon = activeTab.favIconUrl!;
    titleInput.current!.value = activeTab.title || '';
    titleInput.current?.select();

    const tabId = activeTab.id;
    const bodies = await chrome.scripting.executeScript({
      target: { tabId: tabId! },
      func: getTextByBody,
    });
    textToSummarize = bodies[0].result;

    // ストレージからフォルダ一覧を取得
    const bookmark = new Bookmark();
    const folders = await bookmark.getFolders();
    ReactDOM.render(
      <Folders
        folders={folders}
        onSelected={(id) => {
          selectedFolderID = id;
          console.log(selectedFolderID);
        }}
      />,
      folderElement.current,
    );
  };

  useEffect(() => {
    // イベントを登録
    addBookmarkButton.current?.addEventListener('click', addBookmark);
    clearBookmarkButton.current?.addEventListener('click', clearBookmark);
    summaryButton.current?.addEventListener('click', summarize);
    asyncInit();

    return () => {
      addBookmarkButton.current?.removeEventListener('click', addBookmark);
      clearBookmarkButton.current?.removeEventListener('click', clearBookmark);
      summaryButton.current?.removeEventListener('click', summarize);
    };
  }, []);

  const addBookmark = async () => {
    const bookmark = new Bookmark();
    if (summary.isEnabled) {
      await bookmark.create({ title: titleInput.current!.value, url, parentId: selectedFolderID, icon, summary: summarizedText });
    } else {
      await bookmark.create({ title: titleInput.current!.value, url, parentId: selectedFolderID, icon });
    }

    window.close();
  };

  const clearBookmark = async () => {
    const bookmark = new Bookmark();
    await bookmark.clear();
    window.close();
  };

  const summarize = () => {
    summaryButton.current!.disabled = true;
    summaryButton.current!.textContent = 'Summarizing...';
    fetch('https://tabasco-server.kurichi.workers.dev/api/v1/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: titleInput.current!.value,
        text: textToSummarize,
      }),
    }).then(async (res) => {
      const json = await res.json();
      summarizedText = json.text;
      summaryElement.current!.textContent = summarizedText;
      summaryButton.current!.disabled = false;
      summaryButton.current!.textContent = '要約';
    });
  };

  return (
    <>
      <div className='w-80 overflow-hidden rounded-xl px-3 py-3 text-gray-600'>
        <div
          onClick={() => {
            console.log('hoge');
          }}
        >
          hoge
        </div>
        <div className='border-b border-solid border-gray-100 pb-3 text-sm'>
          <input id='tab-title-input' ref={titleInput} autoFocus className='w-full rounded-lg bg-gray-200 px-3 py-2' />
        </div>
        <div ref={folderElement} />
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
        <div className='mt-5 flex items-center justify-end text-base'>
          {/* ↓TODO: ブックマーク登録削除 */}
          <button
            ref={addBookmarkButton}
            className='bg-red-500-200 pointer-events-auto mx-2 block cursor-pointer rounded-lg bg-red-600 px-5 py-1 text-white'
            id='add-bookmark-button'
          >
            削除
          </button>
          <button
            ref={addBookmarkButton}
            className='pointer-events-auto block cursor-pointer rounded-lg bg-green-600 px-5 py-1 text-white'
            id='add-bookmark-button'
          >
            追加
          </button>
        </div>
        <button
          ref={clearBookmarkButton}
          className='pointer-events-auto my-5 block cursor-pointer rounded-lg bg-gray-200 px-5 py-2'
          id='storage-clear-button'
        >
          clear
        </button>
        {/* TODO: Pending, Design*/}
        <button
          ref={summaryButton}
          className='pointer-events-auto my-5 block cursor-pointer rounded-lg bg-gray-200 px-5 py-2'
          id='storage-clear-button'
        >
          要約
        </button>
        <div ref={summaryElement} />
      </div>
    </>
  );
};

// ReactDOM.render(<Popup />, document.getElementById('root'));
const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<Popup />);
