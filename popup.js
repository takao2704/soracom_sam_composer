document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: "start"});
  });
  
  document.getElementById('stop').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: "stop"});
  });
  
  document.getElementById('show').addEventListener('click', () => {
    chrome.runtime.sendMessage({command: "getRequests"}, (response) => {
      document.getElementById('output').innerText = JSON.stringify(response, null, 2);
    });
  });
  