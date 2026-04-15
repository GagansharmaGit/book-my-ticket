CREATE TABLE IF NOT EXISTS users (
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(255) UNIQUE NOT NULL,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seats (
    id       SERIAL PRIMARY KEY,
    name     VARCHAR(255),
    isbooked INT DEFAULT 0
);

INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20)
WHERE NOT EXISTS (SELECT 1 FROM seats LIMIT 1);

ALTER TABLE seats ADD COLUMN IF NOT EXISTS user_id INT REFERENCES users(id);
