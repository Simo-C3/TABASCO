import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import { Bookmark } from './helper/storage';
import { BaseBookmark } from './types';
import { getTextByBody } from './helper/summary';

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>('');
  const [bookmarks, setBookmarks] = useState<BaseBookmark[]>([]);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    (async () => {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];
      const tabId = activeTab.id;
      console.log(tabId);

      const bodies = await chrome.scripting.executeScript({
        target: { tabId: tabId! },
        func: getTextByBody,
      });
      const textToSummarize = bodies[0].result;

      setCurrentURL(tabs[0].url || '');
      const bookmark = new Bookmark();
      const bookmarks = await bookmark.all();
      setBookmarks(bookmarks);
    })();
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: '#555555',
          },
          (msg) => {
            console.log('result message:', msg);
          },
        );
      }
    });
  };

  const addBookmark = async () => {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const bookmark = new Bookmark();
    await bookmark.create({
      title: '', // TODO: title variable
      url: tabs[0].url,
    });
  };

  const clearBookmark = async () => {
    const bookmark = new Bookmark();
    await bookmark.clear();
    setBookmarks([]);
  };

  useEffect(() => {
    const onLoaded = () => {
      const buttonElement = document.getElementById('add-bookmark-button');
      const clearElement = document.getElementById('storage-clear-button');
      buttonElement?.addEventListener('click', addBookmark);
      clearElement?.addEventListener('click', clearBookmark);
    };

    document.addEventListener('DOMContentLoaded', onLoaded);

    return () => {
      document.removeEventListener('click', addBookmark);
      document.removeEventListener('click', clearBookmark);
      document.removeEventListener('DOMContentLoaded', onLoaded);
    };
  }, []);

  return (
    <>
      <div className='my-5 w-80 overflow-hidden rounded-xl px-10 py-5'>
        <label>
          URL: <input disabled value={currentURL} className='w-full text-blue-500'></input>
        </label>
        <button className='pointer-events-auto my-5 block cursor-pointer rounded-lg bg-blue-300 px-5 py-2' id='add-bookmark-button'>
          add
        </button>
        {bookmarks.map((bookmark) => {
          return <a className='my-2 block w-full overflow-hidden rounded-md bg-red-200 p-2'>{bookmark.url}</a>;
        })}
        <button className='pointer-events-auto my-5 block cursor-pointer rounded-lg bg-gray-200 px-5 py-2' id='storage-clear-button'>
          clear
        </button>
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
