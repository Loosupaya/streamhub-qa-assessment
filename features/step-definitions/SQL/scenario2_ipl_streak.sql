
-- Scenario 2: Find IPL 2024 players scoring 30+ runs
-- in at least 3 consecutive matches.
--
-- Assumed table: ipl_batting
-- Columns: player_id, player_name, match_date,
--          match_number, runs, season

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
    SELECT
        player_id,
        player_name,
        match_date,
        match_number,
        runs,
        match_rank,
        match_number - match_rank AS streak_group
    FROM player_matches
    WHERE runs >= 30
),
streaks AS (
    SELECT
        player_id,
        player_name,
        MIN(match_date) AS streak_start_date,
        MAX(match_date) AS streak_end_date,
        COUNT(*) AS consecutive_matches
    FROM qualifying_matches
    GROUP BY
        player_id,
        player_name,
        streak_group
    HAVING COUNT(*) >= 3
)
SELECT *
FROM streaks
ORDER BY player_name, streak_start_date;
