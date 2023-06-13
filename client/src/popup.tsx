import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { MdExpandMore } from 'react-icons/md';

import './index.css';
import { Bookmark } from './helper/storage';
import { NewBookMark } from './types';
import BaseFolder from './components/BaseFolder';

const Popup = () => {
  const currentTabInfo = useRef<NewBookMark>({
    url: '',
    title: '',
  });
  const isOpenFolderSelector = useRef<Boolean>(false);
  const addBookmarkButton = useRef<HTMLButtonElement>(null);
  const clearBookmarkButton = useRef<HTMLButtonElement>(null);
  const selectedFolderElement = useRef<HTMLDivElement>(null);

  const [count, setCount] = useState(0);
  const [folders, setFolders] = useState<string[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [tabTitleInputElement, setTabTitleInputElement] = useState<HTMLInputElement>();

  const asyncInit = async () => {
    // 現在のタブ情報取得
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabInfo.current = { url: tabs[0].url!, title: tabs[0].title! };
    // タイトル入力欄の要素を取得
    setTabTitleInputElement(document.getElementById('tab-title-input') as HTMLInputElement);
    // ストレージからフォルダ一覧を取得
    setFolders(['folder1', 'folder2', 'folder3', 'folder4', 'folder5', 'folder6', 'folder7', 'folder8', 'folder9', 'folder10']);
  };

  useEffect(() => {
    // イベントを登録
    addBookmarkButton.current?.addEventListener('click', addBookmark);
    clearBookmarkButton.current?.addEventListener('click', clearBookmark);
    selectedFolderElement.current?.addEventListener('click', openFolderSelector);
    asyncInit();
  }, []);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    tabTitleInputElement?.select();
  }, [currentTabInfo.current]);

  const openFolderSelector = () => {
    isOpenFolderSelector.current = !isOpenFolderSelector.current;
    const folderSelectorElement = document.getElementById('folder-selector') as HTMLDivElement;
    if (isOpenFolderSelector.current) {
      folderSelectorElement.classList.add('open');
    } else {
      folderSelectorElement.classList.remove('open');
    }
  };

  const addBookmark = async () => {
    const bookmark = new Bookmark();
    const titleInput: HTMLInputElement = document.getElementById('tab-title-input') as HTMLInputElement;
    await bookmark.create({ title: titleInput?.value!, url: currentTabInfo.current.url });
    window.close();
  };

  const clearBookmark = async () => {
    const bookmark = new Bookmark();
    await bookmark.clear();
    window.close();
  };

  return (
    <>
      <div className='w-80 overflow-hidden rounded-xl px-3 py-3 text-gray-600'>
        <div className='border-b border-solid border-gray-100 pb-3 text-sm'>
          <input id='tab-title-input' autoFocus value={currentTabInfo.current.title} className='w-full rounded-lg bg-gray-200 px-3 py-2' />
        </div>
        <div
          id='selected-folder'
          ref={selectedFolderElement}
          className='flex cursor-pointer items-center justify-between border-b border-solid border-gray-100 py-2'
        >
          <span className='text-base'>Add to</span>
          <div className='flex items-center'>
            <BaseFolder title={selectedFolder} icon='https://www.google.com/favicon.ico' size='lg' />
            <MdExpandMore className='mx-1 text-lg' />
          </div>
        </div>
        {/* ↓ToDo: フォルダ検索と選択 */}
        <div id='folder-selector' className='overflow-hidden transition-all'>
          <input value={''} className='mb-2 w-full rounded-lg bg-gray-200 px-3 py-1' />
          {folders.map((folder) => {
            return (
              <div className='cursor-pointer py-1'>
                <BaseFolder title={folder} icon='https://www.google.com/favicon.ico' />
                <span className='w-full px-2 text-xs text-gray-300'>/favorite/{folder}</span>
              </div>
            );
          })}
        </div>
        <div className='mt-3 flex items-center py-1 pl-0 text-base'>
          <input id='summary-input' type='radio' value={0} className='mx-3' />
          <span>要約</span>
        </div>
        {/* ↓ToDo: 要約がfalseの時は非表示 */}
        <div className='my-1 pl-14 text-sm'>
          <div className='mb-2 flex items-center justify-between'>
            <span>フォーマット</span>
            <select name='format' id='summary-format-select'>
              <option value='default'>標準</option>
              <option value='list'>リスト</option>
            </select>
          </div>
          <div className='flex items-center justify-between'>
            <span>翻訳</span>
            <select name='language' id='summary-language-select'>
              <option value='jp'>日本語</option>
              <option value='en'>英語</option>
            </select>
          </div>
        </div>
        <div className='my-2 flex items-center justify-between py-1 text-base'>
          <div className='flex items-center'>
            <input id='summary-input' type='radio' value={0} className='mx-3' />
            <span>リマインド</span>
          </div>
          <select name='language' id='summary-language-select'>
            <option value='1d'>1日後</option>
            <option value='2d'>2日後</option>
          </select>
        </div>
        <div className='mt-5 flex items-center justify-end text-base'>
          {/* ↓ToDo: ブックマーク登録削除 */}
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
        {/* <button
            ref={clearBookmarkButton}
            className='pointer-events-auto my-5 block cursor-pointer rounded-lg bg-gray-200 px-5 py-2'
            id='storage-clear-button'
          >
            clear
          </button> */}
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root'),
);
