import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "./index.css";

const Popup = () => {
  const [count, setCount] = useState(0);
  const [currentURL, setCurrentURL] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    chrome.action.setBadgeText({ text: count.toString() });
  }, [count]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setCurrentURL(tabs[0].url!);
    });
    chrome.storage.sync.get(['bookmarks'], (result) => {
      console.log('Value currently is ' + result.bookmarks);
      setBookmarks([...result.bookmarks])
    })
  }, []);

  const changeBackground = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          {
            color: "#555555",
          },
          (msg) => {
            console.log("result message:", msg);
          }
        );
      }
    });
  };

  const addBookmark = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.sync.get(['bookmarks'], (result) => {
        console.log(result.bookmarks)
        console.log(bookmarks)
        if (result.bookmarks) {
          chrome.storage.sync.set({bookmarks: [tabs[0].url!, ...result.bookmarks]}).then(() => {
            console.log("added")
            window.close()
          })
          setBookmarks([tabs[0].url!, ...result.bookmarks])
        } else {
          chrome.storage.sync.set({bookmarks: [tabs[0].url!]}).then(() => {
            console.log("added")
            window.close()
          })
          setBookmarks([tabs[0].url!])
        }
      })
    });
    console.log("add bookmark to bucket")

  }

  useEffect(() => {
    document.addEventListener("DOMContentLoaded",() => {
      const buttonElement = document.getElementById("add-bookmark-button")
      const clearElement = document.getElementById("storage-clear-button")
      buttonElement?.addEventListener('click', addBookmark)
      clearElement?.addEventListener('click', () => {
        chrome.storage.sync.clear()
        setBookmarks([])
      })
    })
  }, []);

  return (
    <>
      <div className="px-10 py-5 rounded-xl overflow-hidden my-5 w-80">
        <label>
          URL: <input disabled value={currentURL} className="text-blue-500 w-full"></input>
        </label>
        <button className="pointer-events-auto cursor-pointer block bg-blue-300 px-5 py-2 my-5 rounded-lg" id="add-bookmark-button">add</button>
        {bookmarks.map((bookmark) => {
          return (
            <a className="p-2 bg-red-200 block my-2 rounded-md w-full overflow-hidden">
              {bookmark}
            </a>
          )
        })}
        <button className="pointer-events-auto cursor-pointer block bg-gray-200 px-5 py-2 my-5 rounded-lg" id="storage-clear-button">clear</button>

      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
