let isRecording = false;
let recordedRequests = [];
let currentTabId = null;

// 現在アクティブなタブIDを取得する関数
function updateCurrentTab() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            currentTabId = tabs[0].id;
        }
    });
}

// タブのアクティブ状態が変わった時に現在のタブIDを更新
chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateCurrentTab();
});

// ウィンドウが変更された場合にも現在のタブIDを更新
chrome.windows.onFocusChanged.addListener(function(windowId) {
    if (windowId !== chrome.windows.WINDOW_ID_NONE) {
        updateCurrentTab();
    } else {
        currentTabId = null; // ウィンドウがフォーカスを失った場合はnull
    }
});

// リクエストをリスニングし、特定のドメインかつ現在のタブからのもののみ記録
chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if (isRecording && details.tabId === currentTabId && (details.url.includes("api.soracom.io") || details.url.includes("g.api.soracom.io"))) {
            let simplifiedDetails = {
                url: details.url.split('?')[0], // パラメータを削除
                method: details.method,
                timeStamp: details.timeStamp,
                type: details.type
            };
            recordedRequests.push(simplifiedDetails);
        }
    },
    {urls: ["*://api.soracom.io/*", "*://g.api.soracom.io/*"]} // リクエストURLを絞る
);

// メッセージを受信した際の処理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "start") {
        isRecording = true;
        recordedRequests = []; // 既存の記録をクリア
        sendResponse({status: "Recording started"});
        return true; // 非同期レスポンスを示すためtrueを返す
    } else if (message.command === "stop") {
        isRecording = false;
        sendResponse({status: "Recording stopped"});
        return true;
    } else if (message.command === "getRequests") {
        sendResponse({requests: recordedRequests});
        return true;
    }
});
