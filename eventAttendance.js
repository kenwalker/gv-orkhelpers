document.addEventListener("DOMContentLoaded", function () {
  // The URL of the park to load is passed on the URL fragment.
  var parkURL = window.location.hash.substring(1);
  var generateAttendance = document.getElementById('generate-event-addendance');
  var startDateElement = document.getElementById('start-date');
  var endDateElement = document.getElementById('end-date');
  // var rerunTaCD = document.getElementById('rerun-tacd');
  $("#loader").hide();
  // $("#rerun-tacd").hide();

  generateAttendance.addEventListener('click', function() {
  	var startDate = startDateElement.value;
  	var endDate = endDateElement.value;
  	if (startDate === "" || endDate === "") {
  		return;
  	}
  	var startMoment = moment(startDate);
  	var endMoment = moment(endDate);
  	if (startMoment > endMoment) {
  		alert("End date before start date");
  		return;
  	}
  	$("#date-area").hide();
  	$("#loader").show();
  	eventAttendance(parkURL, startMoment, endMoment);
  });

  startDateElement.addEventListener('change', function() {
  	var startDate = startDateElement.value;
  	if (endDateElement.value === "") {
  		endDateElement.value = startDate;
  	}
    // tacdFromParkURL(parkURL, chosenQuarter, chosenYear);
  });

});
