SELECT c.city_name, ss.title_st_session, st.start_special_training AS data_enrollment, st.start_special_training, st.end_special_training, ss.subscriber_users,
(SELECT count(*) FROM user_to_special_training AS utt WHERE utt.special_training_id=ss.id AND status=1) AS completed_users,
(SELECT count(*) FROM user_to_special_training AS utt WHERE utt.special_training_id=ss.id AND status=1 AND is_received IS true) AS redeemed_users
FROM special_training_session AS ss
INNER JOIN special_training AS st ON ss.id=st.special_training_session_id
INNER JOIN city AS c ON c.id=ss.city_id