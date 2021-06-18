function formatDuration(dur) {
  let d = Number(dur);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? (h < 9 ? "0" + h : h) + " : " : "";
  var mDisplay = m > 0 ? (m < 9 ? "0" + m : m) + " : " : "00 : ";
  var sDisplay = s > 0 ? (s < 9 ? "0" + s : s) : "00";
  return hDisplay + mDisplay + sDisplay;
}

module.exports = formatDuration;
