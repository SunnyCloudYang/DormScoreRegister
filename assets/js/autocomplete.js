let leftFrame;
let topFrame;
let mainFrame;
let target;
let title;

window.onload = function () {
    chrome.storage.sync.get(["enabled"], (data) => {
        if (data.enabled) {
            console.log("Auto complete loaded.");
            updateFrames();
            target = sessionStorage.getItem("target");
            title = target === "export" ? "学生卫生成绩查询" : "按房间录入卫生成绩";
            if (target === "input") {
                window.addEventListener("beforeunload", (event) => {
                    event.preventDefault();
                });
            }
            target === "export" ? exportExcel() : beginInput();
        }
    });
};


function updateFrames() {
    if (!window.location.href.includes("samis")) {
        leftFrame = window.frames["leftFrame"] || window.frames[1];
        topFrame = window.frames["topFrame"] || window.frames[0];
        mainFrame = window.frames["mainFrame"] || window.frames[3];
    } else {
        leftFrame = window.frames[0][1];
        topFrame = window.frames[0][0];
        mainFrame = window.frames[0][3];
    }
    console.debug("Frames updated.");
}

function enterPage(pageId) {
    try {
        if (window.location.href.includes("samis")) {
            // try {
            //     topFrame.document.getElementById("LoginCtrl1_LinkButton2").onclick = topFrame.document.getElementById("LoginCtrl1_LinkButton2").href;
            //     topFrame.document.getElementById("LoginCtrl1_LinkButton2").href = "";
            //     topFrame.document.getElementById("LoginCtrl1_LinkButton2").click();
            //     console.log("Enter page.");
            // } catch (error) {
            //     console.log(error);
            // }
            // setTimeout(() => {
            //     leftFrame.document.getElementById(pageId)?.getElementsByTagName("a")[0].click();
            //     updateFrames();
            // }, 1000);
            return;
        }
        leftFrame.document.getElementById(pageId)?.getElementsByTagName("a")[0].click();
        updateFrames();
    } catch (error) {
        console.log(error);
    }
}

function checkCurPossition() {
    try {
        const curPossition = mainFrame.document.getElementById("form1").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerText;

        return curPossition.includes(title);

    } catch (error) {
        return false;
    }
}

function ensureCurPossition() {
    if (!checkCurPossition()) {
        console.log("Not in the right possition, try to enter correct page.");
        enterPage(target === "export" ? "GridView1_ctl06_span1" : "GridView1_ctl03_span1");
    }
}

function inputFloorAndRoom() {
    try {
        const floor = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_ddlFLOOR");
        const room = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_txtROOM_ID");

        floor.selectedIndex = 1;
        room.value = floor.value + "01";
    } catch (error) {
        console.log(error);
    }
}

function exportExcel() {
    ensureCurPossition();
    let intervId = setInterval(() => {
        if (isFrameLoaded()) {
            console.log("Frame loaded.");
            const exportBtn = mainFrame.document.getElementById("WeekScoreListCtrl1_btnExcel");
            exportBtn.click();
            console.log("Export excel.");
            setTimeout(() => {
                window.close();
            }, 3000);
            clearInterval(intervId);
        }
    }, 500);
}

function isFrameLoaded() {
    let isLoaded = false;
    try {
        isLoaded = mainFrame.document.getElementById("form1").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerText.includes(title);
    } catch (error) {
        isLoaded = false;
    }
    return isLoaded;
}

function checkAndAddBtn() {
    if (leftFrame.document.getElementsByTagName("th")[0].innerText.trim()) {
        leftFrame.document.getElementById("autoCompleteBtn") ? null : addBtn();
    }
}

function beginInput() {
    ensureCurPossition();
    setTimeout(() => {
        if (window.location.href.includes("samis")) {
            chrome.storage.sync.get(["autoComplete", "enabled"], (data) => {
                if (data.enabled && data.autoComplete) {
                    setInterval(() => {
                        updateFrames();
                        checkAndAddBtn();
                    }, 500);
                    addNewRoomListener();
                }
            });
            return;
        } else {
            chrome.storage.sync.get(["autoComplete", "enabled"], (data) => {
                if (data.enabled && data.autoComplete) {
                    inputFloorAndRoom();
                    setInterval(() => {
                        if (checkCurPossition()) {
                            const beginBtn = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_btnSave");
                            beginBtn?.addEventListener("click", function () {
                                checkAndAddBtn();
                                console.log("Begin to input score.");
                            });
                        }
                    }, 500);
                    addNewRoomListener();
                }
            });
        }
    }, 1000);
}

// *******************************
const publicAdvice = {
    "PUBLIC_EARTH": "地面",
    "PUBLIC_WASH": "洗漱架",
    "PUBLIC_WINDOW": "窗户",
    "PUBLIC_FREE_BED": "空床",
    "PUBLIC_TERRACE": "阳台",
    "PUBLIC_TOILET": "卫生间",
    "PUBLIC_AIR": "空气",
    "PUBLIC_AMBIECCE": "气氛",
}
const centerAdvice = {
    "CENTER_EARTH": "中厅地面",
    "CENTER_WINDOW": "中厅窗户",
    "CENTER_COMMODITY": "中厅物品",
}
const personalAdvice = {
    "PERSON_BED": "床铺",
    "PERSON_BOOKCASE": "书架",
    "PERSON_DESK": "书桌",
}
const defaultAdvice = "很棒坚持";

function addBtn() {
    const btn = leftFrame.document.createElement("button");
    btn.id = "autoCompleteBtn";
    btn.innerText = "填充";
    btn.onclick = injectScript;
    btn.style = "width: 96%; margin: -6px 5px; padding: 6px; background-color: #e8e5fa; color: #732090; border: #660e32 1.6px solid; border-radius: 6px; cursor: pointer;";
    leftFrame.document.body.appendChild(btn);
    console.log("Add button.");
}

function addNewRoomListener() {
    setInterval(() => {
        if (checkCurPossition()) {
            const nextRoomBtn = mainFrame.document.getElementById("WeekScoreByRoomAddCtrl1_btnNextRoom");
            if (nextRoomBtn && nextRoomBtn.style.display !== "none") {
                injectScript();

                const reminder = mainFrame.document.createElement("div");
                reminder.innerText = "已自动填充";
                reminder.style = "position: fixed; top: 60px; left: 50%; transform: translate(-50%, 0); padding: 8px 16px; background-color: #732090; color: #ffffffee; border-radius: 12px; box-shadow: 0 0 8px #732090cc; letter-spacing: 1px; font-size: 1.2em; z-index: 9999;";
                mainFrame.document.body.appendChild(reminder);
                setTimeout(() => {
                    mainFrame.document.body.removeChild(reminder);
                }, 2000);
            }
        }
    }, 200);
}

function injectScript() {
    try {
        autoComplete();
        listenChange();
        hideNextBtn();
    } catch (error) {
        console.log(error);
    }
}

function hideNextBtn() {
    const nextBtn = mainFrame.document.getElementById("WeekScoreByRoomAddCtrl1_btnNextRoom");
    nextBtn.setAttribute("disabled", true);
    nextBtn.style.display = "none";
}

function autoComplete() {
    mainFrame.document.querySelectorAll("select.dropdownlist").forEach(element => {
        element.selectedIndex = 1;
    });
    mainFrame.document.querySelectorAll("input.textbox").forEach(element => {
        element.value = defaultAdvice;
    });
}

function listenChange() {
    const [personNum1, personNum2] = getStudentNumber();
    mainFrame.document.querySelectorAll("select.dropdownlist").forEach(element => {
        element.addEventListener("contextmenu", function (event) {
            if (event.ctrlKey) {
                element.selectedIndex = 3;
                event.preventDefault();
            } else if (event.altKey) {
                element.selectedIndex = 4;
                event.preventDefault();
            } else {
                element.selectedIndex = 2;
                event.preventDefault();
            }
            handleSelectChange(event, personNum1, personNum2);
        });

        element.onchange = function (event) {
            handleSelectChange(event, personNum1, personNum2);
        }
    });
}

function handleSelectChange(event, personNum1, personNum2) {
    const id = event.target.id;
    const index = id.match(/_ctl0(\d)_ddl/)[1];
    const type = id.match(/PUBLIC|CENTER|PERSON/)[0];
    switch (type) {
        case "PERSON":
            updateAdvice(0, index >= personNum1 ? personNum1 : 0, index);
            break;
        case "PUBLIC":
            if (index == 0) {
                for (let i = 0; i < personNum1; i++) {
                    updateAdvice(0, 0, i);
                }
            } else {
                for (let i = personNum1; i < personNum1 + personNum2; i++) {
                    updateAdvice(0, personNum1, i);
                }
            }
            break;
        case "CENTER":
            for (let i = 0; i < personNum1; i++) {
                updateAdvice(0, 0, i);
            }
            for (let i = personNum1; i < personNum1 + personNum2; i++) {
                updateAdvice(0, personNum1, i);
            }
            break;
        default:
            break;
    }
}

function updateAdvice(center, public, personal) {
    const prefix = "WeekScoreByRoomAddCtrl1_Repeater1_ctl0";
    const selectorSuffix = "_ddl";
    const adviceSuffix = "_txtADVISE";
    const adviceId = prefix + personal + adviceSuffix;
    const adviceBox = mainFrame.document.getElementById(adviceId);
    const scores = {};

    adviceBox.value = "";

    // get scores
    for (let key in personalAdvice) {
        scores[key] = getScore(prefix + personal + selectorSuffix + key);
    }
    for (let key in publicAdvice) {
        scores[key] = getScore(prefix + public + selectorSuffix + key);
    }
    for (let key in centerAdvice) {
        scores[key] = getScore(prefix + center + selectorSuffix + key);
    }

    let allA = true;
    // let hasC = false;
    for (let key in scores) {
        const advice = personalAdvice[key] || publicAdvice[key] || centerAdvice[key];
        if (scores[key] !== "A") {
            allA = false;
            adviceBox.value += `${advice}`;
        }
    }
    if (allA) {
        adviceBox.value = defaultAdvice;
    }
}

function getScore(id) {
    const scores = ["A", "B", "C", "D"];
    const score = mainFrame.document.getElementById(id).selectedIndex;

    return scores[score - 1];
}

function getStudentNumber() {
    const room1 = mainFrame.document.getElementById("WeekScoreByRoomAddCtrl1_Repeater1_ctl00_trROOM");
    const student_in_room1 = Number(room1.getAttribute("rowspan"));
    const room2 = mainFrame.document.getElementById(`WeekScoreByRoomAddCtrl1_Repeater1_ctl0${student_in_room1}_trROOM`);
    const student_in_room2 = room2 ? Number(room2.getAttribute("rowspan")) : 0;

    return [student_in_room1, student_in_room2];
}
