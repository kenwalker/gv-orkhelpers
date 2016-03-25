var results = [];
var numberOfPlayers;
var timer;

// A function to use as callback
function awardsFromData(pageContent) {
	var $pageContent = $(pageContent);
	var awards = ["Dragon", "Flame", "Garber", "Gryphon", "Hydra", "Jovious", "Lion", "Mask", "Owl", "Rose", "Warrior", "Zodiac"];
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
	timer = setInterval(waitToFinish, 1000);
}

function awardsFromParkURL(parkURL) {
	var parkNumber = parkURL.slice(parkURL.indexOf('index/') + 6);
	$.get("https://amtgard.com/ork/orkui/index.php?Route=Reports/roster/Park&id=" + parkNumber, function( data ) {
		awardsFromData(data);
	});
}

function waitToFinish() {
	if (results.length == numberOfPlayers) {
		clearInterval(timer);
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
