CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(50),
    password_hash VARCHAR(50)
)