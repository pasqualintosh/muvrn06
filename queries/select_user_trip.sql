select 
-- u.*,
u.id as user_id, u.level_of_experience_id, u.avatar_id, u.biking_index, 
-- u.car_sharing_user_id, u.carpooling_index, u.car_pooler_id, u.car_user_id, u.motorbike_user_id,
-- u.car_typology_id, u.motorbike_typology_id,

(SELECT mfr.distance
FROM tracking_frequenttrip AS mfr
WHERE mfr.user_id=u.id
ORDER BY mfr.id LIMIT 1)  AS mfr_distance,

(
SELECT count(s.*)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
WHERE r.user_id=u.id
)
AS tot_trip,

(
SELECT sum(s.distance)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
WHERE r.user_id=u.id
)
AS tot_km,

(
SELECT sum(s.duration)/60
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id
)
AS tot_min,

  (
SELECT sum(s.points)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.validation=1
)
AS tot_points,

  -- piedi -- 

  (
	SELECT count(s.*)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=1
)
AS walk_trip,

  (
	SELECT sum(s.distance)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=1
)
AS walk_km,

  (
	SELECT sum(s.duration)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=1
)
AS walk_min,

  (
SELECT sum(s.points)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=1 AND s.validation=1
)
AS walk_points,

  -- bici -- 

  (
	SELECT count(s.*)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=2
)
AS bike_trip,

  (
	SELECT sum(s.distance)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=2
)
AS bike_km,

  (
	SELECT sum(s.duration)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=2
)
AS bike_min,

  (
SELECT sum(s.points)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=2 AND s.validation=1
)
AS bike_points,


  -- tpl -- 

  (
	SELECT count(s.*)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=3
)
AS tpl_trip,

  (
	SELECT sum(s.distance)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=3 
)
AS tpl_km,

  (
	SELECT sum(s.duration)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=3
)
AS tpl_min,

  (
SELECT sum(s.points)
FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND s.typology_id=3 AND s.validation=1
)
AS tpl_points,

-- --

(
	SELECT count(s.*)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL
)
AS mft_trip,

  (
	SELECT sum(s.distance)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL
)
AS mft_km,

  (
	SELECT sum(s.duration)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL
)
AS mft_min,

-- -- -- -- -- --

(
SELECT sum(s.points)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.validation=1
)
AS mft_points,

  -- mfr walk --

  (
	SELECT count(s.*)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=1
)
AS mft_walk_trip,

  (
	SELECT sum(s.distance)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=1
)
AS mft_walk_km,

  (
	SELECT sum(s.duration)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND typology_id=1
)
AS mft_walk_min,

  (
SELECT sum(s.points)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND typology_id=1 AND s.validation=1
)
AS mft_walk_points,


-- -- -- -- -- -- -- 

(
	SELECT count(s.*)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=2
)
AS mft_bike_trip,

  (
	SELECT sum(s.distance)
    FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.validation=2 
)
AS mft_bike_km,

  (
	SELECT sum(s.duration)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=2
)
AS mft_bike_min,

  (
SELECT sum(s.points)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=2 AND s.validation=1
)
AS mft_bike_points,

  -- mfr tpl --

  (
	SELECT count(s.*)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=3
)
AS mft_tpl_trip,


-- -- -- -- -- -- -- -- -- -- -- --


(
	SELECT sum(s.distance)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=3
)
AS mft_tpl_km,

  (
	SELECT sum(s.duration)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=3
)
AS mft_tpl_min,


  (
SELECT sum(s.points)
  FROM tracking_trip AS r INNER JOIN tracking_subtrip AS s ON r.id=s.trip_id
  WHERE r.user_id=u.id AND r.routinary IS NOT NULL AND s.typology_id=3 AND s.validation=1
)
AS mft_tpl_points,


c.city_name
from anagrafica_user as u
inner join tools_city as c on c.id=u.city_id
-- inner join tracking_frequenttrip as mfr on mfr.user_id=u.id 
-- limit 250
-- offset 250