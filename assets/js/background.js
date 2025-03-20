chrome.runtime.onInstalled.addListener(() => {
    let enabled = true;
    let autoLogin = true;
    let autoComplete = true;
    chrome.storage.sync.set({ enabled, autoLogin, autoComplete }, () => {
        console.log('The extension has been installed.');
    });
});
