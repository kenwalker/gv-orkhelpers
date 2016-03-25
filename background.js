function calculateAwards() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the awards.html
    var url = 'awards.html#' + orkParkPage.pageUrl;

    // Create a new window to the awards page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

function calculateTaCD() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the tacd.html
    var url = 'tacd.html#' + orkParkPage.pageUrl;

    // Create a new window to the tacd page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

/**
 * Create a context menu which will only show up for ORK Park pages.
 */
chrome.contextMenus.create(
  {
    "title" : "Calculate all awards",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAwards()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Calculate TaCD",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateTaCD()
  }
);
