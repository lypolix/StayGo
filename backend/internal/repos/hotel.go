package repos

import (
	"backend/internal/models"
	"database/sql"
)

type HotelRepo struct {
	DB *sql.DB
}

type HotelRepoInterface interface {
	Create(hotel models.Hotel) error
}

func NewHotelRepo(db *sql.DB) HotelRepoInterface {
	return &HotelRepo{DB: db}
}

func (r *HotelRepo) Create(hotel models.Hotel) error {
	err := r.DB.QueryRow(
		`INSERT INTO hotels (name, city, description, stars, address)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
		hotel.Name, hotel.City, hotel.Description, hotel.Stars, hotel.Address,
	).Scan(&hotel.ID)
	return err
}
