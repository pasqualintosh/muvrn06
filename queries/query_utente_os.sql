SELECT u.id AS user_id,

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.id
)
AS tot_trip,

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.id AND s.validated=TRUE
)
AS valid_trip,

  (
	SELECT count(s.*)
  FROM route AS r INNER JOIN route_segment AS s ON r.id=s.referred_route_id
  WHERE r.user_id=u.id AND s.validated=FALSE
)
AS invalid_trip,

  p.user_agent


FROM accounts_user AS u
  INNER JOIN user_profile AS p ON u.id=p.user_id
ORDER BY user_id