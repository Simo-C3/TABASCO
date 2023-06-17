import { Bookmark } from './helper/storage';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
  }
});

chrome.commands.onCommand.addListener((command) => {
  if (command === 'bookmark-all-tabs') {
    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
      const bookmark = new Bookmark();
      const id = await bookmark.create({ title: new Date().toString() });
      for (const tab of tabs) {
        await bookmark.create({
          title: tab.title || '',
          url: tab.url,
          parentId: id,
        });
      }

      for (const tab of tabs) {
        chrome.tabs.remove(tab.id!);
      }
    });
  }
});
