let isRecording = false;
let recordedRequests = [];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (isRecording && (details.type === "xmlhttprequest" || details.type === "fetch")) {
      recordedRequests.push(details);
    }
    return {cancel: false};
  },
  {urls: ["<all_urls>"]},
  ["blocking"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command == "start") {
    isRecording = true;
    recordedRequests = []; // Clear previous records
  } else if (message.command == "stop") {
    isRecording = false;
  } else if (message.command == "getRequests") {
    sendResponse(recordedRequests);
  }
});
