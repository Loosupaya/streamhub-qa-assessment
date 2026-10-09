DROP TABLE IF EXISTS ipl_batting;

CREATE TABLE ipl_batting (
    player_id INTEGER,
    player_name TEXT,
    match_date TEXT,
    match_number INTEGER,
    runs INTEGER,
    season INTEGER
);

INSERT INTO ipl_batting VALUES
(1, 'Player A', '2024-04-01', 1, 45, 2024),
(1, 'Player A', '2024-04-03', 2, 62, 2024),
(1, 'Player A', '2024-04-05', 3, 30, 2024),
(1, 'Player A', '2024-04-07', 4, 18, 2024),
(2, 'Player B', '2024-04-02', 1, 35, 2024),
(2, 'Player B', '2024-04-04', 2, 42, 2024),
(2, 'Player B', '2024-04-06', 3, 55, 2024),
(3, 'Player C', '2023-04-01', 1, 50, 2023);

WITH player_matches AS (
    SELECT
        player_id,
        player_name,
        match_date,
        match_number,
        runs,
        ROW_NUMBER() OVER (
            PARTITION BY player_id
            ORDER BY match_number
        ) AS match_rank
    FROM ipl_batting
    WHERE season = 2024
),
qualifying_matches AS (
    SELECT *,
           match_number - match_rank AS streak_group
    FROM player_matches
    WHERE runs >= 30
)
SELECT
    player_name,
    MIN(match_date) AS streak_start_date,
    MAX(match_date) AS streak_end_date,
    COUNT(*) AS consecutive_matches
FROM qualifying_matches
GROUP BY player_id, player_name, streak_group
HAVING COUNT(*) >= 3
ORDER BY player_name, streak_start_date;