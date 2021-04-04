// initialization - check storage values to color the right button:

chrome.tabs.onCreated.addListener(function () {
    checkCurrentOption();
});
chrome.tabs.onUpdated.addListener(function () {
    checkCurrentOption();
});

checkCurrentOption();

function checkCurrentOption () {
    chrome.storage.local.get(null, function (result) {
        if (result.option === "words") {
            colorButton("words");
        } else if (result.option === "contents") {
            colorButton("contents");
        }
    });
}

// toggle button colors and set storage values

function handleClick(buttonID, otherButtonID) {
    chrome.storage.local.get(null, function (result) {
        if (result.option !== buttonID) {
            chrome.storage.local.set({"option": buttonID});
            colorButton(buttonID);
            decolorButton(otherButtonID)
        } else if (result.option === buttonID) {
            chrome.storage.local.set({"option": "undefined"});
            decolorButton(buttonID);
        }
    });
}

function colorButton(buttonID) {
    document.getElementById(buttonID).style.backgroundColor = "#6FA271";
}

function decolorButton(buttonID) {
    document.getElementById(buttonID).style.backgroundColor = "#978279";
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("words").addEventListener("click", function () {return handleClick("words", "contents")});
    document.getElementById("contents").addEventListener("click", function () {return handleClick("contents", "words")});

});