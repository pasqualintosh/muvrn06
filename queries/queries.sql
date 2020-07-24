-- SELECT s.*
-- FROM special_training_session AS s
-- id =1

/*
UPDATE special_training_session
SET community_id=NULL
WHERE id=1
*/

/*
SELECT s.*
FROM special_training AS s
*/

/*
UPDATE special_training
SET acronym=NULL
WHERE id=1
*/

-- DELETE FROM user_to_special_training WHERE special_training_id=1

/*
SELECT *
FROM sponsor
*/

/*
UPDATE sponsor
SET name='PUSH', address='P.zza Sant`Anna, 2, 90120, Palermo'
WHERE id=1
*/

/*
SELECT p.*
FROM user_profile AS p
WHERE p.first_name='Conor'
*/


/*
SELECT p.*
FROM user_profile AS p
WHERE p.city_id IS NULL
*/

/*
UPDATE user_profile
SET city_id=1122
WHERE user_id=379
*/

/*
SELECT *
FROM city
WHERE city_name LIKE '%N%'
*/

/*
UPDATE user_to_special_training
SET status=0
WHERE id=4
*/

/*
UPDATE special_training_session
SET title_st_session='Move as you eat'
WHERE id=1
*/

/*
SELECT avg((2019-date_part('year',p.birthdate))) AS avg_year
FROM accounts_user AS u
INNER JOIN user_profile AS p ON u.id=p.user_id
WHERE p.city_id=1122
*/


/*
SELECT avg(s.calories)
FROM accounts_user AS u
INNER JOIN route AS r ON u.id=r.user_id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON u.id=p.user_id
WHERE s.created_at >= '2019-03-11 00:00:00' AND s.created_at <= '2019-03-17 00:00:00' AND r.user_id IN (
SELECT u.id
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
WHERE r.created_at >= '2019-03-11 00:00:00' AND r.created_at <= '2019-03-17 00:00:00' AND s.calories > 0 GROUP BY u.id
HAVING COUNT(r.id)>2
)
*/


/*
SELECT sum(s.calories)
FROM accounts_user AS u
INNER JOIN route AS r ON u.id=r.user_id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON u.id=p.user_id
WHERE s.created_at >= '2019-03-11 00:00:00' AND s.created_at <= '2019-03-17 00:00:00' AND r.user_id IN (
SELECT u.id
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
WHERE r.created_at >= '2019-03-11 00:00:00' AND r.created_at <= '2019-03-17 00:00:00' GROUP BY u.id
HAVING COUNT(r.id)>4
)
GROUP BY r.user_id
*/

/*
SELECT u.*
FROM accounts_user AS u
WHERE u.id=50
*/

/*
SELECT AVG(cal)
FROM
(
SELECT sum(s.calories) AS cal
FROM accounts_user AS u
INNER JOIN route AS r ON u.id=r.user_id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON u.id=p.user_id
WHERE s.created_at >= '2019-03-11 00:00:00' AND s.created_at <= '2019-03-17 00:00:00' AND r.user_id IN (
SELECT u.id
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
WHERE r.created_at >= '2019-03-11 00:00:00' AND r.created_at <= '2019-03-17 00:00:00' GROUP BY u.id
HAVING COUNT(r.id)>2
)
GROUP BY r.user_id
) AS inner_query
*/

/*
SELECT u.id
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
WHERE r.created_at >= '2019-03-04 00:00:00' AND r.created_at <= '2019-03-10 00:00:00'
GROUP BY u.id
HAVING COUNT(r.id)>2
*/

-- 49.4800377,6.0527902

-- SELECT * FROM city LIMIT 1000 OFFSET 1000

/*
SELECT u.id, s.*
FROM accounts_user AS u
INNER JOIN user_profile AS p ON u.id=p.user_id
INNER JOIN route AS r ON r.user_id=u.id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
WHERE p.first_name LIKE 'Jérôme'
*/

/*
SELECT sum(s.distance_travelled )
FROM route_segment AS s
INNER JOIN route AS r ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON r.user_id=p.user_id
WHERE s.modal_type=3
*/

/*SELECT u.id, COUNT(r.id), u.email, p.first_name, p.last_name, c.city_name, p.created_at, p.gender, (2019-date_part('year',p.birthdate)) AS birthyear, p.city_id, p.mailinglist_gdpr, p.*
FROM accounts_user AS u
INNER JOIN user_profile AS p ON u.id=p.user_id
INNER JOIN city AS c ON c.id=p.city_id
LEFT JOIN route AS r ON r.user_id=u.id
GROUP BY u.id, p.first_name, p.last_name, c.city_name, p.created_at, p.gender, p.birthdate, p.city_id, p.mailinglist_gdpr, p.user_id
ORDER BY p.created_at DESC*/

/*SELECT u.id, u.email, COUNT(utt.id) AS num_t
FROM accounts_user AS u
INNER JOIN user_to_trophy AS utt ON u.id=utt.user_id
INNER JOIN user_profile AS p ON u.id=p.user_id
WHERE p.city_id=1122 AND utt.trophy_id=4
GROUP BY u.id
ORDER BY  COUNT(utt.id) DESC 
*/

/*SELECT u.id, u.email, SUM(s.calories), st.status, st.created_at AS st_start, p.first_name, p.last_name
-- r.created_at, s.calories, st.created_at AS st_start, st.status, s.modal_type, s.distance_travelled
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON p.user_id=u.id
RIGHT JOIN user_to_special_training AS st ON st.user_id=u.id
WHERE r.created_at >= '2019-05-02 00:00:00' AND p.city_id=1122 AND s.validated=TRUE AND st.special_training_id=6
GROUP BY u.id, u.email, st.status, st.created_at,  p.first_name, p.last_name
ORDER BY u.email*/


/*
SELECT u.id, u.email, st.status, p.phone, p.mailinglist_gdpr, st.created_at
-- st.created_at AS st_start, p.first_name, p.last_name, p.*
-- r.created_at, s.calories, st.created_at AS st_start, st.status, s.modal_type, s.distance_travelled
FROM accounts_user AS u
-- INNER JOIN route AS r ON r.user_id=u.id
-- INNER JOIN route_segment AS s ON r.id=s.referred_route_id
INNER JOIN user_profile AS p ON p.user_id=u.id
RIGHT JOIN user_to_special_training AS st ON st.user_id=u.id
WHERE st.special_training_id=6
GROUP BY u.id, u.email, st.status, st.created_at,  p.first_name, p.last_name, p.user_id
ORDER BY st.status, u.email
*/

/*SELECT s.*, ST_Force2D(ST_GeomFromWKB(s.route))
FROM route_segment AS s
  INNER JOIN route AS r ON r.id=s.referred_route_id
WHERE r.user_id=1011 AND s.created_at > '2019-05-14 05:27:12.496293' AND modal_type=1
ORDER BY s.id DESC
LIMIT 5
*/
/*SELECT u.id, s.points, r.created_at
FROM accounts_user AS u
INNER JOIN route AS r ON u.id=r.user_id
INNER JOIN route_segment AS s ON s.referred_route_id=r.id
WHERE u.id=84 AND r.created_at > '2019-05-19 09:45:45.330222'*/


/*
SELECT SUM(s.distance_travelled)
FROM accounts_user AS u
INNER JOIN route AS r ON r.user_id=u.id
INNER JOIN route_segment AS s ON r.id=s.referred_route_id
WHERE u.id=733 AND r.created_at >= '2019-04-15 00:00:00' AND r.created_at < '2019-04-22 00:00:00'*/

/*SELECT ST_Y(ST_TRANSFORM(geom,4674))AS lat, ST_X(ST_TRANSFORM(geom,4674))AS lon, geom.path[1], geom.user_id, geom.modal_type, geom.segment_id, geom.route_id, CAST(geom.created_at AS DATE)AS date, 
to_char(geom.created_at, 'HH:MI') AS TIME
FROM (

	SELECT (ST_DumpPoints(s.route)).*, s.modal_type, u.id AS user_id, s.id AS segment_id, r.id AS route_id, s.created_at
	FROM route_segment AS s
	INNER JOIN route AS r ON r.id=s.referred_route_id
	INNER JOIN accounts_user AS u ON u.id=r.user_id
	ORDER BY s.id

) AS geom
ORDER BY geom.segment_id*/

/*SELECT u.id, p.first_name, SUBSTRING(p.last_name, 1, 1), c.city_name, CAST(utt.created_at AS DATE), tt.name
FROM user_to_trophy AS utt
INNER JOIN accounts_user AS u ON u.id=utt.user_id
LEFT JOIN city AS c ON c.id=utt.city_id
INNER JOIN user_profile AS p ON p.user_id=u.id
INNER JOIN trophy_type AS tt ON tt.id=utt.trophy_id
ORDER BY utt.created_at*/

/*SELECT u.email, c.city_name, 
(SELECT CAST(r.created_at AS DATE)  AS last_route_date FROM route AS r WHERE r.user_id=u.id ORDER BY r.created_at DESC LIMIT 1) AS last_route_date
FROM accounts_user AS u
INNER JOIN user_profile AS p ON p.user_id=u.id
INNER JOIN city AS c ON c.id=p.city_id
WHERE p.mailinglist_gdpr IS TRUE
ORDER BY c.city_name, last_route_date desc*/

/*SELECT t.name, utt.*,p.*
FROM accounts_user AS u
INNER JOIN user_profile AS p ON u.id=p.user_id
INNER JOIN user_to_trophy AS utt ON u.id=utt.user_id
INNER JOIN trophy_type AS t ON utt.trophy_id=t.id
ORDER BY utt.created_at DESC*/

/*SELECT u.id, r.id, s.*
FROM accounts_user AS u
INNER JOIN user_profile AS p ON p.user_id=u.id
INNER JOIN route AS r ON r.user_id=u.id
INNER JOIN route_segment AS s ON s.referred_route_id=r.id
WHERE r.id=17030*/

-- SELECT Distinct(c.city_name), COUNT(r.id)
-- INNER JOIN user_profile AS p ON u.id=p.user_id
-- INNER JOIN city AS c ON c.id=p.city_id
-- LEFT JOIN route AS r ON r.user_id=u.id
-- WHERE r.created_at > '2019-06-01 00:00:00'
-- GROUP BY c.city_name
-- ORDER BY COUNT
-- (r.id) DESC