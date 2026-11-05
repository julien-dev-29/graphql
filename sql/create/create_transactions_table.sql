CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY,
    object_id INT NOT NULL,
    user_id INT NO NULL,
    amount INT,
    type VARCHAR(50),
    createdAt TIMESTAMP CURRENT_TIMESTAMP,
    path VARCHAR(50)
)