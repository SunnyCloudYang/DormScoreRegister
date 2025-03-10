const mainSwitch = document.getElementById('main-switch');
const loginSwitch = document.getElementById('auto-login');
const inputSwitch = document.getElementById('auto-complete');

updateStatus();
checkForUpdates();

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

async function checkForUpdates() {
    const manifestData = chrome.runtime.getManifest();
    const currentVersion = manifestData.version;

    // Function to show update link
    const showUpdateLink = (url) => {
        const updateLink = document.getElementById('update');
        updateLink.style.display = 'block';
        updateLink.href = url;
        updateLink.addEventListener('click', (e) => {
            e.preventDefault();
            chrome.tabs.create({ url });
        }, { once: true }); // Prevents multiple event listeners
    };

    const hideUpdateLink = () => {
        document.getElementById('update')?.remove();
    };

    // Check cached version first
    const cachedVersion = localStorage.getItem('latestVersion');
    if (cachedVersion && cachedVersion !== currentVersion) {
        showUpdateLink('https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest');
        return;
    }

    // Check for updates from GitHub API
    if (localStorage.getItem('lastChecked') && Date.now() - localStorage.getItem('lastChecked') < 600000) return;
    try {
        const response = await fetch('https://api.github.com/repos/sunnycloudyang/DormScoreRegister/releases/latest');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const latestVersion = data.tag_name?.replace('v', '');
        
        if (latestVersion) {
            localStorage.setItem('latestVersion', latestVersion);
            localStorage.setItem('lastChecked', Date.now());
            latestVersion !== currentVersion ? showUpdateLink(data.html_url) : hideUpdateLink();
        }
    } catch (error) {
        console.error('Failed to check for updates:', error);
    }
}