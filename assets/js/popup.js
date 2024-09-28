const mainSwitch = document.getElementById('main-switch');
const loginSwitch = document.getElementById('auto-login');
const inputSwitch = document.getElementById('auto-complete');

updateStatus();
checkUpdate();

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
    });
}

function checkUpdate() {
    const manifestData = chrome.runtime.getManifest();
    const currentVersion = manifestData.version;
    fetch('https://api.github.com/repos/sunnycloudyang/DormScoreRegister/releases/latest')
        .then((response) => response.json())
        .then((data) => {
            const latestVersion = data.tag_name.replace('v', '');
            if (latestVersion !== currentVersion) {
                const updateLink = document.getElementById('update');
                updateLink.style.display = 'block';
                updateLink.href = data.html_url;
                updateLink.addEventListener('click', () => {
                    chrome.tabs.create({ url: data.html_url });
                });
            }
        });
}
