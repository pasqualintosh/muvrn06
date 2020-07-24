SELECT ST_X(ST_TRANSFORM(geom,4674))AS lon, ST_Y(ST_TRANSFORM(geom,4674))AS lat, geom.path[1], geom.user_id, geom.modal_type, geom.segment_id, geom.route_id, CAST(geom.created_at AS DATE)AS date,
  to_char(geom.created_at, 'HH:MI') AS TIME
FROM (

	SELECT (ST_DumpPoints(s.route)).*, s.modal_type, u.user_id AS user_id, s.id AS segment_id, r.id AS route_id, s.created_at
  FROM route_segment AS s
    INNER JOIN route AS r ON r.id=s.referred_route_id
    INNER JOIN user_profile_public AS u ON u.user_id=r.user_id
  ORDER BY s.id

) AS geom
ORDER BY geom.segment_id