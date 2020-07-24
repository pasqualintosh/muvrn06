SELECT 
u.id AS USER_id,
t.id AS route_id,
s.id AS segment_id, 
type.description AS modal_type,
ST_X(gps.point::geometry) AS point_lng, 
ST_Y(gps.point::geometry) AS point_lat,
gps.instant_speed,
gps.is_valid,
to_date(to_char(gps.time, 'DD/MM/YYY'), 'DD/MM/YYY') AS DATE,
gps.time::TIME AS TIME,

(
    SELECT act.confidence
    FROM tracking_activity AS act
    INNER JOIN tracking_activitytype AS t ON t.id=act.type_id
    WHERE act.subtrip_id=s.id
    AND act.time <= gps.time
    AND confidence = 
    (
        SELECT MAX(confidence)
        FROM tracking_activity AS act
        WHERE act.subtrip_id=s.id
        AND act.time <= gps.time
    )
    ORDER BY TIME
    LIMIT 1
),

(
    SELECT t.description
    FROM tracking_activity AS act
    INNER JOIN tracking_activitytype AS t ON t.id=act.type_id
    WHERE act.subtrip_id=s.id
    AND act.time <= gps.time
    AND confidence = 
    (
        SELECT MAX(confidence)
        FROM tracking_activity AS act
        WHERE act.subtrip_id=s.id
        AND act.time <= gps.time
    )
    ORDER BY TIME
    LIMIT 1
),

(
    SELECT act.time
    FROM tracking_activity AS act
    INNER JOIN tracking_activitytype AS t ON t.id=act.type_id
    WHERE act.subtrip_id=s.id
    AND act.time <= gps.time
    AND confidence = 
    (
        SELECT MAX(confidence)
        FROM tracking_activity AS act
        WHERE act.subtrip_id=s.id
        AND act.time <= gps.time
    )
    ORDER BY TIME
    LIMIT 1
)


FROM tracking_subtrip AS s
INNER JOIN tracking_gpspoint AS gps ON s.id=gps.subtrip_id
INNER JOIN tracking_trip AS t ON t.id=s.trip_id
INNER JOIN anagrafica_user AS u ON u.id=t.user_id
INNER JOIN tracking_triptype AS type ON type.id=s.typology_id
ORDER BY t.id
-- LIMIT  1500
-- OFFSET 5000

/*
SELECT type_id, confidence, act.time
FROM tracking_activity AS act
WHERE act.subtrip_id=1
AND act.time <= '2020-01-17 16:01:50.288'
AND confidence = 
(
    SELECT MAX(confidence)
    FROM tracking_activity AS act
    WHERE act.subtrip_id=1
    AND act.time <= '2020-01-17 16:01:50.288'
)
ORDER BY TIME
LIMIT 1
*/