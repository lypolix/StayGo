CREATE TABLE networks (
    id SERIAL PRIMARY KEY,
    id_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    telegram TEXT,
    vk TEXT
);
