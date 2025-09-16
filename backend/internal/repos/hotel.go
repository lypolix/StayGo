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
	Create(hotel models.Hotel) error
	GetAll(ctx context.Context) ([]models.Hotel, error)
	GetByID(ctx context.Context, hotelID int64) (models.Hotel, error) 
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


func (r *HotelRepo) GetAll(ctx context.Context) ([]models.Hotel, error) {
    rows, err := r.DB.QueryContext(ctx, "SELECT id, name, city, description, stars, address FROM hotels")
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
    return hotels, nil
}

func (r *HotelRepo) GetByID(ctx context.Context, hotelID int64) (models.Hotel, error) {
    var hotel models.Hotel
    err := r.DB.QueryRowContext(ctx,
        "SELECT id, name, city, description, stars, address FROM hotels WHERE id = $1", hotelID).
        Scan(&hotel.ID, &hotel.Name, &hotel.City, &hotel.Description, &hotel.Stars, &hotel.Address)
    if err != nil {
        return models.Hotel{}, err
    }
    return hotel, nil
}
