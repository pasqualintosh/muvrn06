SELECT distinct(u.user_id) AS user_id, level_id,
-- l.name AS level, 
u.avatar, u.bike, u.bike_sharing_user, u.car_sharing_user, u.pooling_passenger, u.pooling_pilot,
  c.city_name, u.car_owning_answer, u.moto_owning_answer, u.car_id, u.moto_id, CAST(u.created_at AS DATE),


  (SELECT
    CAST(ST_Distance_Sphere(geometry(mfr.start_point), geometry(mfr.end_point))/1000.0 AS int)
  FROM most_frequent_route AS mfr
  WHERE mfr.user_id=u.user_id
  ORDER BY mfr.id LIMIT 1)  AS mfr_distance,

  -- totali --

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id
)
AS tot_trip,

  (
	SELECT sum(s.distance_travelled)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id
)
AS tot_km,

  (
SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id
)
AS tot_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.validated=TRUE
)
AS tot_points,

  -- piedi -- 

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=1
)
AS walk_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=1
)
AS walk_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=1
)
AS walk_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=1 AND s.validated=TRUE
)
AS walk_points,

  -- bici -- 

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=2
)
AS bike_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=2
)
AS bike_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=2
)
AS bike_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=2 AND s.validated=TRUE
)
AS bike_points,


  -- tpl -- 

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=3
)
AS tpl_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=3 
)
AS tpl_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=3
)
AS tpl_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND s.modal_type=3 AND s.validated=TRUE
)
AS tpl_points,


  -- mfr --

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL
)
AS mft_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL
)
AS mft_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL
)
AS mft_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.validated=TRUE
)
AS mft_points,

  -- mfr walk --

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=1
)
AS mft_walk_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=1
)
AS mft_walk_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=1
)
AS mft_walk_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=1 AND s.validated=TRUE
)
AS mft_walk_points,

  -- mfr bike --

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=2
)
AS mft_bike_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=2 
)
AS mft_bike_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=2
)
AS mft_bike_min,

  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=2 AND s.validated=TRUE
)
AS mft_bike_points,

  -- mfr tpl --

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=3
)
AS mft_tpl_trip,

  (
	SELECT sum(CAST(s.distance_travelled AS INT))
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=3
)
AS mft_tpl_km,

  (
	SELECT sum(s.time_travelled)/60
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=3
)
AS mft_tpl_min,


  (
SELECT sum(s.points)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.user_id AND r.referred_most_freq_route_id IS NOT NULL AND s.modal_type=3 AND s.validated=TRUE
)
AS mft_tpl_points,

  -- mfr modal --

  (
  SELECT mfr.id
  FROM route AS r RIGHT JOIN most_frequent_route AS mfr ON mfr.id=r.referred_most_freq_route_id
  WHERE  r.user_id=u.user_id
LIMIT
1 OFFSET 0 
) AS mft_id,

(
  SELECT ms.walk
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS walk,

(
  SELECT ms.bike
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS bike,

(
  SELECT ms.bus
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS bus,

(
  SELECT ms.car_pooling
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS car_pooling,

(
  SELECT ms.car
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS car,

(
  SELECT ms.motorbike
FROM overall_modal_split_declared AS o RIGHT JOIN survey_overall_modal_split AS ms ON o.survey_overall_id=ms.id
WHERE o.user_id=u.user_id
)
AS motorbike,

(SELECT count(friends.*)
FROM friendship AS friends
WHERE friends.user_follower_id=u.user_id AND friends.coin_follower_earned !=0 AND referral_url IS NOT null)
AS registration_from_referral,

(SELECT count(friends.*)
FROM friendship AS friends
WHERE friends.user_followed_id=u.user_id AND referral_url IS NOT null)
AS num_positive_referral,

(SELECT count(friends.*)
FROM friendship AS friends
WHERE friends.user_followed_id=u.user_id)
AS num_follower,

(SELECT count(friends.*)
FROM friendship AS friends
WHERE friends.user_follower_id=u.user_id)
AS num_following

/*

(
  SELECT mfr.start_point 
  FROM route AS r RIGHT JOIN most_frequent_route AS mfr ON mfr.id=r.referred_most_freq_route_id  
  WHERE  r.user_id=u.user_id 
  LIMIT 1 OFFSET 0  
) AS mfr_start,

(
  SELECT mfr.end_point 
  FROM route AS r RIGHT JOIN most_frequent_route AS mfr ON mfr.id=r.referred_most_freq_route_id  
  WHERE  r.user_id=u.user_id 
  LIMIT 1 OFFSET 0  
) AS mfr_end, 

(
  SELECT mfr.start_type 
  FROM route AS r RIGHT JOIN most_frequent_route AS mfr ON mfr.id=r.referred_most_freq_route_id  
  WHERE  r.user_id=u.user_id 
  LIMIT 1 OFFSET 0  
) AS mfr_start_type, 

(
  SELECT mfr.end_type 
  FROM route AS r RIGHT JOIN most_frequent_route AS mfr ON mfr.id=r.referred_most_freq_route_id  
  WHERE  r.user_id=u.user_id 
  LIMIT 1 OFFSET 0  
) AS mfr_end_type

*/

FROM user_profile_public AS u 
	LEFT JOIN city AS c ON c.id=u.city_id 
  -- INNER JOIN level AS l ON u.level_id=l.id



GROUP BY u.user_id, u.avatar, u.bike, u.bike_sharing_user, u.car_sharing_user, u.pooling_passenger, u.pooling_pilot, 
      u.commercialisation_gdpr, u.customisation_gdpr, u.mailinglist_gdpr, u.sponsorships_gdpr, c.city_name, u.car_id, u.moto_id, u.car_owning_answer, u.moto_owning_answer, u.created_at
      -- ,l.name

ORDER BY u.user_id