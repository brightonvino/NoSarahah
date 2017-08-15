function setDOMInfo(info) {
  document.getElementById('cImages').textContent = info.images;
  document.getElementById('cLinks').textContent = info.links;
}

window.addEventListener('DOMContentLoaded', function () {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { from: 'popup', subject: 'DOMInfo' },
      setDOMInfo);
  });
});
