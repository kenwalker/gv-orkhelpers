var MONTHS = ["Bogus", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var results = [];
var numberOfPlayers;
var numberOfEvents;
var timer;
var tacdOutput = "";
var tacdQuarter;
var tacdYear;
var officers = {};
var finishedOfficers = true;
var parkName;
var isNorthernEmpirePark = false;
var quarters = [];
quarters['1'] = ['01', '02', '03'];
quarters['2'] = ['04', '05', '06'];
quarters['3'] = ['07', '08', '09'];
quarters['4'] = ['10', '11', '12'];
quarter = quarters[1];
var playedWithinOneYear = [];

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
	isNorthernEmpirePark = checkIfNorthernEmpirePark($pageContent);
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
		  meetsStartingAttendance = isNorthernEmpirePark ? earliestAttendance <= sixMonthsAgo : true;
	      results.push(persona + "\t" + (((attendanceCount > (minAttendance - 1)) && meetsStartingAttendance) ? 'yes' : 'no') + "\t" + attendanceCount + "\t" + duesPaid + "\t" + parks.join(", ") + "\r\n");
	    });    
	});
	timer = setInterval(waitForAttendance, 1000);
}

function retirementCheckFromRetiredData(pageContent) {
	var $pageContent = $(pageContent);
	var players = $pageContent.find("a[href*='Route=Player']");
	numberOfPlayers = players.length;

    // set up a date at midnight eight months ago at the beginning of the Goldenvale week starting on Sunday
    var eightMonthsAgo = setMomentToMidnight(moment());
    eightMonthsAgo.set('month', eightMonthsAgo.get('month') - 8);
    eightMonthsAgo.startOf('week');
    var counter = 0;

	players.each(function(index, player) {
		counter = counter + 1;
	    var urlAttendance = new URL(player.href);
	    urlAttendance.protocol = 'https';

	    $.get(urlAttendance.href, function( data ) {
	      var $playerHTML = $(data);
	      var $attendance = $($($playerHTML.find("#Attendance thead")[1]).parent().children()[1]).children();
	      var personaAttendance = $playerHTML.find("span:contains('Persona:')").next().html();
	      var withinOneYear = false;
	      var foundButOlderThanOneYear = false;
	      $attendance.each(function() {
	      	if (!withinOneYear && !foundButOlderThanOneYear) {
		      	$attendanceTR = $(this);
		      	$attendanceDateTD = $attendanceTR.children().first();
		      	var newAttendanceInWeek = false;
		      	var dateText = $attendanceDateTD.text();
		      	// console.log("<" + dateText + "> for " + personaAttendance);
		      	attendanceDate = setMomentToMidnightPlusOne(moment(dateText));
		      	if (attendanceDate > eightMonthsAgo) {
		      		withinOneYear = true;
		      	}
		      	if (attendanceDate < eightMonthsAgo) {
		      		foundButOlderThanOneYear = true;
		      	}
		    }
	      });
	      if (personaAttendance == "" || personaAttendance == "...") {
	      	console.log("removing (" + personaAttendance + ")");
	      	numberOfPlayers = numberOfPlayers - 1;
	      } else {
	      	if (personaAttendance in playedWithinOneYear) {
	      		numberOfPlayers = numberOfPlayers - 1;
	      	} else {
		      	if (withinOneYear) {
		      		var playerNumber = this.url.split("/").pop();
				    playedWithinOneYear[personaAttendance] = "https://amtgard.com/ork/orkui/index.php?Route=Player/index/" + playerNumber;
				} else {
					numberOfPlayers = numberOfPlayers - 1;
				}
			}
	      }
	    });
	});
	timer = setInterval(waitForRetiredCheck, 1000);
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

function retiredCheckFromParkURL(parkURL) {
	var parkNumber = parkNumberFromURL(parkURL);
	$.get("https://amtgard.com/ork/orkui/index.php?Route=Reports/inactive/Park&id=" + parkNumber, function( data ) {
		retirementCheckFromRetiredData(data);
	});
}

function tacdFromParkURL(parkURL, aQuarter, aYear) {
	var parkNumber = parkNumberFromURL(parkURL);
	tacdQuarter = aQuarter;
	tacdYear = aYear;
	var goldenvalePark;
	quarter = quarters[tacdQuarter];
	$.get(parkURL, function( data ) {
		$parkData = $(data);
		isNorthernEmpirePark = checkIfNorthernEmpirePark($parkData);
		parkName = parkNameFrom($parkData);	
		numMonths = 14;
	    attendanceDates = new Array();
	    playerList = new HashMap();
	    console.log("============== " + parkName + " ==============");

	    getOfficers('http://amtgard.com/ork/orkui/index.php?Route=Admin/setparkofficers&ParkId=' + parkNumber);

     	aURL = 'http://amtgard.com/ork/orkui/index.php?Route=Reports/attendance/Park/' + parkNumber + '/Months/' + numMonths;
    	getAttendanceDates(aURL);

	});

}

function getOfficers(officersURL) {
    var fields = ['user', 'player', 'role', 'position', 'hidden1', 'hidden2'];
    $.get(officersURL, function( data ) {
		$officerData = $(data);
	    $officerList = $officerData.find('.information-table').children().first().next().children();
    	$officerList.each(function() {
	        anOfficer = {};
    	    var fieldPosition = 0;
        	var $officerRow = $(this).first().children()
       		$officerRow.each(function () {
            	$rowItem = $(this);
            	anOfficer[fields[fieldPosition]] = $rowItem.text();
            	fieldPosition++;
        	});
        	if (anOfficer['position']) {
           		officers[anOfficer['position']] = anOfficer;
        	}
    	});
    	finishedOfficers = true;
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

function waitForRetiredCheck() {
	var currentCount = Object.keys(playedWithinOneYear).length;
	if (currentCount == numberOfPlayers) {
		clearInterval(timer);
		results.unshift("Persona\tPlayer URL\r\n");
		var sortedPersonas = Object.keys(playedWithinOneYear).sort(function (a, b) {
  			return a.toLowerCase().localeCompare(b.toLowerCase());
		});
		sortedPersonas.forEach( function (persona) {
			results.push(persona + "\t" + playedWithinOneYear[persona] + "\r\n");
		})

		$('#status').html("Done!<br>The results are in your clipboard<br>You should be able to paste<br>directly into a spreadsheet");
		$('#loader').hide();
		copyTextToClipboard(results.join(""));
	} else {
		$('#status').html(currentCount + " of " + numberOfPlayers + " players")
	}
}

function waitForTaCD() {
	if (results.length == numberofEvents && finishedOfficers) {
		clearInterval(timer);
		output = [];

		kingdom = isNorthernEmpirePark ? "Northern Empire" : "Kingdom of Goldenvale";
		output.push("== " + quarterAbbreviation(tacdQuarter) + " quarter, " + tacdYear + " TacD for " + parkName + " in the " + kingdom + " ==\r\n\r\n");

	    monarch = officers['Monarch'];
	    output.push("Monarch: " + monarch['player'] + " (ORK id: " + monarch['user'] + ") \r\n\r\n");
	    output.push("Email or Contact Info: ____________________________________\r\n\r\n");

	    primeminister = officers['Prime Minister'];
	    output.push("Prime Minister: " + primeminister['player'] + " (ORK id: " + primeminister['user'] + ") \r\n\r\n");
	    output.push("Email or Contact Info: ____________________________________\r\n\r\n");

	    regent = officers['Regent'];
	    output.push("Regent: " + regent['player'] + " (ORK id: " + regent['user'] + ") \r\n\r\n");
	    output.push("Email or Contact Info: ____________________________________\r\n\r\n");

	    champion = officers['Champion'];
	    output.push("Champion: " + champion['player'] + " (ORK id: " + champion['user'] + ") \r\n\r\n");
	    output.push("Email or Contact Info: ____________________________________\r\n\r\n");

	    output.push("Year\tMonth\t1-15th\t16th-on\ttotal unique attendance\r\n");
	    playerList.forEach(function(aMonthMap, aYear) {
	    	if (aYear == tacdYear) {
		        aMonthMap.forEach(function(breakdown, aMonth) {
		            if (quarter.indexOf(aMonth) != -1) {
		                output.push(aYear + "\t" + aMonth + "\t" + breakdown.get('begin').length + "\t" + breakdown.get('end').length + "\t" + breakdown.get('month').length + "\r\n");
		            }
		        })
		     }
	    })
	    output.push("\r\n\r\n");
	    if (!isNorthernEmpirePark) {
	        quarter.forEach(function(aMonth) {
	    	    output.push("\r\nFor " + MONTHS[parseInt(aMonth)] + ", _________ terms of dues paid by ____________________________________");
	        	output.push("\r\nexample 3 terms of dues paid (Ann x2 and Bob x1)\r\n");
	    	});
		    output.push("\r\n_____ Total terms of dues paid, ____ (1$ per term paid) owed to the kingdom coffers.");
		}
		appendInstructions(output, isNorthernEmpirePark);
		copyTextToClipboard(output.join(""));
		$('#status').html("Done!<br>The TaCD results are in your clipboard<br>You should be able to paste<br>directly into an email");
		$('#loader').hide();
		$("#rerun-tacd").show();
	} else {
		$('#status').html("Looking at " + results.length + " of " + numberofEvents + " attendance dates")
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

function checkIfNorthernEmpirePark($pageContent) {
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

function quarterAbbreviation(quarter) {
  switch(quarter) {
    case 1:
      return '1st';
    case 2:
      return '2nd';
    case 3:
      return '3rd';
    case 4:
      return '4th';
  }
}

function appendInstructions(output, isNorthernEmpirePark) {
	var instructions1 = "\r\n\r\nHERE IS WHAT YOU HAVE TO DO:\r\n\r\n\
If your Officers do not look right then the ORK is not right, I just grab it from there.\r\n\
Sadly, I cannot get the email addresses from the ORK. So that is a manual task on your side.\r\n\
Take everything above after you have modified it and email it to the Goldenvale Prime Minister. That email address can \
be found on the Facebook Goldenvale Officers page.  If you do not have access ask Ken Walker.\r\n\r\n";

	var gvInstructions = "Goldenvale CORE Parks you have to both update your specific page with your \
officers contact information, if you have updated that you should be able to find that on your own ORK officers page. \
The other thing you have to do is enter in the \
terms paid per month, by whom and for how many terms they paid. Then you have to show how much tax you are \
contributing.\r\b\r\n";

	var instructions2 = "Technically for the latest TaCD you do not need the mid month attendance but sometimes it may be useful so I am leaving it in there.\r\n\r\n\
Any issues, please PM me or comment on the GV Officers Page,\r\n\
Ken Walker, Lord Kismet of Felfrost, Mover of Bits (ok, I made that up)";

	output.push(instructions1);
	if (!isNorthernEmpirePark) {
		output.push(gvInstructions);
	}
	output.push(instructions2);
}
