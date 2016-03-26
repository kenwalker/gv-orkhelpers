var results = [];
var numberOfPlayers;
var timer;

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

	    url.protocol = 'https';
	    $.get(url.href, function( data ) {
		  // placeholder for keeping track of current weeks attendance
		  var currentWeek = null;
		    
		  var attendanceCount = 0;
	      var $playerHTML = $(data);
	      var $attendance = $playerHTML.find("#Attendance a[href*='Route=Attendance']");
	      var persona = $playerHTML.find("span:contains('Persona:')").next().html();
	      var duesPaid = $playerHTML.find("span:contains('Dues Paid:')").next().html();
	      if (duesPaid != "No") {
	      	duesPaid = moment(duesPaid) <= moment() ? "No" : "Yes";
	      }
	      if (persona == 'Elridien') {
	      	debugger;
	      }
	      var parks = [];
	      $attendance.each(function() {
	      	$attendanceTR = $(this);
	      	var newAttendanceInWeek = false;
	      	attendanceDate = setMomentToMidnightPlusOne(moment($attendanceTR.text()));
	      	attendancePark = $attendanceTR.parent().next().next().text();
	      	if (attendancePark.length == 0) {
		      	attendancePark = $attendanceTR.parent().next().next().next().text();
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
	      results.push(persona + "\t" + (attendanceCount > (minAttendance - 1) ? 'yes' : 'no') + "\t" + attendanceCount + "\t" + duesPaid + "\t" + parks.join(", ") + "\r\n");
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
