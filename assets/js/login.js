function popWindow() {
    let [region, building, floor, pwdSuffix] = parseParamFromUrl();
    const div = document.createElement("div");

    div.setAttribute("id", "pop-window");
    div.innerHTML = `
        <div class="select-panel">
            <div class="close">
                <span class="glyphicon glyphicon-remove" id="close-btn">×</span>
            </div>
            <div class="panel-header">
                <h2>成绩管理</h2>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label for="region">区域</label>
                    <select class="form-control" id="region">
                        <option>紫荆</option>
                        <option>南区</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="building">楼栋</label>
                    <select class="form-control" id="building">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                        <option>9</option>
                        <option>10</option>
                        <option>11</option>
                        <option>12</option>
                        <option>13</option>
                        <option>14</option>
                        <option>15</option>
                        <option>16</option>
                        <option>17</option>
                        <option>18</option>
                        <option>19</option>
                        <option>20</option>
                        <option>21</option>
                        <option>22</option>
                        <option>23</option>
                        <option>24</option>
                        <option>25</option>
                        <option>26</option>
                        <option>27</option>
                        <option>28</option>
                        <option>29</option>
                        <option>30</option>
                        <option>31</option>
                        <option>32</option>
                        <option>33</option>
                        <option>34</option>
                        <option>35</option>
                        <option>36</option>
                        <option>37</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="floor">楼层</label>
                    <select class="form-control" id="floor">
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                        <option>6</option>
                        <option>7</option>
                        <option>8</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="pwd-pattern">密码后缀</label>
                    <select class="form-control" id="pwd-pattern">
                        <option>XSSQ</option>
                        <option>无</option>
                    </select>
                </div>
            </div>
            <div class="panel-footer">
                <button type="submit" class="btn btn-primary" id="input-btn">去录入</button>
                <button type="submit" class="btn btn-secondary" id="export-btn">去导出</button>
            </div>
        </div>
    `;
    div.classList.add("pop-window");
    document.body.appendChild(div);

    const cancelBtn = document.getElementById("close-btn");
    cancelBtn.addEventListener("click", () => {
        document.body.removeChild(div);
    });

    const exportBtn = document.getElementById("export-btn");
    exportBtn.addEventListener("click", () => {
        sessionStorage.setItem("target", "export");
        // open a new window with every floor under the same building
        const region = document.getElementById("region").value;
        const building = document.getElementById("building").value;
        const pwdSuffix = document.getElementById("pwd-pattern").value === "无" ? "" : document.getElementById("pwd-pattern").value;
        let urls = [];
        for (let i = 1; i <= 8; i++) {
            const url = `http://hm.myhome.tsinghua.edu.cn/?region=${region === "南区" ? "nq" : "zj"}&building=${building}&floor=${i}&pwdSuffix=${pwdSuffix}`;
            urls.push(url);
        }
        let newWindow = window.open(urls[0], "_blank");
        console.log("new window opened.");
        urls.shift();
        let interval = setInterval(() => {
            if (newWindow.closed) {
                newWindow = window.open(urls[0], "_blank");
                console.log("new window opened.");
                urls.shift();
            }
            if (urls.length === 0) {
                clearInterval(interval);
            }
        }, 500);
        // inputInfo(region, building, 1, pwdSuffix);
    });

    const inputBtn = document.getElementById("input-btn");
    inputBtn.addEventListener("click", () => {
        sessionStorage.setItem("target", "input");
        const region = document.getElementById("region").value;
        const building = document.getElementById("building").value;
        const floor = document.getElementById("floor").value;
        const pwdSuffix = document.getElementById("pwd-pattern").value === "无" ? "" : document.getElementById("pwd-pattern").value;

        if (building === "") {
            alert("请输入楼栋");
            return;
        }

        inputInfo(region, building, floor, pwdSuffix);
    });

    if (building !== 0) {
        sessionStorage.setItem("target", "export");
        console.log(region, building, floor, pwdSuffix);
        document.getElementById("region").value = region;
        document.getElementById("building").value = building;
        document.getElementById("floor").value = floor;
        document.getElementById("pwd-pattern").value = pwdSuffix === "" ? "无" : "XSSQ";
        if (sessionStorage.getItem("tried") !== "true") {
            inputInfo(region, building, floor, pwdSuffix);
            sessionStorage.setItem("tried", "true");
        }
    }
}

function parseParamFromUrl() {
    const url = window.location.href;
    let region = "紫荆";
    let building = 0;
    let floor = 0;
    let pwdSuffix = "";
    try {
        const params = url.split("?")[1].split("&");
        for (let i = 0; i < params.length; i++) {
            const [key, value] = params[i].split("=");
            if (key === "building") {
                building = parseInt(value);
            } else if (key === "floor") {
                floor = parseInt(value);
            } else if (key === "pwdSuffix") {
                pwdSuffix = value;
            } else if (key === "region") {
                region = value === "nq" ? "南区" : "紫荆";
            }
        }
    }
    catch (e) {
        console.log("No params in url.");
    }
    finally {
        return [region, building, floor, pwdSuffix];
    }
}

function inputInfo(region, building, floor, pwdSuffix) {
    region = region === "南区" || region === "nq" ? "nq" : "zj";
    building = building < 10 ? "0" + building : building;
    floor = floor < 10 ? "0" + floor : floor;


    const username = document.getElementById("Login2Ctrl1_txtAccount");
    const password = document.getElementById("Login2Ctrl1_txtPwd");
    username.value = region + building + floor;
    password.value = username.value + pwdSuffix;

    login();
}

function login() {
    const btn = document.getElementById("Login2Ctrl1_btnLogin");
    btn.click();
}

chrome.storage.sync.get(["autoLogin", "enabled"], (data) => {
    if (data.enabled && data.autoLogin) {
        popWindow();
    }
});
