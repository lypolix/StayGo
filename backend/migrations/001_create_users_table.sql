CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT now(),
    city TEXT,
    role TEXT DEFAULT 'user',
    refresh TEXT
);
