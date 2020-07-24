SELECT u.user_id AS user_id, r.id AS trip_id, seg.id AS segment_id, seg.distance_travelled AS tot_km, seg.time_travelled/60 AS tot_min,

  CAST(seg.end_time -  make_interval(secs
:= seg.time_travelled) AS DATE) AS start_date, substr
(to_char
(seg.end_time -  make_interval
(secs := seg.time_travelled), 'DD/MM/YYYY HH24:mi'),11,19) AS start_time,
  CAST
(seg.end_time AS DATE) AS end_date, substr
(to_char
(seg.end_time, 'DD/MM/YYYY HH24:mi'),11,19) AS end_time,


r.referred_most_freq_route_id AS most_frequent_trip_id, seg.modal_type,
(
  SELECT count(s.id)
FROM route_segment AS s
WHERE r.id=s.referred_route_id
)
AS num_sub_trip,

/*
(
  SELECT sum(CAST(s.distance_travelled AS INT))
FROM route_segment AS s
WHERE r.id=s.referred_route_id
)
AS tot_km,

(
  SELECT sum(s.time_travelled)/60
FROM route_segment AS s
WHERE r.id=s.referred_route_id
)
AS tot_min,
*/

(
  SELECT ST_X(ST_StartPoint(s.route::geometry)) AS lat_lon
FROM route_segment AS s
WHERE s.id=seg.id
)
AS initial_point_longitude,

(
  SELECT ST_Y(ST_StartPoint(s.route::geometry)) AS lat_lon
FROM route_segment AS s
WHERE s.id=seg.id
)
AS initial_point_latitude,


(
  SELECT ST_X(ST_EndPoint(s.route::geometry)) AS lat_lon
FROM route_segment AS s
WHERE s.id=seg.id
)
AS final_point_longitude,

(
  SELECT ST_Y(ST_EndPoint(s.route::geometry)) AS lat_lon
FROM route_segment AS s
WHERE s.id=seg.id
)
AS final_point_latitude,

seg.validated, seg.points, seg.calories

FROM user_profile_public AS u
  RIGHT JOIN route AS r ON u.user_id=r.user_id
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id
ORDER BY u.user_id, trip_id