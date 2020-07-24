/*
SELECT count(r.id), type.description
FROM tracking_trip AS r
INNER JOIN tracking_subtrip AS s ON r.id = s.trip_id
INNER JOIN tracking_gpspoint AS gps ON gps.subtrip_id = s.id
INNER JOIN tracking_trip_typology AS ty ON ty.trip_id=r.id
INNER JOIN tracking_triptype AS type ON ty.triptype_id=type.id
WHERE r.end_time < '2020-06-30' AND s.validation != 4
GROUP BY type.description
*/

SELECT avg(gps.instant_speed), type.description
FROM tracking_trip AS r
  INNER JOIN tracking_subtrip AS s ON r.id = s.trip_id
  INNER JOIN tracking_gpspoint AS gps ON gps.subtrip_id = s.id
  INNER JOIN tracking_trip_typology AS ty ON ty.trip_id=r.id
  INNER JOIN tracking_triptype AS type ON ty.triptype_id=type.id
WHERE r.end_time < '2020-06-30' AND s.validation != 4
GROUP BY type.description