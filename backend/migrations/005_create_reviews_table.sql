CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now(),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    room_rating INTEGER,
    hotel_rating INTEGER,
    approved BOOLEAN DEFAULT FALSE
);
