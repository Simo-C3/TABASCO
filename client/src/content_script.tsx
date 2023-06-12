// chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   if (msg.color) {
//     console.log("Receive color = " + msg.color);
//     document.body.style.backgroundColor = msg.color;
//     sendResponse("Change color to " + msg.color);
//   } else {
//     sendResponse("Color message is none.");
//   }
// });

import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';

import './index.css';

const Sidebar = () => {
  const [sidebarStatus, setSidebarStatus] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [count, setCount] = useState(0);

  window.addEventListener('mousemove', (e: MouseEvent) => {
    // console.log(e.clientX, e.clientY);
    // console.log(window.innerWidth - e.clientX)
    // console.log(document.getElementById('tabasco-side-bar-content')?.clientWidth!)
    if (!sidebarStatus && window.innerWidth - e.clientX < 10) {
      setSidebarStatus(true);
      const sideBarElement =  document.getElementById('tabasco-side-bar')
      sideBarElement?.classList.remove('inactive');
      sideBarElement?.classList.add('active')
    } else if (sidebarStatus && window.innerWidth - e.clientX > document.getElementById('tabasco-side-bar-content')?.clientWidth!) {
      setSidebarStatus(false);
      const sideBarElement =  document.getElementById('tabasco-side-bar')
      sideBarElement?.classList.remove('active');
      sideBarElement?.classList.add('inactive')
    }
  })

  useEffect(() => {
    chrome.storage.sync.get(['bookmarks'], (result) => {
      if (result.bookmarks) {
        setBookmarks([...result.bookmarks]);
      }
    });
  }, []);

  return (
    <>
      <div id="tabasco-side-bar-content" className={`absolute top-0 right-0 w-[350px] h-full z-50 bg-white px-10 py-20 text-gray-700 ${sidebarStatus?'-translate-x-0':'translate-x-[350px]'}`}>
        <span>
        Hello World
        </span>
        <div>{count}</div>
        {bookmarks.map((bookmark) => {
          return (
            <a>
              {bookmark}
            </a>
          )
        })}
      </div>
    </>
  );
}

const root: HTMLDivElement = document.createElement('div');
root.id = "tabasco-side-bar";
root.classList.add('inactive');
document.body.appendChild(root);
ReactDOM.render(
  <Sidebar />,
  root
);
