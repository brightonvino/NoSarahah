var cImages = 0;
var cLinks = 0;

var feedRoot = document.querySelectorAll('[role="feed"]')[0];

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'showPageAction'
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (msg, sender, response) {
  if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
    var domInfo = {
      images: cImages,
      links: cLinks
    };
    response(domInfo);
  }
});

// First load scan
document.addEventListener('DOMContentLoaded', function () {
  scanImages(document.querySelectorAll("div.fbUserPost img.img"));
  scanLinks(document.querySelectorAll("a[href*='sarahah.com']"));
});

//Observe mutation on the feed for newly loaded posts for Sarahah Images
var observer = new MutationSummary({
  callback: iSarahah,
  rootNode: feedRoot,
  queries: [{
    element: 'img.img'
  }]
});

function iSarahah(fbUserPost) {
  scanImages(fbUserPost[0].added);
}

//Observe mutation on the feed for newly loaded posts for Sarahah Links
var observer = new MutationSummary({
  callback: lSarahah,
  rootNode: feedRoot,
  queries: [{
    element: "a[target='_blank']"
  }]
});

function lSarahah(fbUserPost) {
  fbUserPost[0].added.forEach(function (newEl) {
    if (newEl.href != null && newEl.href.includes("sarahah.com")) {
      hidePost(newEl);
    }
  });
}

function scanImages(images) {
  //Optimized to skip Emoji, Profile Thumbnails
  images.forEach(function (image) {
    if (image.width != null && image.width > 450)
      if ((image.height === 0) || (image.height != 0 && image.width === image.height))
        profileImage(image);
  });
}

function scanLinks(details) {
  details.forEach(function (detail) {
    hidePost(detail);
  });
}

var img = document.createElement('img');
img.setAttribute('crossorigin', 'anonymous');

function profileImage(image) {
  img.setAttribute('src', image.src)
  img.addEventListener('load', function () {
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches()
    var pop = swatches['Vibrant'].getPopulation();

    //Value determined based on distribution of the values of the Sample Set
    if (pop > 10000 && pop < 12000 || pop > 8000 && pop < 9000) {
      hidePost(image);
      console.log(pop, image.src);
    }
  });
}

function hidePost(dom) {
  if (dom.src != null) cImages = cImages + 1;
  if (dom.href != null) cLinks = cLinks + 1;
  $(dom).parents(".fbUserPost").parent().parent().css("display", "none");
}