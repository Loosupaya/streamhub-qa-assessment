
-- Scenario 1: Identify possible circular transactions.
-- Assumed table: transactions
-- Columns: transaction_id, sender_id, receiver_id,
--          amount, transaction_time

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
   AND t2.transaction_time > t1.transaction_time
   AND t2.transaction_time <= t1.transaction_time + INTERVAL '24' HOUR
   AND t2.amount BETWEEN t1.amount * 0.90 AND t1.amount * 1.10;
