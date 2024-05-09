document.getElementById('startButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({command: "start"}, function(response) {
        alert(response.status); // ステータスメッセージを表示
    });
});

document.getElementById('stopButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({command: "stop"}, function(response) {
        alert(response.status); // ステータスメッセージを表示
    });
});

document.getElementById('previewButton').addEventListener('click', function() {
    chrome.runtime.sendMessage({command: "getRequests"}, function(response) {
        const urlsContainer = document.getElementById('urls');
        urlsContainer.innerHTML = ''; // 以前の内容をクリア

        if (response && response.requests) {
            response.requests.forEach(request => {
                const urlElement = document.createElement('div');
                urlElement.textContent = request.url;
                urlsContainer.appendChild(urlElement);
            });
        } else {
            urlsContainer.textContent = 'URLのデータがありません。';
        }
    });
});
