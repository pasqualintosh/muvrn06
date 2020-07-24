SELECT ST_X(ST_TRANSFORM(geom,4674))AS lon, ST_Y(ST_TRANSFORM(geom,4674))AS lat, geom.path[1], geom.user_id, geom.typology_id, geom.segment_id, geom.route_id
FROM (

	SELECT (ST_DumpPoints(s.linestring::geometry)).*, s.typology_id, u.id AS user_id, s.id AS segment_id, r.id AS route_id
  FROM tracking_subtrip AS s
    INNER JOIN tracking_trip AS r ON r.id=s.trip_id
    INNER JOIN anagrafica_user AS u ON u.id=r.user_id
  ORDER BY s.id

) AS geom
ORDER BY geom.segment_id