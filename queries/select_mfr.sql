select  
mfr.id as mfr_id, u.id as user_id, c.city_name, mfr.is_active,
mfr.distance,
ST_X(mfr.start_point::geometry) AS start_point_lng, ST_Y(mfr.start_point::geometry) AS start_point_lat,
ST_X(mfr.end_point::geometry) AS end_point_lng, ST_Y(mfr.end_point::geometry) AS end_point_lat,
mfr.start_type_id, mfr.end_type_id, mfr.walk_slider, mfr.bike_slider, mfr.bus_slider, mfr.train_slider, mfr.car_slider,mfr.motorbike_slider,
mfr.start_time, mfr.end_time,
mfr.monday, mfr.tuesday, mfr.wednesday, mfr.thursday, mfr.friday,mfr.saturday, mfr.sunday


from  anagrafica_user as u
inner join tracking_frequenttrip as mfr on mfr.user_id=u.id
inner join tools_city as c on u.city_id=c.id