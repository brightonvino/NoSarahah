var iCounter = 0;
var lCounter = 0;
var iEnable = true;
var lEnable = true;

var img = document.createElement('img');
img.setAttribute('crossorigin', 'anonymous');

function vibrate(image) {
  img.setAttribute('src', image.src)
  img.addEventListener('load', function () {
    var vibrant = new Vibrant(img);
    var swatches = vibrant.swatches()
    var pop = swatches['Vibrant'].getPopulation();
    console.log(pop, image.src);
    if (pop > 10800 && pop < 11300 || pop > 8300 && pop < 8700) {
      hidePost(image);
    }
  });
}

function cThief(src) {
  var img = document.createElement('img');
  img.setAttribute('crossorigin', 'anonymous');
  img.setAttribute('src', src)

  img.addEventListener('load', function () {
    var colorThief = new ColorThief();
    var pal = colorThief.getPalette(img, 2);
    console.log(pal);
  });
}

// First load scan
document.addEventListener('DOMContentLoaded', function () {
  scanImages(document.querySelectorAll("div.fbUserPost img.img"));
  scanLinks(document.querySelectorAll("a[href*='sarahah.com']"));
});

//Observe mutation on the feed for newly loaded posts for Sarahah Images
var observer = new MutationSummary({
  callback: iSarahah,
  queries: [{
    element: 'img.img'
  }]
});

//Observe mutation on the feed for newly loaded posts for Sarahah Links
var observer = new MutationSummary({
  callback: lSarahah,
  queries: [{
    element: "a[target='_blank']"
  }]
});

function iSarahah(fbUserPost) {
  scanImages(fbUserPost[0].added);
}

function lSarahah(fbUserPost) {
  fbUserPost[0].added.forEach(function (newEl) {
    if (newEl.href != null && newEl.href.includes("sarahah.com")) {
      hidePost(newEl);
    }
  });
}

function scanImages(images) {
  images.forEach(function (image) {
    if (image.width != null && image.width > 450) {
      if ((image.height === 0) || (image.height != 0 && image.width === image.height)) {
        vibrate(image);
        // console.log(pop);
        // if (pop > 10800 && pop < 11300) {
        //   hidePost(image);
        // }

        // resemble("https://raw.githubusercontent.com/siriscac/sarahah_blocker_fb/master/ref/base.png").compareTo(image.src).scaleToSameSize().ignoreAntialiasing().onComplete(function (data) {
        //   if (data.rawMisMatchPercentage < 30) {
        //     vibrate(image.src);
        //     hidePost(image)
        //   }
        // });
      }
    }
  });
}

function scanLinks(details) {
  details.forEach(function (detail) {
    hidePost(detail);
  });
}

function hidePost(dom) {
  if (dom.src != null) {
    iCounter++;
  }
  if (dom.href != null) {
    lCounter++;
  }
  $(dom).parents(".fbUserPost").parent().parent().css("display", "none");
}