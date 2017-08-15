var cImages = 0;
var cLinks = 0;
var SarahahGreen = [68, -41, -8];

//Value determined based on distribution of the values of the Sample Set - 95% Confidence Levels
var THRESHOLD = 8;

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
      links: Math.floor(cLinks / 3)
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

function profileImage(image) {
  var img = document.createElement('img');
  img.setAttribute('crossorigin', 'anonymous');
  img.setAttribute('src', image.src)
  img.addEventListener('load', function () {
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches();
    var distance = deltaE(SarahahGreen, rgb2lab(swatches['Vibrant'].getRgb()));
    
    if (distance < THRESHOLD) {
      hidePost(image);
    }
  });
}

function colorDistance(rgb) {
  var i = 0;
  var d = 0;
  for (i = 0; i < 3; i++) {
    d += (rgb[i] - SarahahGreen[i]) * (rgb[i] - SarahahGreen[i]);
  }
  return Math.sqrt(d);
};

function hidePost(dom) {
  if (dom.src != null) cImages = cImages + 1;
  if (dom.href != null) cLinks = cLinks + 1;
  $(dom).parents(".fbUserPost").parent().parent().css("display", "none");
}

function rgb2lab(rgb) {
  var r = rgb[0] / 255,
    g = rgb[1] / 255,
    b = rgb[2] / 255,
    x, y, z;

  r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
  z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = (x > 0.008856) ? Math.pow(x, 1 / 3) : (7.787 * x) + 16 / 116;
  y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y) + 16 / 116;
  z = (z > 0.008856) ? Math.pow(z, 1 / 3) : (7.787 * z) + 16 / 116;

  return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
}

function deltaE(labA, labB) {
  var deltaL = labA[0] - labB[0];
  var deltaA = labA[1] - labB[1];
  var deltaB = labA[2] - labB[2];
  var c1 = Math.sqrt(labA[1] * labA[1] + labA[2] * labA[2]);
  var c2 = Math.sqrt(labB[1] * labB[1] + labB[2] * labB[2]);
  var deltaC = c1 - c2;
  var deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  var sc = 1.0 + 0.045 * c1;
  var sh = 1.0 + 0.015 * c1;
  var deltaLKlsl = deltaL / (1.0);
  var deltaCkcsc = deltaC / (sc);
  var deltaHkhsh = deltaH / (sh);
  var i = deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}