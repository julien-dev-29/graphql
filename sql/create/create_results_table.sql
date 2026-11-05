CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY,
    object_id INT NOT NULL,
    user_id INT NO NULL,
    grade INT,
    type VARCHAR(50),
    createdAt TIMESTAMP CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    path VARCHAR(50)
)