chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'openOptionsPage') {
    chrome.runtime.openOptionsPage();
  }
});
