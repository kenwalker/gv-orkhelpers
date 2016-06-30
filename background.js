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

function calculateAttendance8in6() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the tacd.html
    var url = 'attendance8in6.html#' + orkParkPage.pageUrl;

    // Create a new window to the attendance page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

function calculateAttendanceKingdom() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the tacd.html
    var url = 'attendanceKingdom.html#' + orkParkPage.pageUrl;

    // Create a new window to the attendance page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

function calculateAttendanceNorthernEmpire() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the tacd.html
    var url = 'attendanceNorthernEmpire.html#' + orkParkPage.pageUrl;

    // Create a new window to the attendance page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};

function calculateRetiredPlayers() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the awards.html
    var url = 'retired-check.html#' + orkParkPage.pageUrl;

    // Create a new window to the retired players page.
    chrome.windows.create({ url: url, width: 520, height: 660 });
  };
};


/**
 * Create a context menu which will only show up for ORK Park pages.
 */
chrome.contextMenus.create(
  {
    "title" : "Awards list for all players",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAwards()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Kingdom attendance qualified",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAttendanceKingdom()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Northern Empire attendance qualified",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAttendanceNorthernEmpire()
  }
);
chrome.contextMenus.create(
  {
    "title" : "8 times in 6 months attendance qualified",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAttendance8in6()
  }
);
chrome.contextMenus.create(
  {
    "title" : "TaCD document generator",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateTaCD()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Retired but Active list",
    "type" : "normal",
    "documentUrlPatterns": ["https://amtgard.com/ork/orkui/index.php?Route=Park/index/*", "http://amtgard.com/ork/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateRetiredPlayers()
  }
);
