SELECT u.id, p.first_name, SUBSTRING(p.last_name, 1, 1), c.city_name, CAST(utt.created_at AS DATE), tt.name
FROM user_to_trophy AS utt
  INNER JOIN accounts_user AS u ON u.id=utt.user_id
  LEFT JOIN city AS c ON c.id=utt.city_id
  INNER JOIN user_profile AS p ON p.user_id=u.id
  INNER JOIN trophy_type AS tt ON tt.id=utt.trophy_id
ORDER BY utt.created_at