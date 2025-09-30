package repos

import (
	"backend/internal/models"
	"context"
	"database/sql"
	
)

type HotelRepo struct {
	DB *sql.DB
}

type HotelRepoInterface interface {
	Create(ctx context.Context, hotel *models.Hotel) error
	GetAll(ctx context.Context) ([]models.Hotel, error)
	GetByID(ctx context.Context, hotelID int64) (models.Hotel, error)
}

func NewHotelRepo(db *sql.DB) HotelRepoInterface {
	return HotelRepo{DB: db}
}

func (r HotelRepo) Create(ctx context.Context, hotel *models.Hotel) error {
	const q = `
		INSERT INTO hotels (name, city, description, stars, address)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id
	`
	return r.DB.QueryRowContext(
		ctx, q,
		hotel.Name, hotel.City, hotel.Description, hotel.Stars, hotel.Address,
	).Scan(&hotel.ID)
}

func (r HotelRepo) GetAll(ctx context.Context) ([]models.Hotel, error) {
	const q = `SELECT id, name, city, description, stars, address FROM hotels`
	rows, err := r.DB.QueryContext(ctx, q)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var hotels []models.Hotel
	for rows.Next() {
		var h models.Hotel
		if err := rows.Scan(&h.ID, &h.Name, &h.City, &h.Description, &h.Stars, &h.Address); err != nil {
			return nil, err
		}
		hotels = append(hotels, h)
	}
	return hotels, rows.Err()
}

func (r HotelRepo) GetByID(ctx context.Context, hotelID int64) (models.Hotel, error) {
	const q = `
		SELECT id, name, city, description, stars, address
		FROM hotels
		WHERE id = $1
	`
	var h models.Hotel
	err := r.DB.QueryRowContext(ctx, q, hotelID).Scan(
		&h.ID, &h.Name, &h.City, &h.Description, &h.Stars, &h.Address,
	)
	return h, err
}


