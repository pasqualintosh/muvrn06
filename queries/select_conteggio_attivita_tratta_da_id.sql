SELECT des, COUNT(des)
FROM (

SELECT 
max(act.confidence) AS confidence,
act.time AS act_time,
(
    SELECT type.description AS description
    FROM tracking_trip AS t
    INNER JOIN tracking_subtrip AS s ON s.trip_id=t.id
    INNER JOIN tracking_activity ON tracking_activity.subtrip_id=s.id
    INNER JOIN tracking_activitytype AS type ON type.id=tracking_activity.type_id
    WHERE t.id=2929 AND tracking_activity.time=act.time 
        AND tracking_activity.confidence=max(act.confidence)
    LIMIT 1
) AS des

FROM tracking_trip AS t
INNER JOIN tracking_subtrip AS s ON s.trip_id=t.id
INNER JOIN tracking_activity AS act ON act.subtrip_id=s.id
INNER JOIN tracking_activitytype AS type ON type.id=act.type_id
WHERE t.id=2929
GROUP BY act.time
ORDER BY act.time

) AS q

GROUP BY des