CREATE TABLE rooms (
    id SERIAL PRIMARY KEY,
    beds INTEGER,
    price INTEGER,
    rating INTEGER,
    description TEXT,
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE
);
