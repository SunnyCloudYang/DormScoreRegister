const mainSwitch = document.getElementById('main-switch');
const loginSwitch = document.getElementById('auto-login');
const inputSwitch = document.getElementById('auto-complete');

updateStatus();

mainSwitch.addEventListener('change', () => {
    chrome.storage.sync.set({ enabled: mainSwitch.checked });
    updateStatus();
});

loginSwitch.addEventListener('change', () => {
    chrome.storage.sync.set({ autoLogin: loginSwitch.checked });
    updateStatus();
});

inputSwitch.addEventListener('change', () => {
    chrome.storage.sync.set({ autoComplete: inputSwitch.checked });
    updateStatus();
});

function updateStatus() {
    chrome.storage.sync.get(['enabled', 'autoLogin', 'autoComplete'], (data) => {
        mainSwitch.checked = data.enabled;
        loginSwitch.checked = data.autoLogin;
        inputSwitch.checked = data.autoComplete;
        console.log(data);
    });
}
