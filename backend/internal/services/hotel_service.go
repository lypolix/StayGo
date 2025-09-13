package services

import (
	"backend/internal/models"
	"backend/internal/repos"
	"context"
)

type HotelServiceInterface interface {
	CreateHotel(ctx context.Context, hotel models.Hotel) error
}

type hotelService struct {
	hotelRepo repos.HotelRepoInterface
}

func NewHotelService(hotelRepo repos.HotelRepoInterface) HotelServiceInterface {
	return &hotelService{
		hotelRepo: hotelRepo,
	}
}

func (s *hotelService) CreateHotel(ctx context.Context, hotel models.Hotel) error {
	return s.hotelRepo.Create(hotel)
}
