CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    description TEXT,
    stars INTEGER,
    room_id INTEGER,
    address TEXT
);
