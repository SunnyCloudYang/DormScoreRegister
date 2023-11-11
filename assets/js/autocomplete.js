let leftFrame;
let mainFrame;

window.onload = function () {
    console.log("Auto complete loaded.");
    leftFrame = window.frames["leftFrame"];
    mainFrame = window.frames["mainFrame"];
    beginInput();
};

function enterScoreByRoom() {
    try {
        leftFrame.document.getElementById("GridView1_ctl03_span1").getElementsByTagName("a")[0].click();
        mainFrame = window.frames["mainFrame"];
    } catch (error) {
        console.log(error);
    }
}

function checkCurPossition() {
    try {
        const curPossition = mainFrame.document.getElementById("form1").getElementsByTagName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[0].getElementsByTagName("td")[0].innerText;

        return curPossition.includes("按房间录入卫生成绩");

    } catch (error) {
        return false;
    }
}

function ensureCurPossition() {
    if (!checkCurPossition()) {
        console.log("Not in the right possition, try to enter score by room.");
        enterScoreByRoom();
    }
}

function inputFloorAndRoom() {
    const floor = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_ddlFLOOR");
    const room = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_txtROOM_ID");
    
    floor.selectedIndex = 1;
    room.value = floor.value + "01";
}

function beginInput() {
    ensureCurPossition();
    setTimeout(() => {
        inputFloorAndRoom();
        const beginBtn = mainFrame.document.getElementById("WeekScoreByRoomSelCtrl1_btnSave");
        console.log("Begin to input score.");
        chrome.storage.sync.get(["autoComplete", "enabled"], (data) => {
            if (data.enabled && data.autoComplete) {
                beginBtn.addEventListener("click", function () {
                    addBtn();
                });
            }
        });
        // beginBtn.click();
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
const defaultAdvice = "很棒坚持！";

function addBtn() {
    const btn = leftFrame.document.createElement("button");
    btn.id = "autoCompleteBtn";
    btn.innerText = "填充";
    btn.onclick = injectScript;
    btn.style = "width: 96%; margin: -6px 5px; padding: 6px; background-color: #e8e5fa; color: #732090; border: #660e32 1.6px solid; border-radius: 6px; cursor: pointer;";
    leftFrame.document.body.appendChild(btn);
    console.log("Add button.");
}

function injectScript() {
    autoComplete();
    listenChange();
    hideNextBtn();
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
    let hasC = false;
    for (let key in scores) {
        const advice = personalAdvice[key] || publicAdvice[key] || centerAdvice[key];
        if (scores[key] === "B") {
            allA = false;
            adviceBox.value += `${advice}`;
        } else if (scores[key] === "C" || scores[key] === "D") {
            adviceBox.value += hasC ? `、${advice}` : adviceBox.value == "" ? `请清理${advice}` : `，请清理${advice}`;
            allA = false;
            hasC = true;
        }
    }
    if (allA) {
        adviceBox.value = defaultAdvice;
    } else {
        adviceBox.value += "。";
    }
}

function getScore(id) {
    const scores = ["A", "B", "C", "D"];
    const score = mainFrame.document.getElementById(id).selectedIndex;

    return scores[score-1];
}

function getStudentNumber() {
    const room1 = mainFrame.document.getElementById("WeekScoreByRoomAddCtrl1_Repeater1_ctl00_trROOM");
    const student_in_room1 = Number(room1.getAttribute("rowspan"));
    const room2 = mainFrame.document.getElementById(`WeekScoreByRoomAddCtrl1_Repeater1_ctl0${student_in_room1}_trROOM`);
    const student_in_room2 = room2 ? Number(room2.getAttribute("rowspan")) : 0;

    return [student_in_room1, student_in_room2];
}
