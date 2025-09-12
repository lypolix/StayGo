package repos

import (
    "database/sql"
    "backend/internal/models"
)

type HotelRepo struct {
    DB *sql.DB
}

func NewHotelRepo(db *sql.DB) *HotelRepo {
    return &HotelRepo{DB: db}
}

func (r *HotelRepo) Create(hotel *models.Hotel) error {
    err := r.DB.QueryRow(
        `INSERT INTO hotels (name, city, description, stars, address)
         VALUES ($1, $2, $3, $4, $5) RETURNING id`,
        hotel.Name, hotel.City, hotel.Description, hotel.Stars, hotel.Address,
    ).Scan(&hotel.ID)
    return err
}
