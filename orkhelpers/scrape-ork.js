var results = [];
var numberOfPlayers;
var numberOfEvents;
var timer;
var tacdOutput = "";
var quarters = [];
quarters['1'] = ['01', '02', '03'];
quarters['2'] = ['04', '05', '06'];
quarters['3'] = ['07', '08', '09'];
quarters['4'] = ['10', '11', '12'];
quarter = quarters[1];

function awardsFromPlayerData(pageContent) {
	var $pageContent = $(pageContent);
	var awards = ["Dragon", "Flame", "Garber", "Gryphon", "Hydra", "Jovious", "Lion", "Mask", "Owl", "Rose", "Smith", "Warrior", "Zodiac"];
	var arrayLength = awards.length;
	var players = $pageContent.find("a[href*='Route=Player']");
	numberOfPlayers = players.length;
	players.each(function(index, player) {
	    var url = new URL(player.href);
	    url.protocol = 'https';
	    $.get(url.href, function( data ) {
	      var $playerHTML = $(data);
	      var persona = $playerHTML.find("span:contains('Persona:')").next().html();
	      var outputLine = persona + "\t";
	      for (var i = 0; i < arrayLength; i++) {
	        var award = awards[i];
	        var awardCount = $playerHTML.find("#Awards td:contains('" + award + "')").length;
	        outputLine = outputLine + award + " " + awardCount;
	        if (i < arrayLength - 1)
	          outputLine = outputLine + "\t";
	      }
	      results = results.concat(outputLine + "\r\n");
	    });    
	});
	timer = setInterval(waitForAwards, 1000);
}

function attendanceFromPlayerData(pageContent, minAttendance) {
	var $pageContent = $(pageContent);
	var players = $pageContent.find("a[href*='Route=Player']");
	numberOfPlayers = players.length;
	players.each(function(index, player) {
	    var url = new URL(player.href);
	    
	    // set up a date at midnight 6 months ago at the beginning of the Goldenvale week starting on Sunday
	    var sixMonthsAgo = setMomentToMidnight(moment());
	    sixMonthsAgo.set('month', sixMonthsAgo.get('month') - 6);
	    sixMonthsAgo.startOf('week');
	    var earliestAttendance;

	    url.protocol = 'https';
	    $.get(url.href, function( data ) {
	      // debugger;
		  // placeholder for keeping track of current weeks attendance
		  var currentWeek = null;
		    
		  var attendanceCount = 0;
	      var $playerHTML = $(data);
	      var $attendance = $($($playerHTML.find("#Attendance thead")[1]).parent().children()[1]).children();
	      var persona = $playerHTML.find("span:contains('Persona:')").next().html();
	      var duesPaid = $playerHTML.find("span:contains('Dues Paid:')").next().html();
	      if (duesPaid != "No") {
	      	duesPaid = moment(duesPaid) <= moment() ? "No" : "Yes";
	      }
	      var parks = [];
	      $attendance.each(function() {
	      	$attendanceTR = $(this);
	      	$attendanceDateTD = $attendanceTR.children().first();
	      	var newAttendanceInWeek = false;
	      	var dateText = $attendanceDateTD.text();
	      	console.log("<" + dateText + "> for " + persona);
	      	attendanceDate = setMomentToMidnightPlusOne(moment(dateText));
	      	earliestAttendance = attendanceDate;
	      	attendancePark = $($attendanceTR.children()[2]).text();
	      	if (attendancePark.length == 0) {
		      	attendancePark = $($attendanceTR.children()[3]).text();
	      	}
	      	if (attendanceDate > sixMonthsAgo) {
		      	if (currentWeek) {
		      		if (attendanceDate < currentWeek) {
		      			newAttendanceInWeek = true;
		      		}
		      	} else {
		      			newAttendanceInWeek = true;
		      	}
		      	if (newAttendanceInWeek) {
	      			currentWeek = startOfWeekFor(attendanceDate);	      		
		      		attendanceCount = attendanceCount + 1;
			      	if (!parks.includes(attendancePark)) {
			      		parks.push(attendancePark);
		      		}

		      	}
		     }
	      });
	      results.push(persona + "\t" + (((attendanceCount > (minAttendance - 1)) && earliestAttendance <= sixMonthsAgo) ? 'yes' : 'no') + "\t" + attendanceCount + "\t" + duesPaid + "\t" + parks.join(", ") + "\r\n");
	    });    
	});
	timer = setInterval(waitForAttendance, 1000);
}

function awardsFromParkURL(parkURL) {
	var parkNumber = parkNumberFromURL(parkURL);
	$.get("https://amtgard.com/ork/orkui/index.php?Route=Reports/roster/Park&id=" + parkNumber, function( data ) {
		awardsFromPlayerData(data);
	});
}

function attendanceKingdomFromParkURL(parkURL) {
	var parkNumber = parkNumberFromURL(parkURL);
	$.get("https://amtgard.com/ork/orkui/index.php?Route=Reports/roster/Park&id=" + parkNumber, function( data ) {
		attendanceFromPlayerData(data, 10);
	});
}

function attendanceNorthernEmpireFromParkURL(parkURL) {
	var parkNumber = parkNumberFromURL(parkURL);
	$.get("https://amtgard.com/ork/orkui/index.php?Route=Reports/roster/Park&id=" + parkNumber, function( data ) {
		attendanceFromPlayerData(data, 6);
	});
}

function tacdFromParkURL(parkURL) {
	var parkNumber = parkNumberFromURL(parkURL);
	var goldenvalePark;
	var parkName;
	$.get(parkURL, function( data ) {
		$parkData = $(data);
		goldenvalePark = isNorthernEmpirePark($parkData);
		parkName = parkNameFrom($parkData);	
		numMonths = 5;
	    attendanceDates = new Array();
	    playerList = new HashMap();
	    console.log("============== " + parkName + " ==============");

	    // officers = getOfficers('http://amtgard.com/ork/orkui/index.php?Route=Admin/setparkofficers&ParkId=' + parkID);

	    // monarch = officers['Monarch'];
	    // console.log("Monarch: " + monarch['player'] + " (ORK id: " + monarch['user'] + ") ");
	    // console.log("\r\nEmail or Contact Info: ____________________________________\r\n");

	    // primeminister = officers['Prime Minister'];
	    // console.log("Prime Minister: " + primeminister['player'] + " (ORK id: " + primeminister['user'] + ") ");
	    // console.log("\r\nEmail or Contact Info: ____________________________________\r\n");

	    // regent = officers['Regent'];
	    // console.log("Regent: " + regent['player'] + " (ORK id: " + regent['user'] + ") ");
	    // console.log("\r\nEmail or Contact Info: ____________________________________\r\n");

	    // champion = officers['Champion'];
	    // console.log("Champion: " + champion['player'] + " (ORK id: " + champion['user'] + ") ");
	    // console.log("\r\nEmail or Contact Info: ____________________________________\r\n");

     	aURL = 'http://amtgard.com/ork/orkui/index.php?Route=Reports/attendance/Park/' + parkNumber + '/Months/' + numMonths;
    	getAttendanceDates(aURL);

	});

}

function waitForAwards() {
	if (results.length == numberOfPlayers) {
		clearInterval(timer);
		results.sort(function (a, b) {
  			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		results.unshift("Persona\tDragon\tFlame\tGarber\tGryphon\tHydra\tJovious\tLion\tMask\tOwl\tRose\tSmith\tWarrior\tZodiac\r\n");

		$('#status').html("Done!<br>The results are in your clipboard<br>You should be able to paste<br>directly into a spreadsheet");
		$('#loader').hide();
		copyTextToClipboard(results.join(""));
	} else {
		$('#status').html(results.length + " of " + numberOfPlayers + " players")
	}
}

function waitForAttendance() {
	if (results.length == numberOfPlayers) {
		clearInterval(timer);
		results.sort(function (a, b) {
  			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		results.unshift("Persona\tQualified\tTimes in last 6 Months\tDues Paid\tParks\r\n");

		$('#status').html("Done!<br>The results are in your clipboard<br>You should be able to paste<br>directly into a spreadsheet");
		$('#loader').hide();
		copyTextToClipboard(results.join(""));
	} else {
		$('#status').html(results.length + " of " + numberOfPlayers + " players")
	}
}

function waitForTaCD() {
	if (results.length == numberofEvents) {
		clearInterval(timer);

	    console.log("Year\tMonth\t1-15th\t16th-on\ttotal");
	    playerList.forEach(function(aMonthMap, aYear) {
	        aMonthMap.forEach(function(breakdown, aMonth) {
	            if (quarter.indexOf(aMonth) != -1) {
	                console.log(aYear + "\t" + aMonth + "\t" + breakdown.get('begin').length + "\t" + breakdown.get('end').length + "\t" + breakdown.get('month').length);
	            }
	        })
	    })
	} else {
		$('#status').html(results.length + " of " + numberofEvents + " events")
	}
}

function copyTextToClipboard(text) {
	var copyFrom = $('<textarea/>');
	copyFrom.css({
	 position: "absolute",
	 left: "-1000px",
	 top: "-1000px",
	});
	 copyFrom.text(text);
	 $('body').append(copyFrom);
	 copyFrom.select();
	 document.execCommand('copy');
}

function parkNumberFromURL(parkURL) {
	return parkURL.slice(parkURL.indexOf('index/') + 6);
}

function setMomentToMidnight(aMoment) {
	aMoment.set('hour', 0);
	aMoment.set('minue', 0);
	aMoment.set('second', 0);
	aMoment.set('millisecond', 0);
	return aMoment;
}

function setMomentToMidnightPlusOne(aMoment) {
	setMomentToMidnight(aMoment);
	aMoment.set('second', 1);
	return aMoment;
}

function startOfWeekFor(aMoment) {
	var startOfWeek = aMoment.clone();
	setMomentToMidnight(startOfWeek);
	startOfWeek.startOf('week');
	return startOfWeek;
}

function isNorthernEmpirePark($pageContent) {
	return $pageContent.find("li:contains('The Northern Empire')").length == 1
} 

function parkNameFrom($pageContent) {
	return $($($pageContent.children()[1]).children()[3]).text()
}

function getPlayersFromUrl(playersURL, aBeginEnd, aMonth) {
	$.get(playersURL, function( data ) {
		var $playersHTML = $(data);
		$playersHTML.find('.information-table').children().last().children().each(function(index, player) {
			$player = $(player);
	        playerName = $($player.children()[2]).text();
	        if (aBeginEnd.indexOf(playerName) == -1)
	            aBeginEnd.push(playerName);
	            // console.log(beginEnd);
	        if (aMonth.indexOf(playerName) == -1)
	            aMonth.push(playerName);
	            // console.log(aMonth);
	    });
	    results.push('more');
	});
}

function getAttendanceDates(attendanceURL) {
	$.get(attendanceURL, function( data ) {
    	var $attendanceURL = $(data);
    	var $attendanceDates = $attendanceURL.find('.information-table').children().first().next().children();
    	numberofEvents = $attendanceDates.length;
    	$attendanceDates.each(function(index, attendanceDate) {
    		$attendanceDate = $(attendanceDate);
	        aDateURL = "https:" + $attendanceDate.attr('onclick').substring($attendanceDate.attr('onclick').indexOf('//'));
	        aDateURL = aDateURL.substring(0, aDateURL.length - 1);
	        aDate = $attendanceDate.children().first().text();
	        aMonthList = monthListForDate(aDate);
	        beginEnd = null;
	        if (aDate.split('-')[2] < 16) {
	            beginEnd = aMonthList.get('begin');
	        } else {
	            beginEnd = aMonthList.get('end');
	        }
	        getPlayersFromUrl(aDateURL, beginEnd, aMonthList.get('month'));
	    });
		timer = setInterval(waitForTaCD, 1000);
	});
}

function monthListForDate(aDate) {
    dateArray = aDate.split('-');
    year = dateArray[0];
    month = dateArray[1];
    day = dateArray[2];
    yearMap = null;
    monthMap = null;
    yearMap = playerList.get(year);
    if (!yearMap) {
        yearMap = new HashMap();
        playerList.set(year, yearMap);
    }
    monthMap = yearMap.get(month);
    if (!monthMap) {
        monthMap = new HashMap();
        monthMap.set("begin", new Array());
        monthMap.set("end", new Array());
        monthMap.set("month", new Array());
        yearMap.set(month, monthMap);
    }
    return monthMap;
}
