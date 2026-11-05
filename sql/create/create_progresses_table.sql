CREATE TABLE IF NOT EXISTS progresses (
    id INTEGER PRIMARY KEY,
    object_id INT NOT NULL,
    user_id INT NO NULL,
    grade INT,
    createdAt TIMESTAMP CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP,
    path VARCHAR(50)
)