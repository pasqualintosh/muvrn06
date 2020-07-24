select mfr.*, ST_X(fr.start_point::geometry) AS start_point_lng, ST_Y(fr.start_point::geometry) AS start_point_lat, ST_X(fr.end_point::geometry) AS end_point_lng, ST_Y(fr.end_point::geometry) AS end_point_lat,

  case
    when walk > 10000 then walk/1000
	when walk <= 100 then walk
	else walk/100
end as walk,

  case
    when bike > 10000 then bike/1000
	when bike <= 100 then bike
	else bike/100
end as bike,

  case
    when bus > 10000 then bus/1000
	when bus <= 100 then bus
	else bus/100
end as bus,

  case
    when car_pooling > 10000 then car_pooling/1000
	when car_pooling <= 100 then car_pooling
	else car_pooling/100
end as car_pooling,

  case
    when car > 10000 then car/1000
	when car <= 100 then car
	else car/100
end as car,

  case
    when motorbike > 10000 then motorbike/1000
	when motorbike <= 100 then motorbike
	else motorbike/100
end as motorbike

from frequent_route_weekly_declared as mfr
  inner join most_frequent_route as fr on fr.id=mfr.mfr_id

order by fr.user_id