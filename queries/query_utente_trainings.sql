SELECT u.id AS user_id, 
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=17 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _2_17,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=18 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _2_18,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=19 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _2_19,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=49 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _2_49,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=20 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _3_20,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=21 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _3_21,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=22 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _3_22,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=45 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _3_45,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=23 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _4_23,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=24 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _4_24,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=25 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _4_25,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=26 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _4_26,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=50 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _4_50,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=27 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _5_27,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=28 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _5_28,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=29 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _5_29,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=30 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _5_30,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=46 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _5_46,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=31 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _6_31,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=32 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _6_32,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=33 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _6_33,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=51 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _6_51,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=34 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _7_34,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=35 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _7_35,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=36 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _7_36,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=47 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _7_47,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=37 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_37,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=38 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_38,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=39 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_39,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=40 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_40,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=48 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_48,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=52 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _8_52,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=41 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _9_41,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=42 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _9_42,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=43 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _9_43,
(SELECT DISTINCT CAST(u_e.updated_at AS DATE)
          FROM user_to_event AS u_e
          WHERE event_id=44 AND u_e.user_id=user_id AND u_e.status=1
 LIMIT 1) AS _9_44,

FROM accounts_user AS u ORDER BY u.id
