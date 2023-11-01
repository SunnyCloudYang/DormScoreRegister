var enabled = true;
var autoLogin = true;
var autoComplete = true;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ enabled, autoLogin, autoComplete }, () => {
        console.log('The extension has been installed.');
    });
});
