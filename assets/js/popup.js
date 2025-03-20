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

function compareVersion(v1, v2) {
    // Validate inputs
    if (!v1 || !v2) return 0;
    
    const v1Arr = v1.split('.').map(Number);
    const v2Arr = v2.split('.').map(Number);
    const minLength = Math.min(v1Arr.length, v2Arr.length);
    
    for (let i = 0; i < minLength; i++) {
        if (v1Arr[i] > v2Arr[i]) return 1;
        if (v1Arr[i] < v2Arr[i]) return -1;
    }
    
    return Math.sign(v1Arr.length - v2Arr.length);
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
    if (cachedVersion && compareVersion(currentVersion, cachedVersion) < 0) {
        showUpdateLink('https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest');
        return;
    }

    // Check for updates from GitHub API
    if (localStorage.getItem('lastChecked') && Date.now() - localStorage.getItem('lastChecked') < 600000) return;
    try {
        const response = await fetch('https://api.github.com/repos/sunnycloudyang/DormScoreRegister/releases/latest');
        localStorage.setItem('lastChecked', Date.now());
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const latestVersion = data.tag_name?.replace('v', '');
        
        if (latestVersion) {
            localStorage.setItem('latestVersion', latestVersion);
            compareVersion(currentVersion, latestVersion) < 0 ? showUpdateLink(data.html_url) : hideUpdateLink();
        }
    } catch (error) {
        console.log('Failed to check for updates:', error);
    }
}
