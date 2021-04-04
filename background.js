chrome.tabs.onCreated.addListener(function () {
    checkCurrentOption();
});
chrome.tabs.onUpdated.addListener(function () {
    checkCurrentOption();
});

function checkCurrentOption () {

    chrome.storage.local.get(null, function (result) {
        if (result.option === "words") {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "words"});
            });
        } else if (result.option === "contents") {
            chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
                const activeTab = tabs[0];
                chrome.tabs.sendMessage(activeTab.id, {"message": "contents"});
            });
        }
    })
}

chrome.storage.onChanged.addListener(function (changes) {

    for (const key in changes) {
        const storageChange = changes[key];
        switch (storageChange.newValue) {
            case "words" :
                chrome.browserAction.setIcon({
                    path: {
                        "16": "assets/panda16black.png",
                        "32": "assets/panda32black.png"
                    }
                });
                break;
            case "contents" :
                chrome.browserAction.setIcon({
                    path: {
                        "16": "assets/panda16black.png",
                        "32": "assets/panda32black.png"
                    }
                });
                break;
            case "undefined" :
                chrome.browserAction.setIcon({
                    path: {
                        "16": "assets/panda16white.png",
                        "32": "assets/panda32white.png"
                    }
                });
                break;
        }
    }
});