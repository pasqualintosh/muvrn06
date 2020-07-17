function toRad(value) {
  return (value * Math.PI) / 180;
}
export default function calcCrow(startLat, startLon, finishLat, finishLon) {
  var R = 6371; // km
  var dLat = toRad(finishLat - startLat);
  var dLon = toRad(finishLon - startLon);
  var startLat = toRad(startLat);
  var finishLat = toRad(finishLat);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) *
      Math.sin(dLon / 2) *
      Math.cos(startLat) *
      Math.cos(finishLat);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return d.toFixed(3);
}
