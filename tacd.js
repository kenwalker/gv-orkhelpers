document.addEventListener("DOMContentLoaded", function () {
  // The URL of the park to load is passed on the URL fragment.
  var parkURL = window.location.hash.substring(1);
  var generateTaCD = document.getElementById('generate-tacd');
  var rerunTaCD = document.getElementById('rerun-tacd');
  $("#loader").hide();
  $("#rerun-tacd").hide();

  quarterSelectValues().forEach(function (quarterText, quarterNumber) {
    $("#chosen-quarter").append(new Option(quarterNumber, quarterText));
  });

  generateTaCD.addEventListener('click', function() {
  	$("#quarter-area").hide();
  	$("#loader").show();
  	chosenQuarter = parseInt($('#chosen-quarter').val());
    chosenYear = $("#chosen-quarter option:selected").text().split(' ').pop()
    tacdFromParkURL(parkURL, chosenQuarter, chosenYear);
  });

  rerunTaCD.addEventListener('click', function() {
    $("#quarter-area").show();
    $("#rerun-tacd").hide();
    $("#status").text('');
    results = [];
  });
});


function currentQuarter() {
  month = moment().month() + 1;
  return Math.floor(month / 4) + 1;
}

function quarterSelectValues() {
  quarter = currentQuarter();
  year = moment().year();
  quarterResults = new Map();
  while (quarterResults.size < 4) {
    key = textForQuarter(quarter, year);
    quarterResults.set(key, quarter.toString());
    quarter = quarter - 1;
    if (quarter == 0) {
      quarter = 4;
      year = year - 1;
    }
  }
  return quarterResults;
}

function textForQuarter(quarter, year) {
  switch(quarter) {
    case 1:
        return 'January - March ' + year;
    case 2:
      return 'April - June ' + year;
    case 3:
      return 'July - September ' + year;
    case 4:
      return 'October - December ' + year;
  }
}
