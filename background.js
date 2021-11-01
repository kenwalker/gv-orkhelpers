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

function calculateEventAttendance() {
  return function(orkParkPage, tab) {

    // Pass the ORK page to the tacd.html
    var url = 'eventAttendance.html#' + orkParkPage.pageUrl;

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
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAwards()
  }
);
chrome.contextMenus.create(
  {
    "title" : "GV Kingdom attendance qualified",
    "type" : "normal",
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAttendanceKingdom()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Nine Blades attendance qualified",
    "type" : "normal",
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateAttendanceNorthernEmpire()
  }
);
chrome.contextMenus.create(
  {
    "title" : "TaCD document generator",
    "type" : "normal",
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateTaCD()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Event Attendance",
    "type" : "normal",
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateEventAttendance()
  }
);
chrome.contextMenus.create(
  {
    "title" : "Retired but Active list",
    "type" : "normal",
    "documentUrlPatterns": ["https://ork.amtgard.com/orkui/index.php?Route=Park/index/*", "https://ork.amtgard.com/orkui/index.php?Route=Park/index/*"],
    "onclick" : calculateRetiredPlayers()
  }
);
