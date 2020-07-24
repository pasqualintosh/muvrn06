select s.*, ST_Force2D(ST_GeomFromWKB(s.route))
from route_segment as s
  inner join route as r on r.id=s.referred_route_id
where r.user_id=795 and s.created_at > '2019-05-13 14:49:50.364' and modal_type=1
order by s.id desc
limit 5
									   
-- utente 795
-- adesione special training 2019-05-13 14:49:50.364

-- vedi utenti

-- SELECT u.id, u.email, st.status, st.created_at AS st_start, p.first_name, p.last_name, p.*
-- FROM accounts_user AS u
-- INNER JOIN user_profile AS p ON p.user_id=u.id
-- RIGHT JOIN user_to_special_training AS st ON st.user_id=u.id
-- WHERE st.special_training_id=6
-- GROUP BY u.id, u.email, st.status, st.created_at,  p.first_name, p.last_name, p.user_id
-- ORDER BY u.email