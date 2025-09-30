package services

import (

	"backend/internal/models"
	"backend/internal/repos"
	"context"

)

type HotelServiceInterface interface {
	CreateHotel(ctx context.Context, hotel *models.Hotel) error
	GetAll(ctx context.Context) ([]models.Hotel, error)
	GetByID(ctx context.Context, hotelID int64) (models.Hotel, error)
}

type hotelService struct {
	hotelRepo repos.HotelRepoInterface
}

func NewHotelService(hotelRepo repos.HotelRepoInterface) HotelServiceInterface {
	return hotelService{hotelRepo: hotelRepo}
}

func (s hotelService) CreateHotel(ctx context.Context, hotel *models.Hotel) error {
	return s.hotelRepo.Create(ctx, hotel)
}

func (s hotelService) GetAll(ctx context.Context) ([]models.Hotel, error) {
	return s.hotelRepo.GetAll(ctx)
}

func (s hotelService) GetByID(ctx context.Context, hotelID int64) (models.Hotel, error) {
	return s.hotelRepo.GetByID(ctx, hotelID)
}

