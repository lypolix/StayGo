CREATE TABLE hotel_rooms (
    hotel_id INTEGER REFERENCES hotels(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    PRIMARY KEY (hotel_id, room_id)
);
