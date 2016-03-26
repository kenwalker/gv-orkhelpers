document.addEventListener("DOMContentLoaded", function () {
  // The URL of the park to load is passed on the URL fragment.
  var parkURL = window.location.hash.substring(1);

  if (parkURL) {
    attendanceNorthernEmpireFromParkURL(parkURL);
  }
});
