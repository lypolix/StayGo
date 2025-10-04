package repos

import (
	"context"
	"database/sql"
	"errors"

	"backend/internal/models"
)

type FavoriteRoomRepo interface {
	AddRoomToFavorites(ctx context.Context, userID, roomID int64) error
	RemoveRoomFromFavorites(ctx context.Context, userID, roomID int64) error
	GetFavoriteRooms(ctx context.Context, userID int64) ([]models.Room, error)
}

type favoriteRoomRepo struct {
	DB *sql.DB
}

func NewFavoriteRoomRepo(db *sql.DB) FavoriteRoomRepo {
	return &favoriteRoomRepo{DB: db}
}

func (r *favoriteRoomRepo) AddRoomToFavorites(ctx context.Context, userID, roomID int64) error {
	_, err := r.DB.ExecContext(ctx, `
		INSERT INTO user_favorite_rooms (user_id, room_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, room_id) DO NOTHING
	`, userID, roomID)
	return err
}

func (r *favoriteRoomRepo) RemoveRoomFromFavorites(ctx context.Context, userID, roomID int64) error {
	res, err := r.DB.ExecContext(ctx, `
		DELETE FROM user_favorite_rooms
		WHERE user_id = $1 AND room_id = $2
	`, userID, roomID)
	if err != nil {
		return err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if affected == 0 {
		return errors.New("favorite not found")
	}
	return nil
}

func (r *favoriteRoomRepo) GetFavoriteRooms(ctx context.Context, userID int64) ([]models.Room, error) {
	rows, err := r.DB.QueryContext(ctx, `
		SELECT r.id, r.beds, r.price, r.rating, r.description, r.hotel_id
		FROM rooms r
		INNER JOIN user_favorite_rooms uf ON r.id = uf.room_id
		WHERE uf.user_id = $1
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var rooms []models.Room
	for rows.Next() {
		var room models.Room
		if err := rows.Scan(
			&room.ID,
			&room.Beds,
			&room.Price,
			&room.Rating,
			&room.Description,
			&room.HotelID,
		); err != nil {
			return nil, err
		}
		rooms = append(rooms, room)
	}
	return rooms, nil
}
