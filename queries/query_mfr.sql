SELECT mfr.id AS mfr_id, u.user_id AS user_id, c.city_name, CAST(ST_Distance_Sphere(geometry(mfr.start_point), geometry(mfr.end_point))/1000.0 AS int) AS mfr_distance, ST_X(mfr.start_point::geometry) AS start_point_lng, ST_Y(mfr.start_point::geometry) AS start_point_lat,
  ST_X(mfr.end_point::geometry) AS end_point_lng, ST_Y(mfr.end_point::geometry) AS end_point_lat, mfr.start_type, mfr.end_type, mfr.walk, mfr.bike, mfr.bus, mfr.car_pooling, mfr.car, mfr.motorbike, mfr.frequency,
  (
SELECT w.monday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) AS monday,
  (
SELECT w.tuesday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) AS tuesday,
  (
SELECT w.wednesday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) AS wednesday,
  (
SELECT w.thursday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) AS thursday,
  (
SELECT w.friday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) AS friday,
  (
SELECT w.saturday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
) saturday,
  (
SELECT w.sunday
  FROM frequent_route_weekly_declared AS w
  WHERE w.mfr_id=mfr.id
)
AS sunday, w.start_time, w.end_time, mfr.created_at, mfr.deleted_at

FROM user_profile_public AS u
  LEFT JOIN most_frequent_route AS mfr ON u.user_id=mfr.user_id
  LEFT JOIN frequent_route_weekly_declared w ON mfr.id=w.mfr_id
  LEFT JOIN city AS c ON c.id=u.city_id
GROUP BY mfr.id,u.user_id, c.city_name, w.start_time, w.end_time, mfr.created_at, mfr.deleted_at