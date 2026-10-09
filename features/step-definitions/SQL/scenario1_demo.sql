
-- Scenario 1: Detect possible circular transactions
-- Demo database: SQLite
-- Rule: A sends money to B, and B sends a similar
-- amount back to A within 24 hours.
-- Similar amount means within 10%.

DROP TABLE IF EXISTS transactions;

CREATE TABLE transactions (
    transaction_id INTEGER PRIMARY KEY,
    sender_id TEXT,
    receiver_id TEXT,
    amount REAL,
    transaction_time TEXT
);

-- Insert sample transactions
INSERT INTO transactions VALUES
(1, 'A', 'B', 1000, '2024-04-01 10:00:00'),
(2, 'B', 'A', 1050, '2024-04-02 09:00:00'),
(3, 'C', 'D', 2000, '2024-04-01 10:00:00'),
(4, 'D', 'C', 2500, '2024-04-01 15:00:00'),
(5, 'E', 'F', 500,  '2024-04-01 08:00:00'),
(6, 'F', 'E', 510,  '2024-04-03 08:00:00');

-- Find reverse transactions within 24 hours
-- where the return amount is within 10%.

SELECT
    t1.transaction_id AS first_transaction_id,
    t1.sender_id AS person_a,
    t1.receiver_id AS person_b,
    t1.amount AS first_amount,
    t1.transaction_time AS first_transaction_time,
    t2.transaction_id AS return_transaction_id,
    t2.amount AS return_amount,
    t2.transaction_time AS return_transaction_time
FROM transactions t1
JOIN transactions t2
    ON t1.sender_id = t2.receiver_id
   AND t1.receiver_id = t2.sender_id
   AND t2.transaction_id <> t1.transaction_id
   AND datetime(t2.transaction_time)
       > datetime(t1.transaction_time)
   AND datetime(t2.transaction_time)
       <= datetime(t1.transaction_time, '+24 hours')
   AND t2.amount BETWEEN t1.amount * 0.90
                     AND t1.amount * 1.10;
