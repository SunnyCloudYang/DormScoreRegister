# DormScoreRegister

A plugin to auto login and complete dormitory sanitation score entry

[中文README](README.zh.md)

## Installation

### Chrome/Edge/Others

There are two ways to install the extension:

#### 1. Install from zip (Not recommended)

1. [Download the `DormScoreRegister-Chromium.zip` file from the latest release](https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest), unzip it to a selected folder.
2. Open Chrome/Edge, and go to `chrome://extensions/` (or `edge://extensions/` in the case of Edge), click `Load unpacked` and select the folder you just unzipped.( **remember to turn on `Developer mode` before loading it!**)

#### 2. Install with Git (Recommended)

1. `git clone https://github.com/SunnyCloudYang/DormScoreRegister.git`
2. Open Chrome/Edge, and go to `chrome://extensions/` (or `edge://extensions/` in the case of Edge), click `Load unpacked` and select the folder you just unzipped.( **remember to turn on `Developer mode` before loading it!**)

### Firefox

1. [Download the `DormScoreRegister-Firefox.xpi` file from the latest release](https://github.com/SunnyCloudYang/DormScoreRegister/releases/latest), save it to a selected folder.
2. Open Firefox, go to `about:addons`, click the gear icon, select `Install Add-on From File`, select the file you just downloaded, and complete the installation. (You also need to turn on `Developer mode` before loading it)

### Safari

Not supported yet...

## Features

- [x] Automatically login to the checked floor's score entry page
- [x] Automatically fill in the score (default A)
- [x] Automatically generate rectify advice
- [x] Inherit the operation of the previous generation
- [x] Avoid adding wrong advice

## Usage

### Score Entry (Floor Leader)

1. Open the extension and **turn on the switch** in the popup to enable the extension. (The extension will remember your choice so that you just have to turn it on once)
2. **Click `Enter System` button** to go to the login page.
3. **Select the region, building, floor and password pattern** you want to enter the score, and you will automatically enter the score entry page.
4. Wait for the extension to automatically fill in the floor and the start room number, and then **click the `Begin Entry` button** to start entering the score.
5. When a new room page is loaded, **click the `Auto Complete` button** to fill in the default score and generate default advice.
6. By **right-clicking** the score select box, you'll change the default score to **"B"**, if you press **`Ctrl`** key simultaneously, the score will be changed to **"C"**, press **`Shift`** to change it to **"D"**.
7. No matter how you choose the score, the advice will be generated automatically with no extra operation.
8. **Click the `Save` button** to save and move to the next room. (`Next Room` button will be disabled as the prior version, though I have no idea why)

### Score Export (Building Leader)

1. Open the extension and **turn on the switch** in the popup to enable the extension. (The extension will remember your choice so that you just have to turn it on once)
2. **Click `Enter System` button** to go to the login page.
3. Select the **region** and **building** you want to export, click the `Go Export` button, wait for the browser to automatically export and download the whole building's score.

**Note**: The extension will automatically login and export the score, so you don't have to do anything else but wait.

## Update

1. If you installed the extension with Git, just `git pull` to update.
2. If you installed the extension with zip file, delete the old extension and reinstall the latest version.
3. If you installed the extension in Firefox, click the `Update` button on the extension management page, and complete the update. (Or just delete the extension and reinstall the latest version)

## Known Issues

- [ ] Sometimes the extension will be not able to choose "Entry Score by Room", so you have to refresh the page to make it work.
- [ ] Since I'm not registered as a developer, every two weeks the browser will remind you to close the extension in developer mode. (This is slightly annoying, I may ported it to tempermonkey or released it to app store later)

## Claim

- This extension is only for study and convenience, and it is not responsible for any consequences caused by using this extension.

- This extension is only for the dormitory sanitation score entry page of **Tsinghua University**.

## Contact

If you have any questions or suggestions, please feel free to [contact me](mailto:sunnycloudyang@outlook.com) or open an [issue](https://github.com/SunnyCloudYang/DormScoreRegister/issues).

## Change Log

### v3.3.3

#### Features

- [x] Add link to csv formatter
- [x] Apply update check limit

### v3.3.2

#### Features

- [x] Support auto completion for check date
- [x] Support infer start room number

### v3.3.1

#### Fix

- [x] Fix auto completion
- [x] Fix function enable/disable issue

### v3.3.0

#### Features

- [x] Support webvpn login
- [x] Support auto completion when moving to the next room

#### Fix

- [x] Optimize version checking

### v3.2.3

#### Fix

- [x] Fix listener lose efficacy
- [x] Add missing building

### v3.2.2

#### Features

- [x] Support auto completion in delayed score entry
- [x] Add pop-up hint before exit
- [x] Optimize stability in update fetching

### v3.1.0

#### Fix

- [x] Adapt to https

### v3.0.0

#### Features

- [x] Support exporting all floors' scores in the building
- [x] Support checking updates

### v2.1.1

#### Fix

- [x] Fix missing buildings

### v2.1.0

#### Features

- [x] Support to choose password suffix

#### Fix

- [x] Fix the format of advice generation

### v2.0.0

- [x] Update password pattern

### v1.1.4

#### Features

- [x] Support Firefox

### v1.0.0

- First release

#### Features

- [x] Auto login
- [x] Auto fill in the score
- [x] Auto generate advice
