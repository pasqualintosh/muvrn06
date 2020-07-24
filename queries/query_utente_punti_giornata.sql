SELECT u.id AS user_id, 
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-9-24' AND us.id=u.id) AS D_2018_9_24,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-25' AND us.id=u.id) AS D_2018_09_25,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-26' AND us.id=u.id) AS D_2018_09_26,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-27' AND us.id=u.id) AS D_2018_09_27,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-28' AND us.id=u.id) AS D_2018_09_28,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-29' AND us.id=u.id) AS D_2018_09_29,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-09-30' AND us.id=u.id) AS D_2018_09_30,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-01' AND us.id=u.id) AS D_2018_10_01,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-02' AND us.id=u.id) AS D_2018_10_02,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-03' AND us.id=u.id) AS D_2018_10_03,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-04' AND us.id=u.id) AS D_2018_10_04,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-05' AND us.id=u.id) AS D_2018_10_05,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-06' AND us.id=u.id) AS D_2018_10_06,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-07' AND us.id=u.id) AS D_2018_10_07,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-08' AND us.id=u.id) AS D_2018_10_08,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-09' AND us.id=u.id) AS D_2018_10_09,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-10' AND us.id=u.id) AS D_2018_10_10,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-11' AND us.id=u.id) AS D_2018_10_11,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-12' AND us.id=u.id) AS D_2018_10_12,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-13' AND us.id=u.id) AS D_2018_10_13,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-14' AND us.id=u.id) AS D_2018_10_14,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-15' AND us.id=u.id) AS D_2018_10_15,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-16' AND us.id=u.id) AS D_2018_10_16,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-17' AND us.id=u.id) AS D_2018_10_17,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-18' AND us.id=u.id) AS D_2018_10_18,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-19' AND us.id=u.id) AS D_2018_10_19,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-20' AND us.id=u.id) AS D_2018_10_20,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-21' AND us.id=u.id) AS D_2018_10_21,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-22' AND us.id=u.id) AS D_2018_10_22,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-23' AND us.id=u.id) AS D_2018_10_23,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-24' AND us.id=u.id) AS D_2018_10_24,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-25' AND us.id=u.id) AS D_2018_10_25,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-26' AND us.id=u.id) AS D_2018_10_26,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-27' AND us.id=u.id) AS D_2018_10_27,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-28' AND us.id=u.id) AS D_2018_10_28,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-29' AND us.id=u.id) AS D_2018_10_29,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-30' AND us.id=u.id) AS D_2018_10_30,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-10-31' AND us.id=u.id) AS D_2018_10_31,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-01' AND us.id=u.id) AS D_2018_11_01,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-02' AND us.id=u.id) AS D_2018_11_02,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-03' AND us.id=u.id) AS D_2018_11_03,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-04' AND us.id=u.id) AS D_2018_11_04,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-05' AND us.id=u.id) AS D_2018_11_05,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-06' AND us.id=u.id) AS D_2018_11_06,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-07' AND us.id=u.id) AS D_2018_11_07,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-08' AND us.id=u.id) AS D_2018_11_08,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-09' AND us.id=u.id) AS D_2018_11_09,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-10' AND us.id=u.id) AS D_2018_11_10,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-11' AND us.id=u.id) AS D_2018_11_11,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-12' AND us.id=u.id) AS D_2018_11_12,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-13' AND us.id=u.id) AS D_2018_11_13,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-14' AND us.id=u.id) AS D_2018_11_14,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-15' AND us.id=u.id) AS D_2018_11_15,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-16' AND us.id=u.id) AS D_2018_11_16,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-17' AND us.id=u.id) AS D_2018_11_17,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-18' AND us.id=u.id) AS D_2018_11_18,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-19' AND us.id=u.id) AS D_2018_11_19,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-20' AND us.id=u.id) AS D_2018_11_20,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-21' AND us.id=u.id) AS D_2018_11_21,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-22' AND us.id=u.id) AS D_2018_11_22,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-23' AND us.id=u.id) AS D_2018_11_23,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-24' AND us.id=u.id) AS D_2018_11_24,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-25' AND us.id=u.id) AS D_2018_11_25,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-26' AND us.id=u.id) AS D_2018_11_26,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-27' AND us.id=u.id) AS D_2018_11_27,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-28' AND us.id=u.id) AS D_2018_11_28,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-29' AND us.id=u.id) AS D_2018_11_29,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-11-30' AND us.id=u.id) AS D_2018_11_30,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-01' AND us.id=u.id) AS D_2018_12_01,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-02' AND us.id=u.id) AS D_2018_12_02,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-03' AND us.id=u.id) AS D_2018_12_03,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-04' AND us.id=u.id) AS D_2018_12_04,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-05' AND us.id=u.id) AS D_2018_12_05,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-06' AND us.id=u.id) AS D_2018_12_06,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-07' AND us.id=u.id) AS D_2018_12_07,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-08' AND us.id=u.id) AS D_2018_12_08,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-09' AND us.id=u.id) AS D_2018_12_09,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-10' AND us.id=u.id) AS D_2018_12_10,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-11' AND us.id=u.id) AS D_2018_12_11,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-12' AND us.id=u.id) AS D_2018_12_12,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-13' AND us.id=u.id) AS D_2018_12_13,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-14' AND us.id=u.id) AS D_2018_12_14,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-15' AND us.id=u.id) AS D_2018_12_15,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-16' AND us.id=u.id) AS D_2018_12_16,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-17' AND us.id=u.id) AS D_2018_12_17,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-18' AND us.id=u.id) AS D_2018_12_18,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-19' AND us.id=u.id) AS D_2018_12_19,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-20' AND us.id=u.id) AS D_2018_12_20,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-21' AND us.id=u.id) AS D_2018_12_21,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-22' AND us.id=u.id) AS D_2018_12_22,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-23' AND us.id=u.id) AS D_2018_12_23,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-24' AND us.id=u.id) AS D_2018_12_24,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-25' AND us.id=u.id) AS D_2018_12_25,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-26' AND us.id=u.id) AS D_2018_12_26,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-27' AND us.id=u.id) AS D_2018_12_27,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-28' AND us.id=u.id) AS D_2018_12_28,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-29' AND us.id=u.id) AS D_2018_12_29,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-30' AND us.id=u.id) AS D_2018_12_30,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2018-12-31' AND us.id=u.id) AS D_2018_12_31,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-01' AND us.id=u.id) AS D_2019_01_01,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-02' AND us.id=u.id) AS D_2019_01_02,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-03' AND us.id=u.id) AS D_2019_01_03,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-04' AND us.id=u.id) AS D_2019_01_04,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-05' AND us.id=u.id) AS D_2019_01_05,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-06' AND us.id=u.id) AS D_2019_01_06,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-07' AND us.id=u.id) AS D_2019_01_07,
(SELECT SUM(seg.points) AS pt 
  FROM accounts_user AS us
  RIGHT JOIN route AS r ON us.id=r.user_id 
  RIGHT JOIN route_segment AS seg ON r.id=seg.referred_route_id 
  WHERE CAST(seg.created_at AS DATE)='2019-01-08' AND us.id=u.id) AS D_2019_01_08,

FROM accounts_user AS u
ORDER BY u.id