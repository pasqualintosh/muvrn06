SELECT concat('_', e.training_session_id, '_', e.id) AS id, e.text_description AS name
FROM event AS e