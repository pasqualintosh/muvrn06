select 
-- seg.*, t.*, 
t.user_id, t.id as trip_id,
seg.distance as tot_km, seg.duration, seg.start_time, seg.end_time,
seg.validation, seg.points, seg.calories, seg.co2, seg.typology_id as modal_type,

(
  SELECT ST_X(ST_StartPoint(seg.linestring::geometry)) AS lat_lon
FROM tracking_subtrip AS s
WHERE s.id=seg.id
)
AS initial_point_longitude,

(
SELECT ST_Y(ST_StartPoint(seg.linestring::geometry)) AS lat_lon
FROM tracking_subtrip AS s
WHERE s.id=seg.id
)
AS initial_point_latitude,


(
  SELECT ST_X(ST_EndPoint(seg.linestring::geometry)) AS lat_lon
FROM tracking_subtrip AS s
WHERE s.id=seg.id
)
AS final_point_longitude,

(
  SELECT ST_Y(ST_EndPoint(seg.linestring::geometry)) AS lat_lon
FROM tracking_subtrip AS s
WHERE s.id=seg.id
)
AS final_point_latitude



from tracking_trip as t
inner join tracking_subtrip as seg on seg.trip_id=t.id
order by t.id
