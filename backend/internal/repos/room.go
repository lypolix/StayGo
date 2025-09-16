package repos

import (
	"context"
	"database/sql"

	"backend/internal/models"
)

// RoomRepo управляет операциями с таблицей комнат
type RoomRepo struct {
	DB *sql.DB
}

// RoomRepoInterface описывает методы для работы с комнатами
type RoomRepoInterface interface {
	Create(room models.Room) error
	GetByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error)
	GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error)
    GetRoomByID(ctx context.Context, roomID int64) (*models.Room, error)
}

// NewRoomRepo создает новый RoomRepo
func NewRoomRepo(db *sql.DB) RoomRepoInterface {
	return &RoomRepo{DB: db}
}

// Create добавляет новую комнату в базу
func (r *RoomRepo) Create(room models.Room) error {
	err := r.DB.QueryRow(
		`INSERT INTO rooms (beds, price, rating, description, hotel_id)
		 VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		room.Beds, room.Price, room.Rating, room.Description, room.HotelID,
	).Scan(&room.ID)
	return err
}

// GetByHotelID возвращает список комнат для заданного отеля
func (r *RoomRepo) GetByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error) {
	rows, err := r.DB.QueryContext(ctx,
		`SELECT id, beds, price, rating, description, hotel_id FROM rooms WHERE hotel_id = $1`, hotelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []models.Room
	for rows.Next() {
		var room models.Room
		if err := rows.Scan(&room.ID, &room.Beds, &room.Price, &room.Rating, &room.Description, &room.HotelID); err != nil {
			return nil, err
		}
		rooms = append(rooms, room)
	}
	return rooms, nil
}


func (r *RoomRepo) GetRoomsByHotelID(ctx context.Context, hotelID int64) ([]models.Room, error) {
    rows, err := r.DB.QueryContext(ctx, "SELECT id, hotel_id, beds, price, description FROM rooms WHERE hotel_id = $1", hotelID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    rooms := make([]models.Room, 0)
    for rows.Next() {
        var room models.Room
        if err = rows.Scan(&room.ID, &room.HotelID, &room.Beds, &room.Price, &room.Description); err != nil {
            return nil, err
        }
        rooms = append(rooms, room)
    }
    return rooms, nil
}

func (r *RoomRepo) GetRoomByID(ctx context.Context, roomID int64) (*models.Room, error) {
    var room models.Room
    err := r.DB.QueryRowContext(ctx, "SELECT id, hotel_id, beds, price, description FROM rooms WHERE id = $1", roomID).
        Scan(&room.ID, &room.HotelID, &room.Beds, &room.Price, &room.Description)
    if err != nil {
        return nil, err
    }
    return &room, nil
}