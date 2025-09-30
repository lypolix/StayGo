package repos

import (
	"context"
	"database/sql"
	"fmt"
	"strings"

	"backend/internal/models"
)

type RoomRepo struct {
	DB *sql.DB
}

type RoomRepoInterface interface {
	Create(ctx context.Context, room *models.Room) error
	GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error)
	GetRoomByID(ctx context.Context, roomID int64) (models.Room, error)
	SearchRooms(ctx context.Context, city string, guests int, checkin, checkout string) ([]models.Room, error)
}

func NewRoomRepo(db *sql.DB) RoomRepoInterface {
	return RoomRepo{DB: db}
}

func (r RoomRepo) Create(ctx context.Context, room *models.Room) error {
	const q = `
        INSERT INTO rooms (beds, price, rating, description, hotel_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id
    `
	return r.DB.QueryRowContext(ctx, q,
		room.Beds, room.Price, room.Rating, room.Description, room.HotelID,
	).Scan(&room.ID)
}

func (r RoomRepo) GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error) {
	const q = `
        SELECT id, hotel_id, beds, price, rating, description
        FROM rooms
        WHERE hotel_id = $1
        ORDER BY id ASC
    `
	rows, err := r.DB.QueryContext(ctx, q, hotelID)
	if err != nil {
		return nil, fmt.Errorf("rooms by hotel: query: %w", err)
	}
	defer rows.Close()

	var rooms []models.Room
	for rows.Next() {
		var rm models.Room
		if err := rows.Scan(&rm.ID, &rm.HotelID, &rm.Beds, &rm.Price, &rm.Rating, &rm.Description); err != nil {
			return nil, fmt.Errorf("rooms by hotel: scan: %w", err)
		}
		rooms = append(rooms, rm)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rooms by hotel: rows: %w", err)
	}
	return rooms, nil
}

func (r RoomRepo) GetRoomByID(ctx context.Context, roomID int64) (models.Room, error) {
	const q = `
        SELECT id, hotel_id, beds, price, rating, description
        FROM rooms
        WHERE id = $1
    `
	var rm models.Room
	if err := r.DB.QueryRowContext(ctx, q, roomID).
		Scan(&rm.ID, &rm.HotelID, &rm.Beds, &rm.Price, &rm.Rating, &rm.Description); err != nil {
		return models.Room{}, fmt.Errorf("room by id: %w", err)
	}
	return rm, nil
}

func (r RoomRepo) SearchRooms(ctx context.Context, city string, guests int, checkin, checkout string) ([]models.Room, error) {
	const q = `
        SELECT r.id, r.hotel_id, r.beds, r.price, r.rating, r.description
        FROM rooms r
        JOIN hotels h ON h.id = r.hotel_id
        WHERE h.city ILIKE $1
          AND r.beds >= $2
        ORDER BY r.price ASC, r.id ASC
    `
	rows, err := r.DB.QueryContext(ctx, q, "%"+strings.TrimSpace(city)+"%", guests)
	if err != nil {
		return nil, fmt.Errorf("search rooms: query: %w", err)
	}
	defer rows.Close()

	var res []models.Room
	for rows.Next() {
		var rm models.Room
		if err := rows.Scan(&rm.ID, &rm.HotelID, &rm.Beds, &rm.Price, &rm.Rating, &rm.Description); err != nil {
			return nil, fmt.Errorf("search rooms: scan: %w", err)
		}
		res = append(res, rm)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("search rooms: rows: %w", err)
	}
	return res, nil
}
