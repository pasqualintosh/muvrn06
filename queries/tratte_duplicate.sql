SELECT s.id, s.points, s.end_time, s.referred_route_id
FROM route_segment AS s
INNER JOIN route AS r ON s.referred_route_id=r.id
INNER JOIN user_profile_public AS u ON u.user_id=r.user_id
WHERE s.end_time IN (

SELECT s.end_time
FROM route_segment AS s
INNER JOIN route AS r ON s.referred_route_id=r.id
INNER JOIN user_profile_public AS u ON u.user_id=r.user_id
GROUP BY s.end_time
HAVING count(s.end_time) > 1
ORDER BY s.end_time

)

AND s.referred_route_id NOT IN 

(

SELECT min(referred_route_id)
FROM (

	SELECT s.id, s.points, s.end_time, s.referred_route_id
	FROM route_segment AS s
	INNER JOIN route AS r ON s.referred_route_id=r.id
	INNER JOIN user_profile_public AS u ON u.user_id=r.user_id
	WHERE s.end_time IN (

		SELECT s.end_time
		FROM route_segment AS s
		INNER JOIN route AS r ON s.referred_route_id=r.id
		INNER JOIN user_profile_public AS u ON u.user_id=r.user_id
		GROUP BY s.end_time
		HAVING count(s.end_time) > 1
		ORDER BY s.end_time

	)
	ORDER BY s.end_time
) AS duplicated

GROUP BY end_time

)


ORDER BY s.end_time