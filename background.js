chrome.runtime.onMessage.addListener(function (msg, sender) {
    if ((msg.from === 'content') && (msg.subject === 'showPageAction')) {
        chrome.pageAction.show(sender.tab.id);
    }
});

chrome.tabs.onActivated.addListener(function (info) {
    chrome.tabs.get(info.tabId, function (change) {
        if (change.url == undefined) {
            chrome.browserAction.setPopup({ tabId: info.tabId, popup: '' });
            chrome.browserAction.setIcon({ path: 'icon-disabled.png', tabId: info.tabId });
        }
        else if (change.url.match(/h*\/*.facebook\.com*/) == null) {
            chrome.browserAction.setPopup({ tabId: info.tabId, popup: '' });
            chrome.browserAction.setIcon({ path: 'icon-disabled.png', tabId: info.tabId });
        }
        else {
            chrome.browserAction.setPopup({ tabId: info.tabId, popup: 'popup.html' });
            chrome.browserAction.setIcon({ path: 'icon.png', tabId: info.tabId });
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, change, tab) {
    if (tab.url == undefined) {
        return;
    }
    else if (tab.url.match(/h*\/*.facebook\.com*/) == null) {
        chrome.browserAction.setPopup({ tabId: tabId, popup: '' });
        chrome.browserAction.setIcon({ path: 'icon-disabled.png', tabId: tabId });
    }
    else {
        chrome.browserAction.setPopup({ tabId: tabId, popup: 'popup.html' });
        chrome.browserAction.setIcon({ path: 'icon.png', tabId: tabId });
    }
});