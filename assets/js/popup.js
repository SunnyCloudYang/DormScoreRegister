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
    const latestVersion = localStorage.getItem('latestVersion');
    if (latestVersion && latestVersion !== currentVersion) {
        const updateLink = document.getElementById('update');
        updateLink.style.display = 'block';
        updateLink.href = 'https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest';
        updateLink.addEventListener('click', () => {
            chrome.tabs.create({
                url: 'https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest',
            });
        });
    }
    try {
        fetch('https://api.github.com/repos/sunnycloudyang/DormScoreRegister/releases/latest')
            .then((response) => response.json())
            .then((data) => {
                const latestVersion = data?.tag_name?.replace('v', '');
                if (latestVersion && latestVersion !== currentVersion) {
                    localStorage.setItem('latestVersion', latestVersion);
                    const updateLink = document.getElementById('update');
                    updateLink.style.display = 'block';
                    updateLink.href = data.html_url;
                    updateLink.addEventListener('click', () => {
                        chrome.tabs.create({ url: data.html_url });
                    });
                }
            });
    } catch (error) {
        console.error(error);
    }
}
